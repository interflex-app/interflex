import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { ApiError } from "../errors/api-error";
import jwt from "jsonwebtoken";
import { env } from "../../../env.mjs";

export const cliRouter = createTRPCRouter({
  authorize: protectedProcedure
    .input(z.object({ sessionId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.prisma.cliSession.findUnique({
        where: { id: input.sessionId },
      });

      if (!session) {
        throw new ApiError("Session not found", 404);
      }

      const token = jwt.sign({ userId: ctx.session.user.id }, env.JWT_SECRET);

      await ctx.prisma.cliSession.update({
        where: { id: input.sessionId },
        data: {
          token,
        },
      });
    }),
  getSession: protectedProcedure
    .input(z.object({ sessionId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.cliSession.findFirst({
        where: { id: input.sessionId, token: null },
        select: { id: true, expiresAt: true },
      });
    }),
});
