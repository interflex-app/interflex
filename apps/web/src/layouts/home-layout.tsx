import { useEffect, type PropsWithChildren } from "react";
import Navbar from "../components/navbar";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Skeleton } from "@interflex-app/ui";

const HomeLayout: React.FC<PropsWithChildren<{ authProtected?: boolean }>> = ({
  children,
  authProtected = false,
}) => {
  const router = useRouter();
  const { data, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated" && authProtected) {
      void router.push("/");
    }
  }, [status, router]);

  return (
    <div>
      <Navbar />

      <div className="mt-12 w-full">
        {!!data || !authProtected ? (
          children
        ) : (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeLayout;
