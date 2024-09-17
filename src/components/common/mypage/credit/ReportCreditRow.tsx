const ReportCreditRow = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <div className="flex w-full items-center justify-between gap-x-3 py-2">
      <p>{title}</p>
      <p>{content}</p>
    </div>
  );
};

export default ReportCreditRow;
