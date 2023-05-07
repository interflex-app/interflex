const DashboardHeader: React.FC<{
  title: string;
  actions?: React.ReactNode;
}> = ({ title, actions }) => {
  return (
    <div className="flex flex-col-reverse items-start justify-between gap-8 md:flex-row md:items-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl">{title}</h1>

      <div className="flex items-center gap-4">{actions}</div>
    </div>
  );
};

export default DashboardHeader;
