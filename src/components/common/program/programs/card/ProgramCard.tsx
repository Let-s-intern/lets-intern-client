import { Link } from 'react-router-dom';

import {
  IChallenge,
  ILive,
  IProgramInfo,
  IVod,
} from '../../../../../interfaces/interface';
import ProgramStatusTag from './ProgramStatusTag';
import { PROGRAM_TYPE, PRGRAM_STATUS } from '../../../../../utils/programConst';

interface ProgramCardProps {
  program: IChallenge | IVod | ILive | IProgramInfo;
  programType: (typeof PROGRAM_TYPE)[keyof typeof PROGRAM_TYPE];
}

const ProgramCard = ({ program, programType }: ProgramCardProps) => {
  let _program = program as IChallenge | ILive;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString().replaceAll(' ', '').slice(0, -1);
  };

  // 날짜에 따라 뱃지 상태 계산
  const calculateStatus = () => {
    if (programType === PROGRAM_TYPE.VOD) return PRGRAM_STATUS.PROCEEDING; // VOD 클래스는 startDate가 없음

    const createDate = new Date(_program.createDate);
    if (new Date() < createDate) return PRGRAM_STATUS.PREV; // 프로그램 개설일자보다 이르면 '사전알림 신청'
    if (new Date() > new Date(_program.deadline)) return PRGRAM_STATUS.POST; // 모집마감일이 지났으면 '마감'
    return PRGRAM_STATUS.PROCEEDING; // 그 외 '모집 중'
  };
  const status = calculateStatus();

  return (
    <Link
      to={`/program/detail/${program.id}`}
      className="flex flex-col overflow-hidden rounded-xs"
    >
      <img
        className="h-32 bg-neutral-80 object-cover"
        src={program.thumbnail}
        alt="프로그램 썸네일 배경"
      />
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
        {/* VOD 클래스는 진행일정, 모집마감 없음 */}
        {programType !== PROGRAM_TYPE.VOD && (
          <div>
            <div className="flex gap-1.5">
              <span className="text-0.75-medium">모집마감</span>
              <span className="text-0.75-medium text-primary-dark">
                ~ {formatDate(_program.deadline)}
              </span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-0.75-medium">진행일정</span>
              <span className="text-0.75-medium text-primary-dark">
                {programType === PROGRAM_TYPE.CHALLENGE
                  ? `${formatDate(_program.startDate)} ~ ${formatDate(
                      _program.endDate,
                    )}`
                  : formatDate(_program.startDate)}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProgramCard;
