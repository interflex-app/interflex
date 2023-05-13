import Link from "next/link";
import HomeLayout from "../layouts/home-layout";
import { type NextPageWithLayout } from "./_app";
import { ArrowRight } from "lucide-react";
import { Button } from "@interflex-app/ui";

const NotFound: NextPageWithLayout = () => {
  return (
    <div className="mt-24 w-full px-4 pb-24 text-center">
      <h2 className="text-2xl md:text-4xl">Are you lost?</h2>

      <h1 className="mb-12 mt-3 text-4xl font-bold sm:text-6xl md:mt-6 md:text-7xl">
        Page <span className="gradient-text">not found</span>.
      </h1>

      <Link href={"/"}>
        <Button>
          Return to homepage <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
};

NotFound.getLayout = (page) => <HomeLayout>{page}</HomeLayout>;

export default NotFound;
