import { Button } from "@interflex-app/ui";
import DashboardHeader from "../../components/dashboard-header";
import AppLayout from "../../layouts/app-layout";
import { type NextPageWithLayout } from "../_app";

const Index: NextPageWithLayout = () => {
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
    </div>
  );
};

Index.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Index;
