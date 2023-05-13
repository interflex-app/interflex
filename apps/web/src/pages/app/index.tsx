import { Button } from "@interflex-app/ui";
import DashboardHeader from "../../components/dashboard-header";
import AppLayout from "../../layouts/app-layout";
import { type NextPageWithLayout } from "../_app";
import { useTeam } from "../../providers/team-provider";

const Index: NextPageWithLayout = () => {
  const { team } = useTeam();

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
      Team: {team}!
    </div>
  );
};

Index.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Index;
