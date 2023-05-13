import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.team.deleteMany({
      where: {
        members: {
          some: {
            id: ctx.session.user.id,
          },
        },
        personal: true,
      },
    });

    await ctx.prisma.user.delete({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
});
