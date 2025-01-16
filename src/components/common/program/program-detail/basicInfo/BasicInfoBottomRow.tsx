import { ReactNode } from 'react';

export interface BasicInfoBottomRowProps {
  icon: ReactNode;
  title: string;
  content: React.ReactNode;
}

const BasicInfoBottomRow = ({
  icon,
  title,
  content,
}: BasicInfoBottomRowProps) => {
  return (
    <div className="flex w-full flex-1 flex-col gap-y-[14px] bg-neutral-95 px-6 py-5">
      <div className="flex shrink-0 items-center gap-2">
        {icon}
        <span className="text-xsmall16 font-semibold text-neutral-0">
          {title}
        </span>
      </div>
      <div className="text-pretty break-all text-xsmall16 font-normal text-neutral-0">
        {content}
      </div>
    </div>
  );
};

export default BasicInfoBottomRow;
