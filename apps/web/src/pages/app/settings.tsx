import Head from "next/head";
import DashboardHeader from "../../components/dashboard-header";
import AppLayout from "../../layouts/app-layout";
import { NextPageWithLayout } from "../_app";
import { useTeam } from "../../providers/team-provider";
import DashboardSkeleton from "../../components/dashboard-skeleton";
import { api } from "../../utils/api";

const Settings: NextPageWithLayout = () => {
  const { team } = useTeam();

  const { data, isLoading, isError } = api.team.getTeam.useQuery(
    { teamId: team ?? "" },
    { enabled: !!team }
  );

  if (!team || !data || isLoading || isError) return <DashboardSkeleton />;

  return (
    <div>
      <Head>
        <title>Interflex | Team Settings</title>
      </Head>

      <DashboardHeader title="Settings" />
    </div>
  );
};

Settings.getLayout = (page) => <AppLayout teamLayout>{page}</AppLayout>;

export default Settings;
