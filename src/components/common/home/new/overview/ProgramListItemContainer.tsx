import { useNavigate } from 'react-router-dom';
import { IProgram } from '../../../../../interfaces/Program.interface';
import { PROGRAM_STATUS } from '../../../../../utils/programConst';
import ProgramStatusTag from '../../../program/programs/card/ProgramStatusTag';

const ProgramListItemContainer = ({ program }: { program: IProgram }) => {
  const navigate = useNavigate();
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString().replaceAll(' ', '').slice(0, -1);
  };
  return (
    <div className="flex w-full items-center justify-center">
      <div
        className="calendar_program flex w-full cursor-pointer items-center justify-center gap-x-4 rounded-md border border-neutral-85 bg-neutral-100 p-2.5"
        onClick={() =>
          navigate(
            `/program/${program.programInfo.programType.toLowerCase()}/${
              program.programInfo.id
            }`,
          )
        }
        data-program-text={program.programInfo.title}
      >
        <img
          src={program.programInfo.thumbnail}
          alt="프로그램 썸네일"
          className="h-[120px] w-[120px] rounded-md object-cover md:h-[150px] md:w-[179px]"
        />
        <div className="flex h-[120px] grow flex-col items-start justify-between py-2 md:h-[150px]">
          <div className="flex w-full flex-col items-start justify-center gap-y-[6px]">
            <ProgramStatusTag
              status={PROGRAM_STATUS[program.programInfo.programStatusType]}
            />
            <div className="flex w-full flex-col items-start justify-center gap-y-[2px] py-1">
              <div className="line-clamp-1 font-semibold">
                {program.programInfo.title}
              </div>
              <div className="line-clamp-1 text-sm font-medium text-neutral-30">
                {program.programInfo.shortDesc}
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-start gap-x-1">
            <div className="text-xs font-medium text-neutral-0">진행기간</div>
            <div className="text-xs font-medium text-primary-dark">
              {`${formatDate(program.programInfo.startDate)} ~ ${formatDate(
                program.programInfo.endDate!,
              )}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramListItemContainer;
