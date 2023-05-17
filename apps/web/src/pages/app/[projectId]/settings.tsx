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
import { type RouterError, api } from "../../../utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Combobox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  cn,
  useToast,
} from "@interflex-app/ui";
import { useState } from "react";
import { useRouter } from "next/router";
import { SUPPORTED_LANGUAGES, SupportedLanguage } from "../../../consts";
import { projectLanguages } from "../../../utils/project-languages";
import { Trash2 } from "lucide-react";
import { createZodEnum } from "../../../utils/create-zod-enum";

export const updateProjectNameSchema = z.object({
  name: z.string().min(1).max(50),
});

export const linkLanguageToOrFromProjectSchema = z.object({
  language: z.enum(createZodEnum(SupportedLanguage)),
});

const Settings: NextPageWithLayout = () => {
  const [showDeleteProjectDialog, setShowDeleteProjectDialog] = useState(false);
  const [showRemoveLanguageDialog, setShowRemoveLanguageDialog] =
    useState(false);
  const [newLanguage, setNewLanguage] = useState<SupportedLanguage | null>(
    null
  );

  const router = useRouter();

  const { toast } = useToast();

  const { project, isLoading, refetch } = useProject();

  const {
    mutateAsync: addLanguageToProject,
    isLoading: addLanguageToProjectLoading,
  } = api.project.addLanguageToProject.useMutation();

  const {
    mutateAsync: removeLanguageFromProject,
    isLoading: removeLanguageFromProjectLoading,
  } = api.project.removeLanguageFromProject.useMutation();

  const {
    mutateAsync: updateProjectName,
    isLoading: updateProjectNameLoading,
  } = api.project.updateProjectName.useMutation();

  const { mutateAsync: deleteProject, isLoading: deleteProjectLoading } =
    api.project.deleteProject.useMutation();

  const addLanguageToProjectForm =
    useForm<z.infer<typeof linkLanguageToOrFromProjectSchema>>();

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

      <div className="flex w-full flex-col gap-4 xl:w-[40%]">
        <SettingCard
          title="Project Languages"
          description="Those are the languages that will be available in your application."
        >
          <form
            className="w-full"
            onSubmit={addLanguageToProjectForm.handleSubmit(async () => {
              try {
                await addLanguageToProject({
                  language: newLanguage!,
                  projectId: project.id,
                });
                await refetch();

                setNewLanguage(null);

                toast({
                  title: "Language has been added",
                  description: "Your project has been updated successfully.",
                });
              } catch (e) {
                Object.entries(
                  (e as RouterError).data.zodError?.fieldErrors ?? []
                ).forEach(([key, value]) =>
                  addLanguageToProjectForm.setError(key as "root", {
                    message: value?.[0] ?? "",
                  })
                );
              }
            })}
          >
            <div className="flex w-full items-end gap-4">
              <div className="w-full space-y-2">
                <Label>Language to add</Label>
                <Combobox<SupportedLanguage>
                  className="w-full"
                  value={newLanguage}
                  onChange={setNewLanguage}
                  options={SUPPORTED_LANGUAGES.filter(
                    (supportedLanguage) =>
                      !projectLanguages(project.languages).includes(
                        supportedLanguage
                      )
                  )}
                  placeholder="Select language..."
                />
              </div>

              <Button type="submit" loading={addLanguageToProjectLoading}>
                Add
              </Button>
            </div>

            <div
              className={cn(
                "mt-2 h-3 text-sm text-red-600 opacity-0",
                !!addLanguageToProjectForm.formState.errors.language?.message &&
                  "opacity-100"
              )}
            >
              {addLanguageToProjectForm.formState.errors.language?.message}
            </div>
          </form>

          <div className="mt-4">
            <Label>Languages in the project</Label>

            <div className="mt-2 flex flex-col gap-2">
              {projectLanguages(project.languages).map((lang) => (
                <div
                  key={lang.value}
                  className="flex w-full items-center justify-between rounded-md border border-gray-200 pl-4 dark:border-gray-800"
                >
                  <span>{lang.label}</span>
                  <Dialog
                    open={showRemoveLanguageDialog}
                    onOpenChange={setShowRemoveLanguageDialog}
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete language</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this language? (
                          {lang.value})
                        </DialogDescription>
                      </DialogHeader>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowRemoveLanguageDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          loading={removeLanguageFromProjectLoading}
                          onClick={async () => {
                            try {
                              await removeLanguageFromProject({
                                projectId: project.id,
                                language: lang.value,
                              });

                              await refetch();

                              toast({
                                title: "Language has been removed",
                                description:
                                  "Your project has been updated successfully.",
                              });

                              setShowRemoveLanguageDialog(false);
                            } catch (e) {}
                          }}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </div>
        </SettingCard>

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
            <div className="flex w-full items-end gap-4">
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
                        projectId: project.id,
                      });

                      await router.push(`/app/${project.teamId || ""}`);

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
