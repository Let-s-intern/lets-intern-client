import { ScheduleMission } from '@/schema';
import { Dayjs } from 'dayjs';

export type MissionTimeState = 'UPCOMING' | 'IN_PROGRESS' | 'PAST';

type MissionPeriod = Pick<ScheduleMission, 'startDate' | 'endDate'>;

/**
 * 미션이 지금 기준으로 어느 시점에 있는지 돌려준다.
 *
 * 경계는 포함이다. `now` 가 `startDate` 정각이거나 `endDate` 정각이면 `IN_PROGRESS`.
 * 서버 `MissionEntity.inProgress()` 는 `startDate < now < endDate` 로 경계를 배타 처리하므로
 * 정확히 그 두 시점의 1초 동안만 판정이 갈린다. 화면에서는 마감 정각까지 제출 가능한 것으로
 * 보이는 편이 사용자 기대에 맞아 포함으로 둔다.
 *
 * `startDate` 나 `endDate` 를 모르면 `UPCOMING` 이다. 날짜를 모르는 미션을 "지나갔다" 로 보면
 * 출석 기록이 없는 회차가 전부 '미제출' 로 그려진다 — LC-3207 에서 고친 그 버그와 같은 결과다.
 *
 * 순수 함수다. 내부에서 `dayjs()` 를 부르지 않고 `now` 를 인자로 받는다.
 */
export const getMissionTimeState = (
  mission: MissionPeriod,
  now: Dayjs,
): MissionTimeState => {
  const { startDate, endDate } = mission;

  if (!startDate || !endDate) return 'UPCOMING';

  if (now.isBefore(startDate)) return 'UPCOMING';
  if (now.isAfter(endDate)) return 'PAST';

  return 'IN_PROGRESS';
};
