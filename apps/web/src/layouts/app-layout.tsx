import { type PropsWithChildren, useEffect } from "react";
import Navbar from "../components/navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { cn } from "@interflex-app/ui";

const projectLinks = [
  { label: "Overview", href: "/" },
  { label: "Translations", href: "/translations" },
  { label: "Settings", href: "/settings" },
];

const AppLayout: React.FC<
  PropsWithChildren<{
    authProtected?: boolean;
    projectLayout?: boolean;
  }>
> = ({ children, authProtected = true, projectLayout }) => {
  const router = useRouter();
  const { projectId } = router.query;

  const { data, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated" && authProtected) {
      void router.push("/");
    }
  }, [status, router, authProtected]);

  return (
    <div>
      <Navbar />

      {projectLayout && (
        <div className="flex flex-col items-start gap-6 px-8 pb-4 md:flex-row md:items-center md:gap-12 md:px-14">
          {projectLinks.map((link) => {
            const href = `/app/${projectId?.toString() ?? "__ID__"}${
              link.href === "/" ? "" : link.href
            }`;

            return (
              <Link
                key={link.href}
                href={href}
                className={cn(
                  router.asPath === href &&
                    "font-semibold underline underline-offset-8"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-6 w-full px-8 md:mt-12 md:px-14">
        {!!data || !authProtected ? children : null}
      </div>
    </div>
  );
};

export default AppLayout;
