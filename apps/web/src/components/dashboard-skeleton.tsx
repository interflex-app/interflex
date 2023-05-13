import { Skeleton } from "@interflex-app/ui";

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-[70vw]" />
      <Skeleton className="h-8 w-[50vw]" />
      <Skeleton className="h-8 w-[60vw]" />
    </div>
  );
};

export default DashboardSkeleton;
