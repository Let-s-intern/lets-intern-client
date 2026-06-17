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
        <span className="text-xsmall16 text-neutral-0 font-semibold">
          {title}
        </span>
      </div>
      <div className="text-xsmall14 text-neutral-0 xs:text-xsmall16 whitespace-pre-wrap text-pretty break-all font-normal">
        {content}
      </div>
    </div>
  );
};

export default BasicInfoRow;
