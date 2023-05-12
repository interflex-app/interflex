import { useRouter } from "next/router";

export const useIsApp = () => {
  const router = useRouter();

  return router.pathname.startsWith("/app");
};
