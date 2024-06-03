import { Link } from 'react-router-dom';

import { IProgramInfo } from '../../../../../interfaces/interface';
import ProgramStatusTag from './ProgramStatusTag';
import { PROGRAM_TYPE, PRGRAM_STATUS } from '../../../../../utils/programConst';

interface ProgramCardProps {
  program: IProgramInfo;
}

const ProgramCard = ({ program }: ProgramCardProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString().replaceAll(' ', '').slice(0, -1);
  };

  // 날짜에 따라 뱃지 상태 계산
  const calculateStatus = () => {
    if (program.programType === PROGRAM_TYPE.VOD)
      return PRGRAM_STATUS.PROCEEDING; // VOD 클래스는 항상 모집 중

    if (new Date() < new Date(program.beginning!)) return PRGRAM_STATUS.PREV; // 모집시작일보다 이르면 '사전알림 신청'
    if (new Date() > new Date(program.deadline!)) return PRGRAM_STATUS.POST; // 모집마감일이 지났으면 '마감'
    return PRGRAM_STATUS.PROCEEDING; // 그 외 '모집 중'
  };
  const status = calculateStatus();

  return (
    <Link
      to={`/program/${program.programType.toLowerCase()}/${program.id}`}
      className="min-w-40 flex flex-col overflow-hidden rounded-xs md:gap-4 md:rounded-md md:border md:border-neutral-85 md:p-2.5"
    >
      <img
        className=" h-32 bg-neutral-80 object-cover md:h-64 md:rounded-xs"
        src={program.thumbnail}
        alt="프로그램 썸네일 배경"
      />
      <div className="flex flex-col gap-2 py-2">
        <div className="flex gap-2">
          <ProgramStatusTag status={status} />
        </div>
        <h2 className="text-1-semibold">{program.title}</h2>
        <p className="text-0.875 max-h-11 overflow-hidden text-neutral-30">
          {program.shortDesc}
        </p>
        {/* VOD 클래스는 진행일정, 모집마감 없음 */}
        {program.programType !== PROGRAM_TYPE.VOD && (
          <div>
            <div className="flex gap-1.5">
              <span className="text-0.75-medium">모집마감</span>
              <span className="text-0.75-medium text-primary-dark">
                ~ {formatDate(program.deadline!)}
              </span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-0.75-medium">진행일정</span>
              <span className="text-0.75-medium text-primary-dark">
                {program.programType === PROGRAM_TYPE.CHALLENGE
                  ? `${formatDate(program.startDate)} ~ ${formatDate(
                      program.endDate!,
                    )}`
                  : formatDate(program.startDate)}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProgramCard;
