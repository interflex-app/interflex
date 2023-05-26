import { Button } from "@interflex-app/ui";
import { NextPage } from "next";
import { useI18n } from "interflex/react";

const Index: NextPage = () => {
  const { t } = useI18n();

  return (
    <div className="h-screen w-full flex items-center justify-center flex-col gap-8">
      <h1 className="text-5xl font-black">Test App</h1>
      <p>I&apos;m a smaller message</p>
      <Button onClick={() => alert("I'm an alert message!")}>
        Click me! :)
        {t("test")}
      </Button>
    </div>
  );
};

export default Index;
