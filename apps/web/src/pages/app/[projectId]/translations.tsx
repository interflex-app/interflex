import DashboardHeader from "../../../components/dashboard-header";
import { useProject } from "../../../hooks/use-project";
import AppLayout from "../../../layouts/app-layout";
import { NextPageWithLayout } from "../../_app";
import ProjectSkeleton from "../../../components/dashboard-skeleton";
import Head from "next/head";
import { truncate } from "../../../utils/truncate";

const Translations: NextPageWithLayout = () => {
  const { project, isLoading } = useProject();

  if (!project || isLoading) return <ProjectSkeleton />;

  return (
    <div>
      <Head>
        <title>Interflex | {project.name} | Translations</title>
      </Head>

      <DashboardHeader title={`${truncate(project.name, 20)} - Translations`} />
    </div>
  );
};

Translations.getLayout = (page) => <AppLayout projectLayout>{page}</AppLayout>;

export default Translations;
