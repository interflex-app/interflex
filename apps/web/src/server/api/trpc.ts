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
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
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
          members: { select: { id: true } },
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
