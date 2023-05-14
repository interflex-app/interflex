import Head from "next/head";
import DashboardHeader from "../../components/dashboard-header";
import AppLayout from "../../layouts/app-layout";
import { type NextPageWithLayout } from "../_app";
import { useTeam } from "../../providers/team-provider";
import DashboardSkeleton from "../../components/dashboard-skeleton";
import { RouterError, api } from "../../utils/api";
import { PropsWithChildren, useState } from "react";
import DangerZone from "../../components/danger-zone";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  useToast,
} from "@interflex-app/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/router";

const SettingCard: React.FC<
  PropsWithChildren<{ title: string; description: string }>
> = ({ children, title, description }) => {
  return (
    <div className="w-full rounded-md border border-gray-800 bg-gray-900 p-6">
      <h1 className="text-2xl">{title}</h1>
      <p className="mt-2 w-full text-sm text-gray-400 md:w-[80%]">
        {description}
      </p>

      <div className="mt-8 w-full">{children}</div>
    </div>
  );
};

export const updateTeamNameSchema = z.object({ name: z.string().min(1) });

const Settings: NextPageWithLayout = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [showDeleteTeamDialog, setShowDeleteTeamDialog] = useState(false);

  const { team, clearTeam } = useTeam();

  const { mutateAsync: updateTeamName, isLoading: updateTeamNameLoading } =
    api.team.updateTeamName.useMutation();

  const { mutateAsync: deleteTeam, isLoading: deleteTeamLoading } =
    api.team.deleteTeam.useMutation();

  const updateTeamNameForm = useForm<z.infer<typeof updateTeamNameSchema>>({
    resolver: zodResolver(updateTeamNameSchema),
  });

  const { data, isLoading, isError, refetch } = api.team.getTeam.useQuery(
    { teamId: team ?? "" },
    { enabled: !!team }
  );

  const utils = api.useContext();

  if (!team || !data || isLoading || isError) return <DashboardSkeleton />;

  return (
    <div>
      <Head>
        <title>Interflex | Team Settings</title>
      </Head>

      <DashboardHeader title="Settings" />

      <div className="flex flex-col gap-4">
        <SettingCard
          title="Team Name"
          description="This is your team's name. It will be visible to all the members of
            this organization."
        >
          <form
            className="w-full"
            onSubmit={updateTeamNameForm.handleSubmit(async (formData) => {
              try {
                await updateTeamName({ teamId: team, ...formData });
                await refetch();
                await utils.team.getAllTeams.invalidate();

                toast({
                  title: "Team name updated",
                  description: "Your team name has been updated successfully.",
                });
              } catch (e) {
                Object.entries(
                  (e as RouterError).data.zodError?.fieldErrors ?? []
                ).forEach(([key, value]) =>
                  updateTeamNameForm.setError(key as "root", {
                    message: value?.[0] ?? "",
                  })
                );
              }
            })}
          >
            <div className="flex w-full items-end gap-4">
              <div className="w-full space-y-2 md:w-[40%] xl:w-[25%]">
                <Label htmlFor="name">Team name</Label>
                <Input
                  id="name"
                  disabled={data.personal}
                  placeholder="Enter team name..."
                  defaultValue={data.name}
                  {...updateTeamNameForm.register("name")}
                />
              </div>

              <Button
                disabled={data.personal}
                type="submit"
                loading={updateTeamNameLoading}
              >
                Save
              </Button>
            </div>

            {updateTeamNameForm.formState.errors.name?.message && (
              <div className="mt-2 text-sm text-red-600">
                {updateTeamNameForm.formState.errors.name?.message}
              </div>
            )}
          </form>
        </SettingCard>

        <SettingCard
          title="Team Members"
          description="Manage members of your team. Each member will be able to access and modify all the projects of this team."
        >
          Input here
        </SettingCard>

        <DangerZone>
          <Dialog
            open={showDeleteTeamDialog}
            onOpenChange={setShowDeleteTeamDialog}
          >
            <DialogTrigger asChild>
              <Button
                disabled={data.personal}
                onClick={() => setShowDeleteTeamDialog(true)}
              >
                Delete team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete team</DialogTitle>
                <DialogDescription>
                  Every project in that team will be removed.
                </DialogDescription>
              </DialogHeader>

              <p>
                Every project in that team will be removed. You have to move
                every project to a different team before the removal.
              </p>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteTeamDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  loading={deleteTeamLoading}
                  onClick={async () => {
                    try {
                      await deleteTeam({ teamId: team });
                      clearTeam();
                      await utils.team.getAllTeams.invalidate();

                      await router.push("/app");

                      setShowDeleteTeamDialog(false);
                    } catch (e) {}
                  }}
                >
                  Delete team
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DangerZone>
      </div>
    </div>
  );
};

Settings.getLayout = (page) => <AppLayout teamLayout>{page}</AppLayout>;

export default Settings;
