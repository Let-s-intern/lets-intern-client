interface CreditSubRowProps {
  title: string;
  content: string;
}

function CreditSubRow({ title, content }: CreditSubRowProps) {
  return (
    <div className="flex w-full items-center justify-between py-2 text-xsmall16">
      <div className="text-neutral-40">{title}</div>
      <div>{content}</div>
    </div>
  );
}

export default CreditSubRow;
