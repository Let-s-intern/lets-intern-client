import { buildSchedule } from '@/domain/challenge/utils/__fixtures__/challengeSchedule';
import { findLevelCounterpartMission } from './experienceLevelMission';

// 3회차가 경험정리 쌍이다. 서버 오늘 미션은 id 가 작은 LV1 쪽이다.
const LV1_MISSION_ID = 1003;
const LV2_MISSION_ID = 2003;

const schedules = [
  buildSchedule({ th: 1, day: 0 }),
  buildSchedule({ th: 2, day: 1 }),
  buildSchedule({
    th: 3,
    id: LV1_MISSION_ID,
    day: 2,
    missionType: 'EXPERIENCE_1',
  }),
  buildSchedule({
    th: 3,
    id: LV2_MISSION_ID,
    day: 2,
    missionType: 'EXPERIENCE_2',
  }),
  // 4회차는 경험정리1 만 편성됐다
  buildSchedule({ th: 4, id: 1004, day: 3, missionType: 'EXPERIENCE_1' }),
];

describe('findLevelCounterpartMission', () => {
  it('LV2 에게 LV1 미션이 선택돼 있으면 같은 회차의 LV2 미션을 돌려준다', () => {
    expect(
      findLevelCounterpartMission(schedules, LV1_MISSION_ID, 'LV2'),
    ).toEqual({ id: LV2_MISSION_ID, th: 3 });
  });

  it('LV1 에게 LV2 미션이 선택돼 있으면 같은 회차의 LV1 미션을 돌려준다', () => {
    expect(
      findLevelCounterpartMission(schedules, LV2_MISSION_ID, 'LV1'),
    ).toEqual({ id: LV1_MISSION_ID, th: 3 });
  });

  it.each([
    ['LV1', LV1_MISSION_ID],
    ['LV2', LV2_MISSION_ID],
  ] as const)(
    '%s 에게 맞는 미션이 이미 선택돼 있으면 바꾸지 않는다',
    (level, id) => {
      expect(findLevelCounterpartMission(schedules, id, level)).toBeNull();
    },
  );

  it('경험정리 미션이 아니면 바꾸지 않는다', () => {
    expect(findLevelCounterpartMission(schedules, 1002, 'LV2')).toBeNull();
  });

  it('같은 회차에 짝이 없으면 바꾸지 않는다', () => {
    expect(findLevelCounterpartMission(schedules, 1004, 'LV2')).toBeNull();
  });

  it('선택된 미션이 일정에 없으면 바꾸지 않는다', () => {
    expect(findLevelCounterpartMission(schedules, 0, 'LV2')).toBeNull();
  });
});
