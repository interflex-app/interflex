import Head from "next/head";
import DashboardHeader from "../../components/dashboard-header";
import AppLayout from "../../layouts/app-layout";
import { NextPageWithLayout } from "../_app";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@interflex-app/ui";
import { User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import DashboardSkeleton from "../../components/dashboard-skeleton";
import DangerZone from "../../components/danger-zone";
import { useState } from "react";
import { api } from "../../utils/api";
import { useRouter } from "next/router";
import { useTeam } from "../../providers/team-provider";

const Profile: NextPageWithLayout = () => {
  const [showRemoveAccountDialog, setShowRemoveAccountDialog] = useState(false);

  const router = useRouter();
  const { clearTeam } = useTeam();
  const { data } = useSession();

  const { mutateAsync: removeAccount, isLoading: removeAccountLoading } =
    api.user.deleteAccount.useMutation();

  if (!data) {
    return <DashboardSkeleton />;
  }

  return (
    <div>
      <Head>
        <title>Interflex | Profile</title>
      </Head>

      <DashboardHeader title="Profile" />

      <div>
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
          <Avatar className="h-36 w-36">
            <AvatarImage
              src={data.user.image ?? "__NON_EXISTENT_IMAGE__"}
              alt={`@${data?.user.name ?? "user"}`}
            />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>

          <div className="text-center md:text-left">
            <h1 className="text-5xl">{data.user.name}</h1>
            <p className="mt-2 text-xl font-medium">{data.user.email}</p>

            <p className="mt-4 text-sm text-gray-500">{data.user.id}</p>
          </div>
        </div>

        <div className="mt-24">
          <DangerZone>
            <Dialog
              open={showRemoveAccountDialog}
              onOpenChange={setShowRemoveAccountDialog}
            >
              <DialogTrigger asChild>
                <Button>Remove account</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Remove account</DialogTitle>
                  <DialogDescription>
                    Delete your account from Interflex.
                  </DialogDescription>
                </DialogHeader>

                <p>
                  Are you sure? You won't be able to manage your projects and
                  teams anymore.
                </p>

                <p className="text-xs">
                  NOTE: Make sure you invite team members to your teams before
                  removing the account. All your personal projects will be
                  deleted.
                </p>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowRemoveAccountDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        await removeAccount();
                        await signOut();

                        clearTeam();

                        await router.push("/");

                        setShowRemoveAccountDialog(false);
                      } catch (e) {}
                    }}
                    loading={removeAccountLoading}
                  >
                    Remove account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DangerZone>
        </div>
      </div>
    </div>
  );
};

Profile.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Profile;
