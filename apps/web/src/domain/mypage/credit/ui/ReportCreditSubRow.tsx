export default function ReportCreditSubRow({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full items-center justify-between gap-x-3 py-2 text-xsmall14 text-neutral-45">
        <div>└ {title}</div>
        <div className="flex grow items-center justify-end">{content}</div>
      </div>
    </div>
  );
}
