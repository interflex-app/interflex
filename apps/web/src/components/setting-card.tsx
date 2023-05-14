import { PropsWithChildren } from "react";

const SettingCard: React.FC<
  PropsWithChildren<{ title: string; description: string }>
> = ({ children, title, description }) => {
  return (
    <div className="w-full rounded-md border border-gray-200 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-900/75">
      <h1 className="text-2xl">{title}</h1>
      <p className="mt-2 w-full text-sm text-gray-400 md:w-[80%]">
        {description}
      </p>

      <div className="mt-8 w-full">{children}</div>
    </div>
  );
};

export default SettingCard;
