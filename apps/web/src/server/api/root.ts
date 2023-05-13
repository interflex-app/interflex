import { projectRouter } from "./routers/project";
import { teamRouter } from "./routers/team";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  team: teamRouter,
  project: projectRouter,
});

export type AppRouter = typeof appRouter;
