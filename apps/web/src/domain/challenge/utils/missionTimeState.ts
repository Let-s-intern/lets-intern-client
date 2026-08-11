import { Schedule, ScheduleMission } from '@/schema';
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

/** 이미 마감된 회차 수. 진행률처럼 "얼마나 왔는가" 를 재는 자리에 쓴다. */
export const countFinishedMissions = (schedules: Schedule[], now: Dayjs) =>
  schedules.filter(
    (schedule) => getMissionTimeState(schedule.missionInfo, now) === 'PAST',
  ).length;

/**
 * 마감된 회차 중 가장 늦게 끝난 것.
 * 진행 중인 미션이 없는 시간대에 "지금 보고 있어야 할 회차" 다.
 */
export const findLastFinishedSchedule = (
  schedules: Schedule[],
  now: Dayjs,
): Schedule | undefined => {
  let latest: Schedule | undefined;

  for (const schedule of schedules) {
    if (getMissionTimeState(schedule.missionInfo, now) !== 'PAST') continue;

    const endDate = schedule.missionInfo.endDate;
    if (!endDate) continue;

    const latestEndDate = latest?.missionInfo.endDate;
    if (!latestEndDate || endDate.isAfter(latestEndDate)) latest = schedule;
  }

  return latest;
};

/**
 * 아직 열리지 않은 회차 중 가장 먼저 열릴 것.
 * 진행 중인 미션이 없는 시간대에 "다음은 이것" 이라고 알려 줄 자리다.
 */
export const findNextUpcomingSchedule = (
  schedules: Schedule[],
  now: Dayjs,
): Schedule | undefined => {
  let earliest: Schedule | undefined;

  for (const schedule of schedules) {
    if (getMissionTimeState(schedule.missionInfo, now) !== 'UPCOMING') continue;

    const startDate = schedule.missionInfo.startDate;
    if (!startDate) continue;

    const earliestStartDate = earliest?.missionInfo.startDate;
    if (!earliestStartDate || startDate.isBefore(earliestStartDate)) {
      earliest = schedule;
    }
  }

  return earliest;
};
