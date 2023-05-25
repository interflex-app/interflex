import { cliRouter } from "./routers/cli";
import { projectRouter } from "./routers/project";
import { teamRouter } from "./routers/team";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  team: teamRouter,
  project: projectRouter,
  user: userRouter,
  cli: cliRouter,
});

export type AppRouter = typeof appRouter;
