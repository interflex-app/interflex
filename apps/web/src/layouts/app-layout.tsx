import { type PropsWithChildren, useEffect, useMemo } from "react";
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

const teamLinks = [
  { label: "Projects", href: "/" },
  { label: "Settings", href: "/settings" },
];

const AppLayout: React.FC<
  PropsWithChildren<{
    authProtected?: boolean;
    projectLayout?: boolean;
    teamLayout?: boolean;
  }>
> = ({
  children,
  authProtected = true,
  projectLayout = false,
  teamLayout = false,
}) => {
  const router = useRouter();
  const { projectId } = router.query;

  const { data, status } = useSession();

  const links = useMemo(() => {
    if (projectLayout)
      return projectLinks.map((l) => ({
        ...l,
        href: `/app/${projectId?.toString() ?? "__ID__"}${
          l.href === "/" ? "" : l.href
        }`,
      }));

    if (teamLayout)
      return teamLinks.map((l) => ({
        ...l,
        href: `/app${l.href === "/" ? "" : l.href}`,
      }));

    return [];
  }, [projectLayout, teamLayout, projectId]);

  useEffect(() => {
    if (status === "unauthenticated" && authProtected) {
      void router.push("/");
    }
  }, [status, router, authProtected]);

  return (
    <div>
      <Navbar />

      {links.length > 0 && (
        <div className="flex flex-col items-start gap-6 px-8 pb-4 md:flex-row md:items-center md:gap-12 md:px-14">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-gray-500 dark:text-gray-400",
                router.asPath === link.href &&
                  "text-black underline underline-offset-8 dark:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <div className="my-6 w-full px-8 md:mt-12 md:px-14">
        {!!data || !authProtected ? children : null}
      </div>
    </div>
  );
};

export default AppLayout;
