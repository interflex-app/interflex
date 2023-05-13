import { Button, Skeleton } from "@interflex-app/ui";
import DashboardHeader from "../../components/dashboard-header";
import AppLayout from "../../layouts/app-layout";
import { type NextPageWithLayout } from "../_app";
import { useTeam } from "../../providers/team-provider";
import { api } from "../../utils/api";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

const Index: NextPageWithLayout = () => {
  const { team } = useTeam();

  const { data, isLoading, isError } = api.project.getAllProjects.useQuery(
    { teamId: team || "" },
    { enabled: !!team }
  );

  return (
    <div>
      <DashboardHeader
        title="My projects"
        actions={
          <>
            <Button>Create project</Button>
          </>
        }
      />

      <div>
        {!data || isLoading || isError ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <div>
            {data.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {data.map((project) => (
                  <div
                    key={project.id}
                    className="flex h-64 w-full items-center rounded-md border border-gray-200 bg-gray-100 p-8"
                  >
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

                      <div className="mt-3 text-gray-500">3 languages</div>

                      <div className="mt-6">
                        <Button variant="link" className="p-0">
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Open project
                        </Button>
                      </div>
                    </div>
                  </div>
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
