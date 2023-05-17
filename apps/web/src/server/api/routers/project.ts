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
import { createZodEnum } from "../../../utils/create-zod-enum";
import { SupportedLanguage } from "../../../consts";

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
  syncTranslations: protectedProjectProcedure
    .input(
      z.object({
        translations: z.array(
          z.object({
            id: z.string().optional(),
            key: z.string().min(1),
            values: z.array(
              z.object({
                language: z.enum(createZodEnum(SupportedLanguage)),
                value: z.string().min(1),
              })
            ),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentTranslations = await ctx.prisma.translation.findMany({
        where: {
          projectId: ctx.project.id,
        },
      });

      const newTranslations = input.translations.map((t) => {
        const languages = t.values.map((v) => v.language);
        const uniqueLanguages = [...new Set(languages)];

        if (languages.length !== uniqueLanguages.length) {
          throw new ApiError(
            "Each language can only be used once per translation.",
            "translations"
          );
        }

        const existingTranslation = currentTranslations.find(
          (ct) => ct.id === t.id
        );

        if (existingTranslation) {
          const value = t.values.reduce((acc, curr) => {
            (acc as Record<SupportedLanguage, string>)[curr.language] =
              curr.value;
            return acc;
          }, {});

          return {
            ...existingTranslation,
            value,
            key: t.key,
            projectId: ctx.project.id,
          };
        }

        const duplicateKey = currentTranslations.find((ct) => ct.key === t.key);

        if (duplicateKey) {
          throw new ApiError(
            `The key "${t.key}" already exists.`,
            "translations"
          );
        }

        const value = t.values.reduce((acc, curr) => {
          (acc as Record<SupportedLanguage, string>)[curr.language] =
            curr.value;
          return acc;
        }, {});

        return {
          value,
          key: t.key,
          projectId: ctx.project.id,
        };
      });

      await ctx.prisma.$transaction([
        ctx.prisma.translation.deleteMany({
          where: {
            projectId: ctx.project.id,
          },
        }),
        ctx.prisma.translation.createMany({
          data: newTranslations,
        }),
      ]);
    }),
  getTranslations: protectedProjectProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.translation.findMany({
      where: {
        projectId: ctx.project.id,
      },
    });
  }),
});
