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
import { type NextPage } from "next";
import Link from "next/link";
import { ArrowRight, User, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import Logo from "../components/logo";
import { signIn, signOut, useSession } from "next-auth/react";

const Index: NextPage = () => {
  const { data } = useSession();

  console.log(data);

  return (
    <div>
      <div className="flex items-center justify-between px-8 py-12 md:px-14 md:py-16">
        <div className="flex items-center gap-12">
          <Link href={"/"}>
            <div className="block md:hidden">
              <Logo type="small" />
            </div>
            <div className="hidden md:block">
              <Logo type="large" />
            </div>
          </Link>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar>
                <AvatarImage
                  src={data?.user.image ?? "__NON_EXISTENT_IMAGE__"}
                  alt={`@${data?.user.name ?? "user"}`}
                />
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
                  <Link href={"/profile"}>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={async () => await signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={async () => await signIn("github")}>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Sign in</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-24 w-full text-center">
        <h2 className="text-2xl md:text-4xl">Let your apps be</h2>

        <h1 className="mb-12 mt-6 text-4xl font-bold sm:text-7xl md:text-8xl">
          <span className="gradient-text">multilingual</span>.
        </h1>

        <Link href={"/app"}>
          <Button>
            Get started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
