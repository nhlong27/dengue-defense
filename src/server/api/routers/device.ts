import {Consumer, Kafka} from "kafkajs"
import { env } from "@/env.mjs";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { publishTelemetry } from "@/utils/emulator";
import { Session } from "next-auth";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

const partitions = 1;
const replicationFactor = 1;

const kafka = new Kafka({
  brokers: [env.KAFKA_BROKER_URL],
  sasl: {
    mechanism: "scram-sha-512",
    username: env.KAFKA_USERNAME,
    password: env.KAFKA_PASSWORD,
  },
  ssl: true,
});

const admin = kafka.admin();

const createTopic = async (topicName: string) => {
  await admin.connect();
  await admin.createTopics({
    validateOnly: false,
    waitForLeaders: true,
    topics: [
      {
        topic: topicName,
        numPartitions: partitions,
        replicationFactor: replicationFactor,
      },
    ],
  });
  await admin.disconnect();
};

const producer = kafka.producer();

const produceMessage = async (topicName: string, message: Record<string, number>) => {
  await producer.connect();
  
  console.log("Sending message to " + topicName + " topic. " + "Message: " + JSON.stringify(message, null, '\t'))
  
  await producer.send({
    topic: topicName,
    messages: [{ value: JSON.stringify(message) }],
  });
  
  console.log("Message sent successfully")

  await producer.disconnect();
};

const consumeMessage = async (consumer: Consumer, topicName: string, ctx: {
  session: Session | null;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
}) => {
  await consumer.connect();
  await consumer.subscribe({ topic: topicName, fromBeginning: true });

  console.log("Consuming message from " + topicName + " topic.")

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Getting data')
      const log = JSON.parse(message.value?.toString('utf-8') ?? '')
      console.log({
        topic: topic,
        partition: partition,
        message: log
      });
      
      // upsert to database
      const addToLog = await ctx.prisma.log.create({
        data: {
          deviceId: Number(topicName),
          temp: log.temp,
          spo2: log.spo2,
          HP: log.HP,
        },
      });
      console.log("Message inserted into database successfully for device: " + topicName)
    },
  });

};

export const deviceRouter = createTRPCRouter({
  start: publicProcedure
    .input(z.object({ deviceId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await createTopic(input.deviceId);
      const interval = setInterval( ()=>{ 
        produceMessage(input.deviceId, publishTelemetry()).then(res=>console.log(res)).catch(err=>console.log(err))
      }, 10000)

      const device = await ctx.prisma.device.update({
        where: {
          id: Number(input.deviceId),
        },
        data: {
          active: true,
          interval: Number(interval),
        },
      });

      const consumer = kafka.consumer({ groupId: input.deviceId});
      await consumeMessage(consumer, input.deviceId, ctx)
    }),
    
  pause: publicProcedure
    .input(z.object({ deviceId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const device = await ctx.prisma.device.update({
        where: {
          id: Number(input.deviceId),
        },
        data: {
          active: false,
        },
      });
      clearInterval(device.interval!);
    }),
  
  remove: publicProcedure
    .input(z.object({ deviceId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const device = await ctx.prisma.device.findFirst({
        where: {
          id: Number(input.deviceId),
        },
      });
      if (device?.active) {
        clearInterval(device.interval!);
        const consumer = kafka.consumer({ groupId: input.deviceId});
        await consumer.disconnect();
        await admin.connect();
        await admin.deleteTopics({
          topics: [input.deviceId],
        });
        await admin.disconnect();
      }
      const deviceToDelete = await ctx.prisma.device.delete({
        where: {
          id: Number(input.deviceId),
        },
      });
      return deviceToDelete;
    }
  ),

  get: publicProcedure
    .input(z.object({ deviceId: z.string() }))
    .query(async ({ input, ctx }) => {
      const device = await ctx.prisma.device.findFirst({
        where: {
          id: Number(input.deviceId),
        },
      });
      const {interval, ...rest} = device!
      return rest;
    }
  ),
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      const devices = await ctx.prisma.device.findMany();
      return devices;
    }
  ),
  create: publicProcedure
    .input(z.object({ title: z.string(), patient: z.string().optional(), ownerId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      console.log('working')
      const device = await ctx.prisma.device.create({
        data: {
          title: input.title,
          patient: input.patient,
          ownerId: input.ownerId,
        },
      });
      return device;
    }
  ),
  assign: publicProcedure
    .input(z.object({ deviceId: z.string(), patientId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const device = await ctx.prisma.device.update({
        where: {
          id: Number(input.deviceId),
        },
        data: {
          patient: input.patientId,
        },
      });
      return device;
    }
  ),
});
