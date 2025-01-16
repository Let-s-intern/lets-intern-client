export interface BasicInfoRowProps {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

const BasicInfoRow = ({ icon, title, content }: BasicInfoRowProps) => {
  return (
    <div className="flex w-full flex-col gap-y-2">
      <div className="flex shrink-0 items-center gap-2">
        {icon}
        <span className="text-xsmall16 font-semibold text-neutral-0">
          {title}
        </span>
      </div>
      <div className="whitespace-pre text-pretty break-all text-xsmall14 font-normal text-neutral-0 xs:text-xsmall16">
        {content}
      </div>
    </div>
  );
};

export default BasicInfoRow;
