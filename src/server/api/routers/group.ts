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
});

