import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@interflex-app/ui";
import { LayoutDashboard, LogIn, LogOut, User } from "lucide-react";
import dynamic from "next/dynamic";
import TeamSwitcher from "./team-switcher";
import { useIsApp } from "../hooks/use-is-app";
import { useTeam } from "../providers/team-provider";
import { useRouter } from "next/router";

const Logo = dynamic(() => import("./logo"), { ssr: false });

const Navbar: React.FC = () => {
  const router = useRouter();

  const { data } = useSession();

  const { clearTeam } = useTeam();
  const isApp = useIsApp();

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between bg-background px-8 py-12 md:px-14 md:py-16">
      <div className="flex items-center gap-12">
        <Link href={isApp && router.asPath !== "/app" ? "/app" : "/"}>
          <div className="block md:hidden">
            <Logo type="small" />
          </div>
          <div className="hidden md:block">
            <Logo size={0.8} type="large" />
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden md:block">{isApp && <TeamSwitcher />}</div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar>
                {data && data.user.image && data.user.name && (
                  <AvatarImage
                    src={data.user.image}
                    alt={`@${data.user.name}`}
                  />
                )}
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            {data && (
              <>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-lg font-medium leading-none">
                      {data.user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {data.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                {isApp && (
                  <div className="block md:hidden">
                    <DropdownMenuSeparator />

                    <TeamSwitcher className="w-full border-gray-200 px-2 hover:bg-transparent" />
                  </div>
                )}

                <DropdownMenuSeparator />
              </>
            )}

            {data && (
              <>
                <DropdownMenuGroup>
                  <Link href={"/app"}>
                    <DropdownMenuItem>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuGroup>
              {data ? (
                <>
                  <Link href={"/app/profile"}>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    onClick={async () => {
                      clearTeam();
                      await signOut();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => void signIn("github")}>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Sign in</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
