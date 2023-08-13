import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

export const groupRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      const groups = await ctx.prisma.group.findMany();
      return groups;
    }
  ),
  getByOwner: publicProcedure
    .input(z.object({ ownerId: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      const group = await ctx.prisma.group.findFirst({
        where: {
          ownerId: input.ownerId
        }
      });
      return group;
    }
  ),
  addToGroup: publicProcedure
    .input(z.object({ userId: z.string(), ownerId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const existingGroup = await ctx.prisma.group.findFirst({
        where: {
          ownerId: input.ownerId
        }
      });
      if (!existingGroup) {
        const newGroup = await ctx.prisma.group.create({
          data: {
            ownerId: input.ownerId,
            count: 1
          }
        });
        const userToGroup = await ctx.prisma.user.update({
          where: {
            id: input.userId
          },
          data: {
            groupId : newGroup.id
          }
        });
      } else {
        const newGroup = await ctx.prisma.group.update({
          where: {
            id: existingGroup.id
          },
          data: {
            count: existingGroup.count + 1
          }
        });
        const userToGroup = await ctx.prisma.user.update({
          where: {
            id: input.userId
          },
          data: {
            groupId : existingGroup.id
          }
        });
      }
      return true;
    }
  ),
  removeFromGroup: publicProcedure
    .input(z.object({ userId: z.string(), ownerId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const existingGroup = await ctx.prisma.group.findFirst({
        where: {
          ownerId: input.ownerId
        }
      });
      if (!existingGroup) {
        return false;
      } else {
        const newGroup = await ctx.prisma.group.update({
          where: {
            id: existingGroup.id
          },
          data: {
            count: existingGroup.count - 1
          }
        });
        const userToGroup = await ctx.prisma.user.update({
          where: {
            id: input.userId
          },
          data: {
            groupId : null
          }
        });
      }
      return true;
    }
  ),
});

