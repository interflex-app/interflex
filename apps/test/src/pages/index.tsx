import { Button } from "@interflex-app/ui";
import { NextPage } from "next";

const Index: NextPage = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center flex-col gap-8">
      <h1 className="text-5xl font-black">Test App</h1>
      <p>I&apos;m a smaller message</p>
      <Button onClick={() => alert("I'm an alert message!")}>
        Click me! :)
      </Button>
    </div>
  );
};

export default Index;
