import Head from "next/head";
import DashboardHeader from "../../components/dashboard-header";
import AppLayout from "../../layouts/app-layout";
import { type NextPageWithLayout } from "../_app";
import { useTeam } from "../../providers/team-provider";
import DashboardSkeleton from "../../components/dashboard-skeleton";
import { RouterError, api } from "../../utils/api";
import { useState } from "react";
import DangerZone from "../../components/danger-zone";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DataTable,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Input,
  Label,
  useToast,
} from "@interflex-app/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/router";
import SettingCard from "../../components/setting-card";
import { MoreHorizontal, User } from "lucide-react";
import { useSession } from "next-auth/react";

export const updateTeamNameSchema = z.object({ name: z.string().min(1) });

const Settings: NextPageWithLayout = () => {
  const { toast } = useToast();
  const router = useRouter();

  const { data: sesh } = useSession();

  const [showDeleteTeamDialog, setShowDeleteTeamDialog] = useState(false);
  const [showDeleteTeamMemberDialog, setShowDeleteTeamMemberDialog] =
    useState(false);

  const { team, clearTeam } = useTeam();

  const { mutateAsync: updateTeamName, isLoading: updateTeamNameLoading } =
    api.team.updateTeamName.useMutation();

  const { mutateAsync: kickTeamMember, isLoading: kickTeamMemberLoading } =
    api.team.kickTeamMember.useMutation();

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

  if (!team || !data || isLoading || isError || !sesh)
    return <DashboardSkeleton />;

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
            <div className="flex w-full items-end gap-4 xl:w-[40%]">
              <div className="w-full space-y-2">
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
          <div className="w-full xl:w-[40%]">
            <DataTable
              data={data.members}
              columns={[
                {
                  accessorKey: "image",
                  header: "Avatar",
                  cell: ({ getValue }) => (
                    <Avatar>
                      <AvatarImage
                        src={(getValue() as string) ?? "__NON_EXISTENT_IMAGE__"}
                      />
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                  ),
                },
                { accessorKey: "name", header: "Name" },
                { accessorKey: "email", header: "Email" },
                {
                  id: "actions",
                  cell: ({ row }) => (
                    <Dialog
                      open={showDeleteTeamMemberDialog}
                      onOpenChange={setShowDeleteTeamMemberDialog}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            disabled={row.original.id === sesh.user.id}
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DialogTrigger asChild>
                            <DropdownMenuItem>
                              Remove from team
                            </DropdownMenuItem>
                          </DialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Remove from team</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to remove {row.original.name}{" "}
                            from the team?
                          </DialogDescription>
                        </DialogHeader>

                        <p>
                          They will no longer be able to access the team's
                          projects.
                        </p>

                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setShowDeleteTeamMemberDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            loading={kickTeamMemberLoading}
                            onClick={async () => {
                              try {
                                await kickTeamMember({
                                  teamId: team,
                                  userId: row.original.id,
                                });
                                await refetch();

                                setShowDeleteTeamMemberDialog(false);
                              } catch (e) {}
                            }}
                          >
                            Kick user
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ),
                },
              ]}
            />
          </div>
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
