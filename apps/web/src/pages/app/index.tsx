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
  Skeleton,
} from "@interflex-app/ui";
import DashboardHeader from "../../components/dashboard-header";
import AppLayout from "../../layouts/app-layout";
import { type NextPageWithLayout } from "../_app";
import { useTeam } from "../../providers/team-provider";
import { type RouterError, api } from "../../utils/api";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";

export const createProjectSchema = z.object({ name: z.string().min(1) });

const Index: NextPageWithLayout = () => {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);

  const { team } = useTeam();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    setError,
  } = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
  });

  const { mutateAsync: createProject, isLoading: createProjectLoading } =
    api.project.createProject.useMutation();

  const { data, isLoading, isError, refetch } =
    api.project.getAllProjects.useQuery(
      { teamId: team || "" },
      { enabled: !!team }
    );

  return (
    <div>
      <Head>
        <title>Interflex | My Projects</title>
      </Head>

      <DashboardHeader
        title="My projects"
        actions={
          <>
            <Dialog
              open={showNewProjectDialog}
              onOpenChange={setShowNewProjectDialog}
            >
              <DialogTrigger asChild>
                <Button>Create project</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create project</DialogTitle>
                  <DialogDescription>Create a new project.</DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={handleSubmit(async (formData) => {
                    try {
                      await createProject({ ...formData, teamId: team ?? "" });
                      await refetch();

                      reset();
                      setShowNewProjectDialog(false);
                    } catch (e) {
                      Object.entries(
                        (e as RouterError).data.zodError?.fieldErrors ?? []
                      ).forEach(([key, value]) =>
                        setError(key as "root", { message: value?.[0] ?? "" })
                      );
                    }
                  })}
                >
                  <div>
                    <div className="space-y-4 py-2 pb-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Project name</Label>
                        <Input
                          id="name"
                          {...register("name")}
                          placeholder="Enter project name..."
                        />
                        {errors.name?.message && (
                          <div className="mt-2 text-xs text-red-500">
                            {errors.name?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowNewProjectDialog(false);
                        reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" loading={createProjectLoading}>
                      Create project
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div>
        {!data || isLoading || isError ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <div>
            {data.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {data.map((project) => (
                  <Link href={`/app/${project.id}`} key={project.id}>
                    <div className="flex h-64 w-full items-center rounded-md border border-gray-200 bg-gray-100 p-8 dark:border-gray-800 dark:bg-gray-900">
                      <div>
                        <span className="flex items-center gap-2">
                          {project.active ? (
                            <>
                              <div className="h-3 w-3 rounded-full bg-green-400" />{" "}
                              Active
                            </>
                          ) : (
                            <>
                              <div className="h-3 w-3 rounded-full bg-red-400" />{" "}
                              Disabled
                            </>
                          )}
                        </span>
                        <div className="mt-4 w-[70vw] overflow-hidden text-3xl md:w-[20vw]">
                          <span className="block truncate">{project.name}</span>
                        </div>

                        <div className="mt-3 text-gray-500 dark:text-gray-400">
                          3 languages
                        </div>

                        <div className="mt-6">
                          <Button variant="link" className="p-0">
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Open project
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-xl">
                You don&apos;t have any projects! Try creating one.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

Index.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Index;
