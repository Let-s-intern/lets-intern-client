import { getMissionTimeState } from '@/domain/challenge/utils/missionTimeState';
import dayjs from '@/lib/dayjs';
import { clsx } from 'clsx';
import { Dayjs } from 'dayjs';

interface MissionHeaderSectionProps {
  className?: string;
  missionType: string;
  /** 선택된 회차. 오늘 회차도 선택된 회차도 없으면 null 이다. */
  selectedMissionTh: number | null;
  isSubmitted?: boolean;
  missionStartDate?: Dayjs | null;
  missionEndDate?: Dayjs | null;
}

const MissionHeaderSection = ({
  className,
  selectedMissionTh,
  missionType,
  isSubmitted,
  missionStartDate,
  missionEndDate,
}: MissionHeaderSectionProps) => {
  const getMissionTitle = () => {
    // 회차를 알 수 없는 경우. 가이드는 미션을 골라야 열리므로 실제로는 닿기 어렵지만
    // "null회차 미션" 이 그려지는 것보다 낫다.
    if (selectedMissionTh === null) return '미션';
    if (selectedMissionTh === 100) return '보너스 미션';
    if (selectedMissionTh === 99) return '인재풀 미션';
    return `${selectedMissionTh}회차 미션`;
  };

  const now = dayjs();
  const timeState = getMissionTimeState(
    { startDate: missionStartDate ?? null, endDate: missionEndDate ?? null },
    now,
  );

  const isDeadlinePassed = timeState === 'PAST';

  /**
   * 기간 문구. 시작 전에는 언제 열리는지, 열린 뒤로는 언제까지 낼 수 있는지 말한다.
   *
   * 예전에는 `deadline` 문자열을 받아 정규식으로 되파싱해 마감 여부를 판정했다.
   * Dayjs 를 문자열로 만들었다가 다시 읽는 구조라 포맷이 바뀌면 조용히 깨졌고,
   * 파싱할 때 연도를 올해로 가정해 연말·연초에도 어긋났다. Dayjs 를 직접 받는다.
   */
  const getPeriodText = () => {
    // 0회차(OT)는 기간을 말하지 않는다. 기존 동작 그대로다.
    if (selectedMissionTh === 0) return null;

    if (missionStartDate && timeState === 'UPCOMING') {
      return `${missionStartDate.format('M월 D일 HH:mm')} 오픈`;
    }

    if (missionEndDate) {
      return `마감기한 ${missionEndDate.format('MM.DD HH:mm')}까지`;
    }

    return null;
  };

  const periodText = getPeriodText();

  const shouldShowError =
    selectedMissionTh !== null &&
    selectedMissionTh >= 1 &&
    selectedMissionTh <= 8 &&
    isSubmitted === false;

  return (
    <section className={clsx('flex flex-col gap-1', className)}>
      {/* 헤더 섹션 */}
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="flex flex-row items-center gap-2">
          <h2 className="text-xsmall16 text-neutral-0 md:text-small18 font-semibold">
            {getMissionTitle()}
          </h2>
          <div className="bg-neutral-60 h-[18px] w-px" />
          <h2 className="text-xsmall16 text-neutral-0 md:text-small18 font-semibold">
            {missionType}
          </h2>
        </div>
        {periodText && (
          <p
            className={clsx(
              'text-xsmall14 md:text-xsmall16 flex flex-row items-end font-medium',
              {
                'text-neutral-60': isDeadlinePassed,
                'text-primary-90': !isDeadlinePassed,
              },
            )}
          >
            {periodText}
          </p>
        )}
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
