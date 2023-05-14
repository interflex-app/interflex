import {
  createTRPCRouter,
  protectedProcedure,
  protectedTeamProcedure,
} from "../trpc";
import { createTeamSchema } from "../../../components/team-switcher";
import { updateTeamNameSchema } from "../../../pages/app/settings";
import { ApiError } from "../errors/api-error";

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
  getTeam: protectedTeamProcedure.query(({ ctx }) => {
    return ctx.team;
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
  deleteTeam: protectedTeamProcedure.mutation(async ({ ctx, input }) => {
    if (ctx.team.personal) {
      throw new ApiError("Cannot delete personal team");
    }

    await ctx.prisma.team.delete({
      where: {
        id: input.teamId,
      },
    });
  }),
  updateTeamName: protectedTeamProcedure
    .input(updateTeamNameSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.team.personal) {
        throw new ApiError("Cannot edit personal team");
      }

      await ctx.prisma.team.update({
        where: {
          id: input.teamId,
        },
        data: {
          name: input.name,
        },
      });
    }),
});
