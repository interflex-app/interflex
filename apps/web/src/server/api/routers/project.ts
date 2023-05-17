import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  protectedProjectProcedure,
  protectedTeamProcedure,
} from "../trpc";
import { createProjectSchema } from "../../../pages/app";
import {
  linkLanguageToOrFromProjectSchema,
  updateProjectNameSchema,
} from "../../../pages/app/[projectId]/settings";
import { projectLanguages } from "../../../utils/project-languages";
import { Prisma } from "@prisma/client";
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
  addLanguageToProject: protectedProjectProcedure
    .input(linkLanguageToOrFromProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const currentLanguages = projectLanguages(ctx.project.languages);

      if (currentLanguages.map((l) => l.value).includes(input.language)) {
        throw new ApiError(
          "This language has already been added to the project.",
          "language"
        );
      }

      const newLanguages = [
        ...currentLanguages.map((l) => l.value),
        input.language,
      ] as Prisma.JsonArray;

      await ctx.prisma.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          languages: newLanguages,
        },
      });
    }),
  removeLanguageFromProject: protectedProjectProcedure
    .input(linkLanguageToOrFromProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const currentLanguages = projectLanguages(ctx.project.languages);

      if (currentLanguages.length === 1) {
        throw new ApiError(
          "You cannot remove the last language from a project.",
          "language"
        );
      }

      if (!currentLanguages.map((l) => l.value).includes(input.language)) {
        throw new ApiError(
          "This language has not been added to the project.",
          "language"
        );
      }

      const newLanguages = currentLanguages
        .map((l) => l.value)
        .filter((l) => l !== input.language) as Prisma.JsonArray;

      await ctx.prisma.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          languages: newLanguages,
        },
      });
    }),
});
