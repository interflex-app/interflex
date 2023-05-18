import { number, z } from "zod";
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
import { SupportedLanguage, TranslationAction } from "../../../consts";
import {
  CreateTranslationActionEntry,
  DeleteTranslationActionEntry,
  UpdateTranslationActionEntry,
} from "../../../hooks/use-translation-state";

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
          z.union([
            z.object({
              action: z.enum([TranslationAction.Create]),
              id: z.string().min(1),
              key: z
                .string()
                .regex(/^[A-Za-z0-9._]+$/g)
                .min(1),
              values: z.array(
                z.object({
                  language: z.enum(createZodEnum(SupportedLanguage)),
                  value: z.string().min(1),
                })
              ),
            }),
            z.object({
              action: z.enum([TranslationAction.Update]),
              id: z.string().min(1),
              key: z
                .string()
                .regex(/^[A-Za-z0-9._]+$/g)
                .min(1),
              values: z.array(
                z.object({
                  language: z.enum(createZodEnum(SupportedLanguage)),
                  value: z.string().min(1),
                })
              ),
            }),
            z.object({
              action: z.enum([TranslationAction.Delete]),
              id: z.string().min(1),
            }),
          ])
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentTranslations = await ctx.prisma.translation.findMany({
        where: {
          projectId: ctx.project.id,
        },
      });

      const valuesToObject = (
        values: {
          language: SupportedLanguage;
          value: string;
        }[]
      ): Prisma.JsonObject =>
        values.reduce((acc, curr) => {
          acc[curr.language] = curr.value;
          return acc;
        }, {} as Record<SupportedLanguage, string>);

      const toDelete = input.translations
        .filter((t) => t.action === TranslationAction.Delete)
        .map((t) => (t as DeleteTranslationActionEntry).id);

      const toCreate: Prisma.TranslationCreateManyArgs["data"] =
        input.translations
          .map((t, i) => [t, i])
          .filter(
            ([t]) =>
              (t as CreateTranslationActionEntry).action ===
              TranslationAction.Create
          )
          .map(([t, i]) => {
            const entry = t as CreateTranslationActionEntry;
            const idx = i as number;

            if (currentTranslations.map((t) => t.key).includes(entry.key)) {
              throw new ApiError(`The "${entry.key}" key is already in use.`, [
                "translations",
                idx,
                "key",
              ]);
            }

            return {
              key: entry.key,
              projectId: ctx.project.id,
              value: valuesToObject(entry.values),
            };
          });

      const toUpdate: Prisma.TranslationUpdateArgs[] = input.translations
        .map((t, i) => [t, i])
        .filter(
          ([t]) =>
            (t as UpdateTranslationActionEntry).action ===
            TranslationAction.Update
        )
        .map(([t, i]) => {
          const entry = t as UpdateTranslationActionEntry;
          const idx = i as number;

          const withSameKey = currentTranslations.find(
            (t) => t.key === entry.key
          );

          if (withSameKey && withSameKey.id !== entry.id) {
            throw new ApiError(`The "${entry.key}" key is already in use.`, [
              "translations",
              idx,
              "key",
            ]);
          }

          return {
            where: {
              id: entry.id,
            },
            data: {
              key: entry.key,
              value: valuesToObject(entry.values),
            },
          };
        });

      await ctx.prisma.$transaction([
        ctx.prisma.translation.deleteMany({
          where: {
            id: {
              in: toDelete,
            },
          },
        }),
        ctx.prisma.translation.createMany({
          data: toCreate,
        }),
        ...toUpdate.map((args) => ctx.prisma.translation.update(args)),
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
