const PaymentInfoRow = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <div className="flex w-full items-center justify-start gap-x-2 px-3 py-2">
      <div className="text-neutral-40">{title}</div>
      <div className="flex grow items-center justify-end text-neutral-0">
        {content}
      </div>
    </div>
  );
};

export default PaymentInfoRow;
