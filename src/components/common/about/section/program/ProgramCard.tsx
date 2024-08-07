import { Link } from 'react-router-dom';

interface ProgramCardProps {
  link: string;
  bgColorClassName: string;
  title: string;
  description: string[];
  alt: string;
  children: React.ReactNode;
}

const ProgramCard = ({
  link,
  bgColorClassName,
  title,
  description,
  alt,
  children,
}: ProgramCardProps) => {
  return (
    <Link
      to={link}
      className={`relative w-full rounded-xl ${bgColorClassName} px-6 pb-[3.25rem] pt-7 xl:pb-[4.5rem]`}
    >
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-1-bold text-neutral-100">{title}</h2>
        <img src="/icons/Caret_Circle_Right_Outline.svg" alt={alt} />
      </div>
      <p className="text-0.875-medium flex flex-col text-static-100/90">
        {description.map((desc) => (
          <span key={desc}>{desc}</span>
        ))}
      </p>
      {children}
    </Link>
  );
};

export default ProgramCard;
