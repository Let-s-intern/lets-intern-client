import {
  formatMissionOpenTime,
  isWithinMinuteCountdown,
} from '@/domain/challenge/utils/missionOpenTime';
import dayjs from '@/lib/dayjs';
import { Schedule } from '@/schema';
import { BONUS_MISSION_TH, TALENT_POOL_MISSION_TH } from '@/utils/constants';
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
 * 미션과 미션 사이에 빈 시간이 있을 때만 오늘의 미션 카드 자리를 대신한다.
 *
 * 앞 회차 마감 직후 다음 회차가 열리는 편성이면 이 카드는 뜨지 않는다. `dailyMission` 이
 * 한 순간도 비지 않아 카드가 1회차에서 2회차로 바로 갈아끼워지기 때문이다.
 * 편성에 빈틈이 있을 때만 나타나는 안전망이고, 편성이 정리되면 저절로 사라진다.
 *
 * 예전에는 이 자리에 "모든 미션이 완료되었습니다" 가 떴다. `dailyMission` 이 null 인 것을
 * "다 끝났다" 로 읽었기 때문인데, 실제 뜻은 "지금은 미션 시간이 아니다" 다.
 * 2회차를 하고 있는 사람에게 완주 축하가 나갔다(LC-3207).
 */
const MissionNotOpenSection = ({ nextSchedule }: Props) => {
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

  return (
    <section className="rounded-xs border-neutral-80 flex min-h-[240px] shrink-0 flex-col border md:h-[360px] md:min-h-[180px] md:w-[488px]">
      <div className="flex flex-col border-b px-4 py-3 md:flex-row md:items-center md:gap-2 md:py-4">
        <h2 className="text-neutral-10 font-semibold">다음 미션</h2>
        <span className="text-xsmall14 text-neutral-30 md:text-xsmall16">
          {missionLabel(mission.th)} {mission.title}
        </span>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-6">
        <p className="text-small18 text-neutral-0 md:text-medium22 text-center font-semibold">
          {startDate ? formatMissionOpenTime(startDate, now) : '곧 열려요'}
        </p>
      </div>
    </section>
  );
};

export default MissionNotOpenSection;
