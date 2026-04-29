interface CreditSubRowProps {
  title: string;
  content: string;
}

function CreditSubRow({ title, content }: CreditSubRowProps) {
  return (
    <div className="text-xsmall16 flex w-full items-center justify-between py-2">
      <div className="text-neutral-40">{title}</div>
      <div>{content}</div>
    </div>
  );
}

export default CreditSubRow;
