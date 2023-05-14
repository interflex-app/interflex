import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  protectedProjectProcedure,
  protectedTeamProcedure,
} from "../trpc";
import { createProjectSchema } from "../../../pages/app";
import { updateProjectNameSchema } from "../../../pages/app/[projectId]/settings";

export const projectRouter = createTRPCRouter({
  getAllProjects: protectedProcedure
    .input(z.object({ teamId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const projects = await ctx.prisma.project.findMany({
        where: {
          team: {
            id: input.teamId,
            members: {
              some: {
                id: ctx.session.user.id,
              },
            },
          },
        },
      });

      return projects;
    }),
  getProject: protectedProjectProcedure.query(({ ctx }) => {
    return ctx.project;
  }),
  createProject: protectedTeamProcedure
    .input(createProjectSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.project.create({
        data: {
          name: input.name,
          team: {
            connect: {
              id: input.teamId,
            },
          },
        },
      });
    }),
  updateProjectName: protectedProjectProcedure
    .input(updateProjectNameSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          name: input.name,
        },
      });
    }),
  deleteProject: protectedProjectProcedure.mutation(async ({ ctx, input }) => {
    await ctx.prisma.project.delete({
      where: {
        id: input.projectId,
      },
    });
  }),
});
