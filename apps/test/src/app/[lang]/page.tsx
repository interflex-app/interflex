import { NextPage } from "next";
import { headers } from "next/headers";

const Page: NextPage = () => {
  const headersList = headers();

  return (
    <div>
      <h1>{JSON.stringify(headersList)}</h1>
    </div>
  );
};

export default Page;
