import { clsx } from 'clsx';

interface MissionHeaderSectionProps {
  className?: string;
  todayTh: number;
  missionType: string;
  deadline: string;
  isSubmitted?: boolean;
}

const MissionHeaderSection = ({
  className,
  todayTh,
  missionType,
  deadline,
  isSubmitted,
}: MissionHeaderSectionProps) => {
  const getMissionTitle = () => {
    if (todayTh === 100) {
      return '보너스 미션';
    }
    return `${todayTh}회차 미션`;
  };

  const shouldShowError = todayTh >= 1 && todayTh <= 8 && isSubmitted === false;

  return (
    <section className={clsx('flex flex-col gap-1', className)}>
      {/* 헤더 섹션 */}
      <div className="flex flex-row gap-2">
        <div className="flex flex-row items-center gap-2">
          <h2 className="text-small18 font-semibold text-neutral-0">
            {getMissionTitle()}
          </h2>
          <div className="h-[18px] w-px bg-neutral-60" />
          <h2 className="text-small18 font-semibold text-neutral-0">
            {missionType}
          </h2>
        </div>
        <p className="flex flex-row items-end text-xsmall16 font-medium text-primary-90">
          마감기한 {deadline}까지
        </p>
      </div>

      {/* 에러 메시지 */}
      {shouldShowError && (
        <p className="text-xsmall16 font-medium text-red-500">
          제출하지 않은 미션입니다. 늦더라도 제출을 완료해주세요!
        </p>
      )}
    </section>
  );
};

export default MissionHeaderSection;
