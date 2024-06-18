import { Link } from 'react-router-dom';

import { IProgramGridItem } from '../../../../../interfaces/Program.interface';

export interface ProgramGridItemProps {
  program: IProgramGridItem;
  link: string;
}

const ProgramGridItem = ({ program, link }: ProgramGridItemProps) => {
  return (
    <Link to={link}>
      <li
        className={`flex h-[13.75rem] cursor-pointer flex-col justify-between rounded-lg md:h-80 lg:h-[27.5rem] ${program.bgColor} px-4 pb-6 pt-[3.75rem] md:pt-24 lg:pt-[12.7rem]`}
      >
        <h2 className="text-1.25-medium lg:text-1.5-medium text-center text-primary">
          {program.title}
        </h2>
        <p className="text-0.875 lg:text flex flex-col items-start">
          {program.descriptionList.map((description) => (
            <span>{description}</span>
          ))}
        </p>
      </li>
    </Link>
  );
};

export default ProgramGridItem;
