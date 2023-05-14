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

export const updateProjectNameSchema = z.object({
  name: z.string().min(1).max(50),
});

const Settings: NextPageWithLayout = () => {
  const { project, isLoading } = useProject();

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
          Hi?
        </SettingCard>

        <DangerZone>Delete?</DangerZone>
      </div>
    </div>
  );
};

Settings.getLayout = (page) => <AppLayout projectLayout>{page}</AppLayout>;

export default Settings;
