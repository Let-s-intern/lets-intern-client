import { IProgram } from '../../../../../interfaces/interface';
import { PROGRAM_STATUS } from '../../../../../utils/programConst';
import ProgramStatusTag from '../../../program/programs/card/ProgramStatusTag';
import { useNavigate } from 'react-router-dom';

interface ProgramOverviewListItemProps {
  program: IProgram;
}

const ProgramListItem = ({ program }: ProgramOverviewListItemProps) => {
  const navigate = useNavigate();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString().replaceAll(' ', '').slice(0, -1);
  };

  return (
    <li className="flex items-center gap-3 rounded-xs border border-neutral-85 md:gap-4 md:p-2.5 cursor-pointer"
      onClick={() => {
        navigate(`/program/${program.programInfo.programType.toLowerCase()}/${program.programInfo.id}`)
      }}
    >
      <img
        className="h-[7.5rem] w-[7.5rem] rounded-xs md:h-40 md:w-44 object-cover"
        src={program.programInfo.thumbnail}
        alt="프로그램 썸네일"
      />
      <div className="w-full pr-3">
        <div className="mb-2 flex flex-col items-start gap-1">
          <ProgramStatusTag
            status={PROGRAM_STATUS[program.programInfo.programStatusType]}
          />
          <h2 className="text-1-medium md:text-1-semibold">
            {program.programInfo.title}
          </h2>
          <span className="text-0.75 md:text-0.875 text-neutral-30 ">
            {program.programInfo.shortDesc}
          </span>
        </div>
        {program.programInfo.programType !== 'VOD' && (
          <div className="text-0.75-medium flex w-full justify-end gap-1.5">
            <span>진행기간</span>
            <span className="text-primary- dark">{`${formatDate(
              program.programInfo.startDate,
            )} ~ ${formatDate(program.programInfo.endDate!)}`}</span>
          </div>
        )}
      </div>
    </li>
  );
};

export default ProgramListItem;
