import { teamRouter } from "./routers/team";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  team: teamRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
