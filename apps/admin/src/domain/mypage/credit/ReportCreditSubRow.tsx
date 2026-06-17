const ReportCreditSubRow = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <div className="flex w-full flex-col">
      <div className="text-xsmall14 text-neutral-45 flex w-full items-center justify-between gap-x-3 py-2">
        <div>└ {title}</div>
        <div className="flex grow items-center justify-end">{content}</div>
      </div>
    </div>
  );
};

export default ReportCreditSubRow;
