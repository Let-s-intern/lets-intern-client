import Link from 'next/link';

interface ProgramCardProps {
  link: string;
  bgColorClassName: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

const ProgramCard = ({
  link,
  bgColorClassName,
  title,
  description,
  children,
}: ProgramCardProps) => {
  return (
    <Link
      href={link}
      className={`relative w-full rounded-xl md:h-[14.875rem] md:min-w-[17.75rem] ${bgColorClassName} px-6 pb-[3.25rem] pt-7 xl:pb-[4.5rem]`}
    >
      <div className="mb-3 flex items-center gap-2">
        <h2 className="font-bold text-neutral-100">{title}</h2>
        <img src="/icons/Caret_Circle_Right_Outline.svg" alt="이동 아이콘" />
      </div>
      <p className="flex flex-col whitespace-pre-line text-xsmall14 font-medium text-static-100/90">
        {description}
      </p>
      {children}
    </Link>
  );
};

export default ProgramCard;
