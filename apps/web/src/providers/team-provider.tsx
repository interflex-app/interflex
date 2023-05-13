import {
  type PropsWithChildren,
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";
import { type RouterOutputs } from "../utils/api";
import { getCookie, removeCookies, setCookie } from "cookies-next";
import { useRouter } from "next/router";

export type Team = RouterOutputs["team"]["getAllTeams"]["personal"];

interface TeamInterface {
  team: Team["id"] | null;
  changeTeam: (team: Team) => void;
  clearTeam: () => void;
}

const TeamContext = createContext({} as TeamInterface);

const TEAM_COOKIE_KEY = "__TEAM_INTERFLEX__";

export const TeamProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  const [team, setTeam] = useState<Team["id"] | null>(null);

  useEffect(() => {
    const cookieTeam = getCookie(TEAM_COOKIE_KEY);
    if (cookieTeam) {
      setTeam(cookieTeam.toString());
    }
  }, [setTeam]);

  const changeTeam = (team: Team) => {
    setCookie(TEAM_COOKIE_KEY, team.id);
    setTeam(team.id);

    void router.push("/app");
  };

  const clearTeam = () => {
    removeCookies(TEAM_COOKIE_KEY);
    setTeam(null);
  };

  return (
    <TeamContext.Provider value={{ team, changeTeam, clearTeam }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const teamContext = useContext(TeamContext);

  if (!teamContext) {
    throw new Error("useTeam must be used within a TeamProvider");
  }

  return teamContext;
};
