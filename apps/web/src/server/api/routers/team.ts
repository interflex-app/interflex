import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createTeamSchema } from "../../../components/team-switcher";

export const teamRouter = createTRPCRouter({
  getAllTeams: protectedProcedure.query(async ({ ctx }) => {
    const teams = await ctx.prisma.team.findMany({
      where: {
        members: {
          some: {
            id: ctx.session.user.id,
          },
        },
      },
    });

    return {
      personal: teams.find((team) => team.personal)!,
      shared: teams.filter((team) => !team.personal),
    };
  }),
  createTeam: protectedProcedure
    .input(createTeamSchema)
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.prisma.team.create({
        data: {
          name: input.name,
          members: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      return team;
    }),
});
