import DashboardHeader from "../../../components/dashboard-header";
import { useProject } from "../../../hooks/use-project";
import AppLayout from "../../../layouts/app-layout";
import { NextPageWithLayout } from "../../_app";
import ProjectSkeleton from "../../../components/project-skeleton";

const Index: NextPageWithLayout = () => {
  const { project, isLoading } = useProject();

  if (!project || isLoading) return <ProjectSkeleton />;

  return (
    <div>
      <DashboardHeader title={project.name} />
    </div>
  );
};

Index.getLayout = (page) => <AppLayout projectLayout>{page}</AppLayout>;

export default Index;
