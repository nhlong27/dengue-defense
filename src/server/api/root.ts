import { createTRPCRouter } from "@/server/api/trpc";
import { deviceRouter } from "./routers/device";
import { logRouter } from "./routers/log";
import { userRouter } from "./routers/user";
import { groupRouter } from "./routers/group";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  device: deviceRouter,
  log: logRouter,
  user: userRouter,
  group: groupRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
