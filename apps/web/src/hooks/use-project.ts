import { useRouter } from "next/router";
import { api } from "../utils/api";
import { useTeam } from "../providers/team-provider";

export const useProject = () => {
  const router = useRouter();
  const { projectId } = router.query;

  const { team } = useTeam();

  const {
    data: project,
    isLoading,
    isError,
    refetch,
  } = api.project.getProject.useQuery(
    {
      projectId: projectId?.toString() ?? "",
      teamId: team ?? "",
    },
    {
      enabled: !!projectId && !!team,
      onError: () => router.push("/app"),
      retry: false,
    }
  );

  return {
    project,
    isLoading,
    isError,
    refetch,
  };
};
