const ReportCreditRow = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <div className="flex w-full items-start justify-between gap-x-3 py-2">
      <p>{title}</p>
      <p className="shrink-0">{content}</p>
    </div>
  );
};

export default ReportCreditRow;
