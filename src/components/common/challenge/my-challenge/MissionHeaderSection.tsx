import { clsx } from 'clsx';
import dayjs from '../../../../lib/dayjs';

interface MissionHeaderSectionProps {
  className?: string;
  missionType: string;
  deadline: string;
  selectedMissionTh: number;
  isSubmitted?: boolean;
}

const MissionHeaderSection = ({
  className,
  selectedMissionTh,
  missionType,
  deadline,
  isSubmitted,
}: MissionHeaderSectionProps) => {
  const getMissionTitle = () => {
    if (selectedMissionTh === 100) {
      return '보너스 미션';
    }
    if (selectedMissionTh === 101) {
      return '0회차 미션';
    }
    return `${selectedMissionTh}회차 미션`;
  };

  const isDeadlinePassed = () => {
    try {
      // deadline 문자열에서 날짜 추출 (예: "04.04 11:59까지" -> "04.04 11:59")
      const deadlineText = deadline.replace(/까지$/, '').trim();

      // 현재 연도 추가해서 파싱
      const currentYear = dayjs().year();
      let deadlineDate;

      if (deadlineText.includes('.')) {
        // "MM.DD" 또는 "MM.DD HH:mm" 형태
        const [datePart, timePart] = deadlineText.split(' ');
        const [month, day] = datePart.split('.');
        const timeString = timePart || '23:59'; // 시간이 없으면 23:59로 설정
        deadlineDate = dayjs(
          `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${timeString}`,
        );
      } else {
        // 다른 형태의 날짜 문자열
        deadlineDate = dayjs(deadlineText);
      }

      return dayjs().isAfter(deadlineDate);
    } catch {
      // 파싱 실패 시 기본값 false 반환
      return false;
    }
  };

  const shouldShowError =
    selectedMissionTh >= 1 && selectedMissionTh <= 8 && isSubmitted === false;

  return (
    <section className={clsx('flex flex-col gap-1', className)}>
      {/* 헤더 섹션 */}
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="flex flex-row items-center gap-2">
          <h2 className="text-xsmall16 font-semibold text-neutral-0 md:text-small18">
            {getMissionTitle()}
          </h2>
          <div className="h-[18px] w-px bg-neutral-60" />
          <h2 className="text-xsmall16 font-semibold text-neutral-0 md:text-small18">
            {missionType}
          </h2>
        </div>
        <p
          className={clsx(
            'flex flex-row items-end text-xsmall14 font-medium md:text-xsmall16',
            {
              'text-neutral-60': isDeadlinePassed(),
              'text-primary-90': !isDeadlinePassed(),
            },
          )}
        >
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
