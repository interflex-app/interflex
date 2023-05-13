import DashboardHeader from "../../../components/dashboard-header";
import { useProject } from "../../../hooks/use-project";
import AppLayout from "../../../layouts/app-layout";
import { type NextPageWithLayout } from "../../_app";
import DashboardSkeleton from "../../../components/dashboard-skeleton";
import Head from "next/head";
import { truncate } from "../../../utils/truncate";

const Settings: NextPageWithLayout = () => {
  const { project, isLoading } = useProject();

  if (!project || isLoading) return <DashboardSkeleton />;

  return (
    <div>
      <Head>
        <title>Interflex | {project.name} | Settings</title>
      </Head>

      <DashboardHeader title={`${truncate(project.name, 20)} - Settings`} />
    </div>
  );
};

Settings.getLayout = (page) => <AppLayout projectLayout>{page}</AppLayout>;

export default Settings;
