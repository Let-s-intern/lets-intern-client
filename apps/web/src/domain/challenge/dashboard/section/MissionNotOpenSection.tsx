import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import useChallengeNav from '@/domain/challenge/hooks/useChallengeNav';
import {
  formatMissionOpenTime,
  isWithinMinuteCountdown,
} from '@/domain/challenge/utils/missionOpenTime';
import dayjs from '@/lib/dayjs';
import { Schedule } from '@/schema';
import { useMissionStore } from '@/store/useMissionStore';
import { BONUS_MISSION_TH, TALENT_POOL_MISSION_TH } from '@/utils/constants';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const missionLabel = (th: number | null) => {
  if (th === BONUS_MISSION_TH) return '보너스';
  if (th === TALENT_POOL_MISSION_TH) return '인재풀';
  return `${th}회차`;
};

interface Props {
  /** 아직 열리지 않은 회차 중 가장 먼저 열릴 것 */
  nextSchedule: Schedule;
}

/**
 * 진행 중인 미션이 없는 시간대에 오늘의 미션 카드 자리를 대신한다.
 *
 * 예전에는 이 자리에 "모든 미션이 완료되었습니다" 가 떴다. `dailyMission` 이 null 인 것을
 * "다 끝났다" 로 읽었기 때문인데, 실제 뜻은 "지금은 미션 시간이 아니다" 다.
 * 2회차를 하고 있는 사람에게 완주 축하가 나가고, 그와 함께 "미션 수행하기" 버튼도
 * "이전 미션 돌아보기" 로 바뀌어 제출 진입로가 사라졌다(LC-3207).
 *
 * 자료는 시작 전에도 볼 수 있으므로(LC-3207 미션 전체 공개) 막다른 길로 두지 않고
 * 미리 보기로 이어 준다.
 */
const MissionNotOpenSection = ({ nextSchedule }: Props) => {
  const params = useParams<{ applicationId: string }>();
  const { currentChallenge } = useCurrentChallenge();
  const { withTestDate } = useChallengeNav();
  const { setSelectedMission } = useMissionStore();

  const mission = nextSchedule.missionInfo;
  const startDate = mission.startDate;

  const [now, setNow] = useState(() => dayjs());

  // 한 시간 안쪽일 때만 분이 의미를 갖는다. 그 밖에는 문구가 바뀌지 않으므로
  // 타이머를 돌리지 않는다.
  const needsTick = startDate ? isWithinMinuteCountdown(startDate, now) : false;

  useEffect(() => {
    if (!needsTick) return;

    const timer = setInterval(() => setNow(dayjs()), 60_000);
    return () => clearInterval(timer);
  }, [needsTick]);

  const label = missionLabel(mission.th);

  return (
    <section className="rounded-xs border-neutral-80 flex min-h-[240px] shrink-0 flex-col border md:h-[360px] md:min-h-[180px] md:w-[488px]">
      <div className="flex flex-col border-b px-4 py-3 md:flex-row md:items-center md:gap-2 md:py-4">
        <h2 className="text-neutral-10 font-semibold">다음 미션</h2>
        <span className="text-xsmall14 text-neutral-30 md:text-xsmall16">
          {label} {mission.title}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-6">
        <p className="text-small18 text-neutral-0 md:text-medium22 text-center font-semibold">
          {startDate ? formatMissionOpenTime(startDate, now) : '곧 열려요'}
        </p>
        <p className="text-xsmall14 text-neutral-30 md:text-xsmall16 text-center">
          미리 자료를 확인하고 준비해 두세요
        </p>
      </div>

      <Link
        href={withTestDate(
          `/challenge/${params.applicationId}/${currentChallenge?.id}/me`,
        )}
        onClick={() => setSelectedMission(mission.id, mission.th ?? 0)}
        className="rounded-xs bg-primary m-3 p-3 text-center font-medium text-white"
      >
        {label} 자료 미리 보기
      </Link>
    </section>
  );
};

export default MissionNotOpenSection;
