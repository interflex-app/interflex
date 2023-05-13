import { type PropsWithChildren } from "react";

const DangerZone: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-full rounded-md border border-red-500/20 bg-red-500/10 p-6">
      <h1 className="text-2xl text-red-600">Danger Zone</h1>

      <div className="mt-6">{children}</div>
    </div>
  );
};

export default DangerZone;
