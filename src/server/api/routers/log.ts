import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

export const logRouter = createTRPCRouter({
  getByDevice: publicProcedure
    .input(z.object({ deviceId: z.string().nullable() }))
    .query(async ({ input, ctx }) => {
      let logs;
      if (input.deviceId){
        logs = await ctx.prisma.log.findMany({
          where: {
            deviceId: Number(input.deviceId),
          },
        });
      } else {
        logs = await ctx.prisma.log.findMany();
      }
      return logs;
    }
  ),
  get: publicProcedure
    .input(z.object({ logId: z.string() }))
    .query(async ({ input, ctx }) => {
      const log = await ctx.prisma.log.findFirst({
        where: {
          id: Number(input.logId),
        },
      });
      return log;
    }
  ),
  remove: publicProcedure
    .input(z.object({ logId: z.string(), logged_at: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const log = await ctx.prisma.log.delete({
        where: {
          id_logged_at: { id: Number(input.logId), logged_at: input.logged_at }
        },
      });
      return log;
    }
  ),
  removeAll: publicProcedure
    .mutation(async ({ ctx }) => {
      const logs = await ctx.prisma.log.deleteMany();
      return logs;
    }
  ),
});

