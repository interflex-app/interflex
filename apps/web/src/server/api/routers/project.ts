import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  protectedTeamProcedure,
} from "../trpc";
import { createProjectSchema } from "../../../pages/app";
import { ApiError } from "../errors/api-error";

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
  getProject: protectedTeamProcedure
    .input(z.object({ projectId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: {
          id: input.projectId,
        },
      });

      if (!project) {
        throw new ApiError("Project not found!", "projectId");
      }

      return project;
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
});
