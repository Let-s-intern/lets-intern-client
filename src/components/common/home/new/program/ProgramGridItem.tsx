import { Link, useNavigate } from 'react-router-dom';

import { IProgramGridItem } from '../../../../../interfaces/Program.interface';
import { useState } from 'react';

export interface ProgramGridItemProps {
  program: IProgramGridItem;
  link: string;
}

const ProgramGridItem = ({ program, link }: ProgramGridItemProps) => {
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);
  return (
    <div
      onClick={() => {
        program.keyword === 'Growth' ? window.open(link, '_blank') : navigate(link);
      }}
    >
      <li
        className={`flex h-[13.75rem] cursor-pointer flex-col justify-start rounded-lg border-2 md:h-80 lg:h-[27.5rem] ${program.bgColor} ${program.borderColor} relative overflow-hidden px-4 pb-6 pt-4 md:pt-5 lg:pt-6`}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div className="flex w-full flex-col items-start justify-start lg:items-center">
          <div className="flex items-center justify-center rounded-full bg-white px-3 py-1 font-bold">
            {program.keyword}
          </div>
          <div
            className={`text-1.25-medium lg:text-1.5-medium pt-2 text-left lg:text-center break-keep flex flex-wrap gap-1 ${program.textColor}`}
          >
            {
              program.title.map((title, idx) => (
                <span key={title + idx}>{title}</span>
              ))
            }
          </div>
        </div>
        <div className="mt-4 flex w-full items-center justify-center md:mt-12">
          <img
            src={program.imgSrc}
            alt={program.keyword}
            className="absolute left-1/2 -translate-x-1/2 bottom-5 md:static md:translate-x-0 md:left-auto h-auto w-full max-w-[6.25rem] lg:max-w-[8.75rem]"
          />
        </div>
        <div className='absolute w-full h-full top-0 left-0 hover:backdrop-blur-[2px]' />
        <div
          className={`text-0.875 bg-gradient-desc absolute bottom-0 left-0 flex h-40 w-full flex-wrap items-end px-8 py-8 text-white ${
            isHover ? '' : 'hidden'
          }`}
        >
          <div className="flex w-full flex-wrap items-end">
            {program.descriptionList.map((description) => (
              <div className="shrink-0">{description + ' '}</div>
            ))}
          </div>
        </div>
      </li>
    </div>
  );
};

export default ProgramGridItem;
