import { useRouter } from "next/router";
import { api } from "../utils/api";

export const useProject = () => {
  const router = useRouter();
  const { projectId } = router.query;

  const {
    data: project,
    isLoading,
    isError,
    refetch,
  } = api.project.getProject.useQuery(
    {
      projectId: projectId?.toString() ?? "",
    },
    {
      enabled: !!projectId,
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
