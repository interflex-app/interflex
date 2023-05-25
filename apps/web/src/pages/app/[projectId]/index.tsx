import DashboardHeader from "../../../components/dashboard-header";
import { useProject } from "../../../hooks/use-project";
import AppLayout from "../../../layouts/app-layout";
import { type NextPageWithLayout } from "../../_app";
import DashboardSkeleton from "../../../components/dashboard-skeleton";
import Head from "next/head";
import { truncate } from "../../../utils/truncate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from "@interflex-app/ui";
import { api } from "../../../utils/api";
import { extractTranslations } from "../../../utils/extract-translations";
import { projectLanguages } from "../../../utils/project-languages";
import { useMemo } from "react";

const Index: NextPageWithLayout = () => {
  const { project, isLoading: isProjectLoading } = useProject();

  const { data, isLoading: isTranslationsLoading } =
    api.project.getTranslations.useQuery(
      { projectId: project?.id ?? "" },
      { enabled: !!project }
    );

  const percentages = useMemo(() => {
    if (!data || !project) return [];

    const translations = data.map((t) => extractTranslations(t.value));
    const languages = projectLanguages(project.languages);

    return languages.map((language) => {
      const translated = translations.filter((t) =>
        t.find((t) => t.language === language.value)
      ).length;

      return {
        language,
        percentage: Math.round((translated / translations.length) * 100),
      };
    });
  }, [data, project]);

  if (!project || isProjectLoading || !data || isTranslationsLoading)
    return <DashboardSkeleton />;

  return (
    <div>
      <Head>
        <title>Interflex | {project.name} | Overview</title>
      </Head>

      <DashboardHeader title={`${truncate(project.name, 20)} - Overview`} />

      <Card>
        <CardHeader>
          <CardTitle>Languages</CardTitle>
          <CardDescription>
            See your progress in translating the app!
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-8">
            {percentages.map((per) => (
              <div
                key={per.language.value}
                className="flex w-full flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl">{per.language.label}</h2>
                  <span>{per.percentage}%</span>
                </div>

                <div className="relative h-0.5 rounded-md bg-secondary">
                  <div
                    className={cn("absolute left-0 top-0 h-0.5 rounded-md", {
                      "bg-white": per.percentage === 100,
                      "bg-lime-500":
                        per.percentage < 100 && per.percentage >= 80,
                      "bg-yellow-500":
                        per.percentage < 80 && per.percentage >= 30,
                      "bg-red-500": per.percentage < 30,
                    })}
                    style={{ width: `${per.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

Index.getLayout = (page) => <AppLayout projectLayout>{page}</AppLayout>;

export default Index;
