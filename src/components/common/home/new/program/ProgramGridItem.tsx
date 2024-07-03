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
    <li
      onClick={() => {
        program.keyword === 'Growth'
          ? window.open(link, '_blank')
          : navigate(link);
      }}
      className={`${linkClassName} h-[225px] md:h-[300px] lg:h-[440px] group flex cursor-pointer flex-col justify-start rounded-lg border-2 ${program.bgColor} ${program.borderColor} relative overflow-hidden px-4 pb-6 pt-[16px] md:pt-[20px] lg:pt-[32px]`}
    >
      <div className="flex w-full flex-col items-start justify-start">
        <div className="flex items-center justify-center rounded-full bg-white px-2 py-1 md:px-2.5 font-bold text-[11px] md:text-[12px] lg:text-[14px] leading-[130%]">
          {program.keyword}
        </div>
        <div
          className={`w-full font-bold lg:text-xl flex flex-wrap gap-1 break-keep pt-2 items-center justify-center ${program.textColor}`}
        >
          {program.title.map((title, idx) => (
            <span key={title + idx}>{title}</span>
          ))}
        </div>
      </div>
      <div className="grow mt-4 flex flex-col w-full items-center justify-start md:mt-7 lg:mt-10">
        <img
          src={program.imgSrc}
          alt={program.keyword}
          className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] lg:w-[200px] lg:h-[200px]"
        />
      </div>
      <div className="absolute left-0 top-0 h-full w-full duration-300 group-hover:backdrop-blur-[2px]" />
      <div className="text-[14px] lg:text-[16px] absolute bottom-0 left-0 flex h-40 w-full flex-wrap items-end bg-gradient-desc px-4 py-5 text-white opacity-0 duration-300 group-hover:opacity-100">
        <div className="flex flex-col w-full flex-wrap items-start">
          {program.descriptionList.map((description) => (
            <div key={description} className="shrink-0 break-keep">
              {description + ' '}
            </div>
          ))}
        </div>
      </div>
    </li>
  );
};

export default ProgramGridItem;
