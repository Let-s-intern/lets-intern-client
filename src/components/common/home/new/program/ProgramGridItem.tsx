import { useNavigate } from 'react-router-dom';

import { IProgramGridItem } from '../../../../../interfaces/Program.interface';

interface ProgramGridItemProps {
  program: IProgramGridItem;
  link: string;
  className: string;
}

const ProgramGridItem = ({
  program,
  link,
  className: linkClassName,
}: ProgramGridItemProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        program.keyword === 'Growth'
          ? window.open(link, '_blank')
          : navigate(link);
      }}
      className={linkClassName}
    >
      <li
        className={`group flex h-[13.75rem] cursor-pointer flex-col justify-start rounded-lg border-2 md:h-80 lg:h-[27.5rem] ${program.bgColor} ${program.borderColor} relative overflow-hidden px-4 pb-6 pt-4 md:pt-5 lg:pt-6`}
      >
        <div className="flex w-full flex-col items-start justify-start lg:items-center">
          <div className="flex items-center justify-center rounded-full bg-white px-3 py-1 font-bold">
            {program.keyword}
          </div>
          <div
            className={`text-1-medium min-[400px]:text-1.25-medium lg:text-1.5-medium flex flex-wrap gap-1 break-keep pt-2 text-left lg:text-center ${program.textColor}`}
          >
            {program.title.map((title, idx) => (
              <span key={title + idx}>{title}</span>
            ))}
          </div>
        </div>
        <div className="mt-4 flex w-full items-center justify-center md:mt-12">
          <img
            src={program.imgSrc}
            alt={program.keyword}
            className="absolute bottom-5 left-1/2 h-auto w-full max-w-[6.25rem] -translate-x-1/2 md:static md:left-auto md:translate-x-0 lg:max-w-[8.75rem]"
          />
        </div>
        <div className="absolute left-0 top-0 h-full w-full duration-300 group-hover:backdrop-blur-[2px]" />
        <div className="text-0.875 absolute bottom-0 left-0 flex h-40 w-full flex-wrap items-end bg-gradient-desc px-8 py-8 text-white opacity-0 duration-300 group-hover:opacity-100">
          <div className="flex w-full flex-wrap items-end">
            {program.descriptionList.map((description) => (
              <div key={description} className="shrink-0">
                {description + ' '}
              </div>
            ))}
          </div>
        </div>
      </li>
    </div>
  );
};

export default ProgramGridItem;
