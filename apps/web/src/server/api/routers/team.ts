import {
  createTRPCRouter,
  protectedProcedure,
  protectedTeamProcedure,
} from "../trpc";
import { createTeamSchema } from "../../../components/team-switcher";
import { updateTeamNameSchema } from "../../../pages/app/settings";
import { ApiError } from "../errors/api-error";
import { z } from "zod";

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
  kickTeamMember: protectedTeamProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.session!.user.id) {
        throw new ApiError("Cannot kick yourself from the team");
      }

      await ctx.prisma.team.update({
        where: {
          id: ctx.team.id,
        },
        data: {
          members: {
            disconnect: {
              id: input.userId,
            },
          },
        },
      });
    }),
  inviteTeamMember: protectedTeamProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      if (input.email === ctx.session!.user.email) {
        throw new ApiError("Cannot invite yourself to the team", "email");
      }

      if (ctx.team.members.find((member) => member.email === input.email)) {
        throw new ApiError("User is already a member of the team", "email");
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (!user) {
        throw new ApiError("This user does not exist", "email");
      }

      await ctx.prisma.team.update({
        where: {
          id: ctx.team.id,
        },
        data: {
          members: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }),
});
