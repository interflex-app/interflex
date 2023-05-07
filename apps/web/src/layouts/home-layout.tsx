import { type PropsWithChildren } from "react";
import Navbar from "../components/navbar";

const HomeLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <Navbar />

      <div className="mt-12 w-full">{children}</div>
    </div>
  );
};

export default HomeLayout;
