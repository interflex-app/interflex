import { type PropsWithChildren, useEffect } from "react";
import Navbar from "../components/navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const AppLayout: React.FC<PropsWithChildren<{ authProtected?: boolean }>> = ({
  children,
  authProtected = true,
}) => {
  const router = useRouter();
  const { data, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated" && authProtected) {
      void router.push("/");
    }
  }, [status, router, authProtected]);

  return (
    <div>
      <Navbar />

      <div className="mt-12 w-full px-8 md:px-14">
        {!!data || !authProtected ? children : null}
      </div>
    </div>
  );
};

export default AppLayout;
