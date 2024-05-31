import { Link } from 'react-router-dom';

import { IChallenge, ILive, IVod } from '../../../../../interfaces/interface';
import ProgramStatusTag from './ProgramStatusTag';
import { PROGRAM_TYPE, PRGRAM_STATUS } from '../../../../../utils/programConst';

interface ProgramCardProps {
  program: IChallenge | IVod | ILive;
  type: (typeof PROGRAM_TYPE)[keyof typeof PROGRAM_TYPE];
}

const ProgramCard = ({ program, type }: ProgramCardProps) => {
  let _program = program as IChallenge | ILive;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString().replaceAll(' ', '');
  };

  // 날짜에 따라 뱃지 상태 계산
  const calculateStatus = () => {
    if (type === PROGRAM_TYPE.VOD) return PRGRAM_STATUS.PROCEEDING; // VOD 클래스는 startDate가 없음

    const currentDate = new Date();
    if (currentDate < new Date(_program.startDate)) return PRGRAM_STATUS.PREV;
    if (currentDate > new Date(_program.endDate)) return PRGRAM_STATUS.POST;
    return PRGRAM_STATUS.PROCEEDING;
  };
  const status = calculateStatus();

  return (
    <Link to="#" className="flex flex-col overflow-hidden rounded-md">
      <img src={program.thumbnail} alt="프로그램 썸네일 배경" />
      <div className="flex flex-col gap-2 py-2">
        <div className="flex justify-between">
          <ProgramStatusTag status={status} />
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
        {/* VOD 클래스는 진행일정 없음 */}
        {type !== PROGRAM_TYPE.VOD && (
          <div className="flex gap-2">
            <span className="text-0.75-medium">진행일정</span>
            <span className="text-0.75-medium text-primary-dark">
              {type === PROGRAM_TYPE.CHALLENGE
                ? `${formatDate(_program.startDate)} ~ ${formatDate(
                    _program.endDate,
                  )}`
                : formatDate(_program.startDate)}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProgramCard;
