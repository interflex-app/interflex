import AppLayout from "../../layouts/app-layout";
import { type NextPageWithLayout } from "../_app";

const Index: NextPageWithLayout = () => {
  return <span>Hi :)</span>;
};

Index.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Index;
