import dayjs from '@/lib/dayjs';
import { missionSubmitToBadge } from './convert';

// '최종 반려' 판정은 챌린지 종료 + 2일을 넘겼는지로 갈린다.
const ongoing = dayjs().add(10, 'day');
const finished = dayjs().subtract(10, 'day');

const badge = (params: Parameters<typeof missionSubmitToBadge>[0]) =>
  missionSubmitToBadge({ challengeEndDate: ongoing, ...params }).text;

// 출석 행이 없는 것(status: null)과 결석(ABSENT)은 다르다.
// 기록이 없다는 사실만으로는 미제출인지 아직 안 열린 회차인지 알 수 없다.
describe('missionSubmitToBadge — 출석 기록이 없을 때', () => {
  it('마감된 회차면 미제출', () => {
    expect(badge({ status: null, result: null, timeState: 'PAST' })).toBe(
      '미제출',
    );
  });

  it('아직 열리지 않은 회차면 예정', () => {
    expect(badge({ status: null, result: null, timeState: 'UPCOMING' })).toBe(
      '예정',
    );
  });

  it('진행 중인 회차면 진행중', () => {
    expect(
      badge({ status: null, result: null, timeState: 'IN_PROGRESS' }),
    ).toBe('진행중');
  });

  // timeState 를 넘기지 않는 기존 호출부(MissionTodayIcon 등)의 동작은 그대로다.
  it('시점을 넘기지 않으면 예전대로 진행중', () => {
    expect(badge({ status: null, result: null })).toBe('진행중');
  });

  it('확인중은 시점보다 우선한다', () => {
    expect(badge({ status: null, result: 'WAITING', timeState: 'PAST' })).toBe(
      '확인중',
    );
  });
});

describe('missionSubmitToBadge — 기존 케이스 회귀', () => {
  it.each([
    ['확인중', { status: 'PRESENT' as const, result: 'WAITING' as const }],
    ['제출 반려', { status: 'PRESENT' as const, result: 'WRONG' as const }],
    ['최종 반려', { status: 'PRESENT' as const, result: 'FINAL_WRONG' as const }],
    ['지각 제출', { status: 'LATE' as const, result: 'PASS' as const }],
    ['지각 제출', { status: 'UPDATED' as const, result: 'PASS' as const }],
    ['미제출', { status: 'ABSENT' as const, result: null }],
    ['제출 성공', { status: 'PRESENT' as const, result: 'PASS' as const }],
  ])('%s', (text, params) => {
    expect(badge(params)).toBe(text);
  });

  it('반려는 챌린지 종료 + 2일이 지나면 최종 반려가 된다', () => {
    expect(
      missionSubmitToBadge({
        status: 'PRESENT',
        result: 'WRONG',
        challengeEndDate: finished,
      }).text,
    ).toBe('최종 반려');
  });

  // 시점을 함께 넘겨도 출석 행이 있으면 판정이 달라지지 않는다.
  it.each(['UPCOMING', 'IN_PROGRESS', 'PAST'] as const)(
    '출석 기록이 있으면 timeState(%s)는 결과를 바꾸지 않는다',
    (timeState) => {
      expect(badge({ status: 'ABSENT', result: null, timeState })).toBe(
        '미제출',
      );
      expect(badge({ status: 'PRESENT', result: 'PASS', timeState })).toBe(
        '제출 성공',
      );
    },
  );
});
