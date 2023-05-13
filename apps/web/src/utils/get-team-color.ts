import seedrandom from "seedrandom";

export const getTeamColor = (teamId: string) => {
  const random = seedrandom(teamId.slice(15) + teamId)();

  return random * 365;
};
