import { useEffect, type PropsWithChildren } from "react";
import Navbar from "../components/navbar";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Skeleton } from "@interflex-app/ui";
import ThemeSwitcher from "../components/theme-switcher";
import dynamic from "next/dynamic";

const Logo = dynamic(() => import("../components/logo"), { ssr: false });

const HomeLayout: React.FC<
  PropsWithChildren<{ authProtected?: boolean; footer?: boolean }>
> = ({ children, authProtected = false, footer = true }) => {
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

      {footer && (
        <footer className="mt-24 border-t bg-background py-6">
          <div className="flex items-center justify-between gap-2 px-6">
            <div className="flex items-center gap-4">
              <Logo type="small" size={0.7} />
              Copyright Interflex &copy; {new Date().getFullYear()}
            </div>

            <ThemeSwitcher />
          </div>
        </footer>
      )}
    </div>
  );
};

export default HomeLayout;
