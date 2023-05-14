import DashboardHeader from "../../../components/dashboard-header";
import { useProject } from "../../../hooks/use-project";
import AppLayout from "../../../layouts/app-layout";
import { type NextPageWithLayout } from "../../_app";
import DashboardSkeleton from "../../../components/dashboard-skeleton";
import Head from "next/head";
import { truncate } from "../../../utils/truncate";
import { z } from "zod";
import SettingCard from "../../../components/setting-card";
import DangerZone from "../../../components/danger-zone";
import { RouterError, api } from "../../../utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useState } from "react";
import { useRouter } from "next/router";

export const updateProjectNameSchema = z.object({
  name: z.string().min(1).max(50),
});

const Settings: NextPageWithLayout = () => {
  const [showDeleteProjectDialog, setShowDeleteProjectDialog] = useState(false);

  const router = useRouter();

  const { toast } = useToast();

  const { project, teamId, isLoading, refetch } = useProject();

  const {
    mutateAsync: updateProjectName,
    isLoading: updateProjectNameLoading,
  } = api.project.updateProjectName.useMutation();

  const { mutateAsync: deleteProject, isLoading: deleteProjectLoading } =
    api.project.deleteProject.useMutation();

  const updateProjectNameForm = useForm<
    z.infer<typeof updateProjectNameSchema>
  >({
    resolver: zodResolver(updateProjectNameSchema),
  });

  if (!project || isLoading) return <DashboardSkeleton />;

  return (
    <div>
      <Head>
        <title>Interflex | {project.name} | Settings</title>
      </Head>

      <DashboardHeader title={`${truncate(project.name, 20)} - Settings`} />

      <div className="flex flex-col gap-4">
        <SettingCard
          title="Project Name"
          description="This is your project's name. It will be visible to all the members of
            this organization."
        >
          <form
            className="w-full"
            onSubmit={updateProjectNameForm.handleSubmit(async (formData) => {
              try {
                await updateProjectName({
                  teamId: teamId || "",
                  projectId: project.id,
                  name: formData.name,
                });
                await refetch();

                toast({
                  title: "Project name updated",
                  description:
                    "Your project name has been updated successfully.",
                });
              } catch (e) {
                Object.entries(
                  (e as RouterError).data.zodError?.fieldErrors ?? []
                ).forEach(([key, value]) =>
                  updateProjectNameForm.setError(key as "root", {
                    message: value?.[0] ?? "",
                  })
                );
              }
            })}
          >
            <div className="flex w-full items-end gap-4 xl:w-[40%]">
              <div className="w-full space-y-2">
                <Label htmlFor="name">Project name</Label>
                <Input
                  id="name"
                  placeholder="Enter project name..."
                  defaultValue={project.name}
                  {...updateProjectNameForm.register("name")}
                />
              </div>

              <Button type="submit" loading={updateProjectNameLoading}>
                Save
              </Button>
            </div>

            {updateProjectNameForm.formState.errors.name?.message && (
              <div className="mt-2 text-sm text-red-600">
                {updateProjectNameForm.formState.errors.name?.message}
              </div>
            )}
          </form>
        </SettingCard>

        <DangerZone>
          <Dialog
            open={showDeleteProjectDialog}
            onOpenChange={setShowDeleteProjectDialog}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setShowDeleteProjectDialog(true)}>
                Delete project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete project</DialogTitle>
                <DialogDescription>
                  Every translation in that project will be removed.
                </DialogDescription>
              </DialogHeader>

              <p>
                Every translation in that project will be removed. You have to
                export all the translations before deleting the project.
              </p>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteProjectDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  loading={deleteProjectLoading}
                  onClick={async () => {
                    try {
                      await deleteProject({
                        teamId: teamId || "",
                        projectId: project.id,
                      });

                      await router.push(`/app/${teamId || ""}`);

                      toast({
                        title: "Project has been deleted",
                        description: "Your project has been removed.",
                      });

                      setShowDeleteProjectDialog(false);
                    } catch (e) {}
                  }}
                >
                  Delete project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DangerZone>
      </div>
    </div>
  );
};

Settings.getLayout = (page) => <AppLayout projectLayout>{page}</AppLayout>;

export default Settings;
