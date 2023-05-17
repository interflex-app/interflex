import DashboardHeader from "../../../components/dashboard-header";
import { useProject } from "../../../hooks/use-project";
import AppLayout from "../../../layouts/app-layout";
import { type NextPageWithLayout } from "../../_app";
import DashboardSkeleton from "../../../components/dashboard-skeleton";
import Head from "next/head";
import { truncate } from "../../../utils/truncate";
import { TranslationTable } from "../../../components/translation-table";
import { Input } from "@interflex-app/ui";
import { projectLanguages } from "../../../utils/project-languages";

const Translations: NextPageWithLayout = () => {
  const { project, isLoading } = useProject();

  if (!project || isLoading) return <DashboardSkeleton />;

  return (
    <div>
      <Head>
        <title>Interflex | {project.name} | Translations</title>
      </Head>

      <DashboardHeader title={`${truncate(project.name, 20)} - Translations`} />

      <TranslationTable
        data={[]}
        columns={[
          {
            id: "Key",
            header: "Key",
            cell: () => <Input placeholder="Key..." />,
          },
          ...projectLanguages(project.languages).map((lang) => ({
            id: `lang-${lang.value}`,
            header: lang.label,
            cell: () => <Input placeholder="Value..." />,
          })),
        ]}
      />
    </div>
  );
};

Translations.getLayout = (page) => <AppLayout projectLayout>{page}</AppLayout>;

export default Translations;
