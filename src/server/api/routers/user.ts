import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import sha256 from "crypto-js/sha256";
import { omit } from "lodash";

const hashPassword = (password: string) => {
  return sha256(password).toString()
};

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string().optional(), email: z.string().email(), password: z.string(), role: z.enum(['USER', 'ADMIN']) }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.create({
        data: { ...input, password: hashPassword(input.password) },
      });
      const {password , ...rest} = user;
      return rest;
    }
  ),
  get: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
      });
      const {password , ...rest} = user;
      return rest;
    }
  ),
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      const users = await ctx.prisma.user.findMany();
      const newUsers = users.map(user=>{
        const {password , ...rest} = user;
        return rest;
      })
      return newUsers
    }
  ),
  getUnassigned: publicProcedure
    .query(async ({ ctx }) => {
      const users = await ctx.prisma.user.findMany({
        where: {
          role: 'USER',
        }
      });
      const assignedDevices = await ctx.prisma.device.findMany({
        where: {
          patient: {
            not: null,
          }
        }
      });
      const assignedUsers = assignedDevices.map(device=>device.patient);
      const unassignedUsers = users.filter(user=>!assignedUsers.includes(user.id));
      const newUsers = unassignedUsers.map(user=>{
        const {password , ...rest} = user;
        return rest;
      }
      )
      return newUsers
    }
  ),
  remove: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.delete({
        where: {
          id: input.userId,
        },
      });
      const {password , ...rest} = user;
      return rest;
    }
  ),
  checkIfOAuth: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
      });
      if (user?.password){
        return null;
      }
      else {
        const {password , ...rest} = user;
        return rest;
      };
    }
  ),
  updateRole: publicProcedure
    .input(z.object({ email: z.string().email(), role: z.enum(['USER', 'ADMIN']) }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.update({
        where: {
          email: input.email,
        },
        data: {
          role: input.role,
          password: input.role
        },
      });
      return user;
    }
  ),
});