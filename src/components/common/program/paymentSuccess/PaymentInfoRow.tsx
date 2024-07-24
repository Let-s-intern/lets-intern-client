import { ReactNode } from 'react';

const PaymentInfoRow = ({
  title,
  content,
  subInfo,
}: {
  title: string;
  content: string;
  subInfo?: ReactNode;
}) => {
  return (
    <div className="flex w-full flex-col items-center justify-start gap-y-2 px-3 py-2">
      <div className="flex w-full items-center justify-start gap-x-2">
        <div className="text-neutral-40">{title}</div>
        <div className="flex grow items-center justify-end text-neutral-0">
          {content}
        </div>
      </div>
      {subInfo && (
        <div className="flex w-full items-center justify-start">{subInfo}</div>
      )}
    </div>
  );
};

export default PaymentInfoRow;
