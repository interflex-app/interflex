import Link from "next/link";
import { env } from "../env.mjs";
import { Button } from "@interflex-app/ui";
import { ArrowRight } from "lucide-react";
import { type NextPageWithLayout } from "./_app";
import HomeLayout from "../layouts/home-layout";
import { signIn, useSession } from "next-auth/react";
import dynamic from "next/dynamic.js";

const LandingCard = dynamic(() => import("../components/landing-card"), {
  ssr: false,
});

const Index: NextPageWithLayout = () => {
  const { data } = useSession();

  return (
    <div className="mt-24 w-full px-4 text-center">
      <h2 className="text-2xl md:text-4xl">Let your apps be</h2>

      <h1 className="mb-12 mt-3 text-4xl font-bold sm:text-6xl md:mt-6 md:text-7xl">
        <span className="gradient-text">multilingual</span>.
      </h1>

      <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
        {!!data ? (
          <Link href={"/app"}>
            <Button>
              Get started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Button
            onClick={() => void signIn("github", { callbackUrl: "/app" })}
          >
            Get started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}

        <Link href={env.NEXT_PUBLIC_DOCS_URL}>
          <Button variant={"outline"}>Documentation</Button>
        </Link>
      </div>

      <div className="mt-48">
        <h2 className="text-3xl">Manage translations with ease</h2>
        <p className="mt-4">
          Create, synchronize and utilize your translations with ease.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-8 lg:flex-row">
          <div>
            <LandingCard idx={1} />
            <h1 className="mt-6 text-xl sm:text-2xl">
              1. Create your translations
            </h1>
          </div>

          <div>
            <LandingCard idx={2} />
            <h1 className="mt-6 text-xl sm:text-2xl">
              2. Synchronize the values
            </h1>
          </div>

          <div>
            <LandingCard idx={3} />
            <h1 className="mt-6 text-xl sm:text-2xl">
              3. You&apos;re good to go!
            </h1>
          </div>
        </div>
      </div>

      <div className="mt-32">
        <h2 className="text-3xl">Our pricing</h2>
        <p className="mt-4">
          We have a free plan for everyone. If you need more, we offer a
          commercial plan.
        </p>

        <p className="mt-12 text-2xl text-gray-500">
          Pricing coming soon! For now the app is available 100% for free.
        </p>
      </div>
    </div>
  );
};

Index.getLayout = (page) => <HomeLayout>{page}</HomeLayout>;

export default Index;
