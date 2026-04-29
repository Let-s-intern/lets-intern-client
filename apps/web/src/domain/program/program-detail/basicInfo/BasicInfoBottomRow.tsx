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
    <div className="bg-neutral-95 flex w-full flex-1 flex-col gap-y-[14px] px-6 py-5">
      <div className="flex shrink-0 items-center gap-2">
        {icon}
        <span className="text-xsmall16 text-neutral-0 font-semibold">
          {title}
        </span>
      </div>
      <div className="text-xsmall16 text-neutral-0 text-pretty break-all font-normal">
        {content}
      </div>
    </div>
  );
};

export default BasicInfoBottomRow;
