import { Button } from "@interflex-app/ui";
import HomeLayout from "../../layouts/home-layout";
import { NextPageWithLayout } from "../_app";
import { useQueryParams } from "../../hooks/use-query-params";
import { z } from "zod";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardSkeleton from "../../components/dashboard-skeleton";
import { api } from "../../utils/api";
import { signIn, useSession } from "next-auth/react";

const CliAuth: NextPageWithLayout = () => {
  const { status } = useSession();

  const [authFinished, setAuthFinished] = useState(false);

  const router = useRouter();
  const { sessionId } = useQueryParams({ sessionId: z.string() });

  const { data, isLoading, isError } = api.cli.getSession.useQuery(
    { sessionId: sessionId || "" },
    { enabled: !!sessionId }
  );

  const { mutateAsync: authorize, isLoading: isAuthorizeLoading } =
    api.cli.authorize.useMutation({
      onSuccess: () => setAuthFinished(true),
    });

  useEffect(() => {
    if ((!sessionId && router.isReady) || (!isLoading && !isError && !data)) {
      void router.push("/");
    }
  }, [sessionId, router.isReady, data, isLoading, isError]);

  useEffect(() => {
    if (status === "unauthenticated" && router.isReady && !!sessionId) {
      signIn("github", { callbackUrl: `/auth/cli?sessionId=${sessionId}` });
    }
  }, [status, router.isReady, sessionId]);

  if (!data || isLoading || isError)
    return (
      <div className="px-8 md:px-14">
        <DashboardSkeleton />
      </div>
    );

  return (
    <div className="px-8 md:px-14">
      <h2 className="text-2xl md:text-4xl">Authentication</h2>

      <h1 className="gradient-text mb-12 mt-3 text-4xl font-bold sm:text-6xl md:mt-6 md:text-7xl">
        Sign into our CLI
      </h1>

      {authFinished ? (
        <p>You can now close this tab.</p>
      ) : (
        <>
          <p className="text-foreground/50">
            Your session will expire on:{" "}
            <span className="text-foreground">
              {data.expiresAt.toLocaleDateString()}
            </span>
          </p>

          <div className="mt-12">
            <Button
              loading={isAuthorizeLoading}
              onClick={async () => {
                try {
                  await authorize({ sessionId: data.id });
                } catch (e) {}
              }}
            >
              Authorize the CLI
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

CliAuth.getLayout = (page) => <HomeLayout>{page}</HomeLayout>;

export default CliAuth;
