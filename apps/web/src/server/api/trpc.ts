import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";
import { getServerAuthSession } from "../auth";
import { prisma } from "../db";

type CreateContextOptions = {
  session: Session | null;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const session = await getServerAuthSession({ req, res });

  return createInnerTRPCContext({
    session,
  });
};

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { z, ZodError } from "zod";

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error, input }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
        zodErrorIssues:
          error.cause instanceof ZodError
            ? error.cause.issues.map((issue) => {
                if (issue.path.length <= 1) {
                  return {
                    ...issue,
                    input,
                  };
                }

                const inputFromPath = issue.path
                  .slice(0, issue.path.length - 1)
                  .reduce(
                    (acc, curr) =>
                      acc[curr] as unknown as Record<
                        string,
                        Record<string, string>
                      >,
                    input as Record<string, Record<string, string>>
                  );

                return {
                  ...issue,
                  input: inputFromPath,
                };
              })
            : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

export const protectedTeamProcedure = protectedProcedure
  .input(z.object({ teamId: z.string().min(1) }))
  .use(
    t.middleware(async ({ ctx, input, next }) => {
      const team = await ctx.prisma.team.findUnique({
        where: {
          id: (input as { teamId: string }).teamId,
        },
        include: {
          members: true,
        },
      });

      if (!team) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (!team.members.some((member) => member.id === ctx.session?.user.id)) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return next({
        ctx: {
          ...ctx,
          team,
        },
      });
    })
  );

export const protectedProjectProcedure = protectedProcedure
  .input(z.object({ projectId: z.string().min(1) }))
  .use(
    t.middleware(async ({ ctx, input, next }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          id: (input as { projectId: string }).projectId,
        },
        include: {
          team: {
            include: {
              members: {
                where: {
                  id: ctx.session?.user.id ?? "__NON_EXISTENT_ID__",
                },
              },
            },
          },
        },
      });

      if (!project) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return next({
        ctx: {
          ...ctx,
          project,
        },
      });
    })
  );
