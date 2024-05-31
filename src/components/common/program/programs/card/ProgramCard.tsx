import { Link } from 'react-router-dom';

import { IProgram } from '../../../../../interfaces/interface';
import ProgramStatusTag from './ProgramStatusTag';

interface ProgramCardProps {
  program: IProgram;
}

const ProgramCard = ({ program }: ProgramCardProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString().replaceAll(' ', '');
  };

  return (
    <Link to="#" className="flex flex-col overflow-hidden rounded-md">
      <img src={program.thumbnail} alt="프로그램 썸네일 배경" />
      <div className="flex flex-col gap-2 py-2">
        <div className="flex justify-between">
          <ProgramStatusTag
            startDate={program.startDate}
            endDate={program.endDate}
          />
          <img
            className="cursor-pointer"
            src="/icons/program-detail.svg"
            alt="프로그램 상세 보기 아이콘"
          />
        </div>
        <h2 className="text-1-semibold">{program.title}</h2>
        <p className="text-0.875 max-h-11 overflow-hidden text-neutral-30">
          {program.shortDesc}
        </p>
        <div className="flex gap-2">
          <span className="text-0.75-medium">모집기간</span>
          <span className="text-0.75-medium text-primary-dark">
            {formatDate(program.startDate)} ~ {formatDate(program.endDate)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProgramCard;
