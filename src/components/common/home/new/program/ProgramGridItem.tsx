import { IProgramGridItem } from '../../../../../interfaces/Program.interface';

export interface ProgramGridItemProps {
  program: IProgramGridItem;
}

const ProgramGridItem = ({ program }: ProgramGridItemProps) => {
  return (
    <li
      className={`m flex h-[13.75rem] cursor-pointer flex-col justify-between rounded-lg ${program.bgColor} px-4 pb-6 pt-[3.75rem]`}
    >
      <h2 className="text-1.25-medium text-center text-primary">
        {program.title}
      </h2>
      <p className="text-0.875 flex flex-col items-start">
        {program.descriptionList.map((description) => (
          <span>{description}</span>
        ))}
      </p>
    </li>
  );
};

export default ProgramGridItem;
