import DashboardHeader from "../../../components/dashboard-header";
import { useProject } from "../../../hooks/use-project";
import AppLayout from "../../../layouts/app-layout";
import { NextPageWithLayout } from "../../_app";
import ProjectSkeleton from "../../../components/project-skeleton";

const Translations: NextPageWithLayout = () => {
  const { project, isLoading } = useProject();

  if (!project || isLoading) return <ProjectSkeleton />;

  return (
    <div>
      <DashboardHeader title="Translations" />
    </div>
  );
};

Translations.getLayout = (page) => <AppLayout projectLayout>{page}</AppLayout>;

export default Translations;
