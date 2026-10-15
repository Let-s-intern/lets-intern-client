import { buildSchedule } from '@/domain/challenge/utils/__fixtures__/challengeSchedule';
import { getFocusSlideIndex } from './getFocusSlideIndex';

const buildByTh = (thList: number[]) =>
  thList.map((th, day) => buildSchedule({ th, day }));

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index);

describe('getFocusSlideIndex', () => {
  it('회차가 이어지면 th - 1 자리를 가운데에 둔다', () => {
    const schedules = buildByTh(range(1, 20));

    // 10회차는 인덱스 9, 한 화면 4장이면 9 - 2 = 7
    expect(getFocusSlideIndex(schedules, 10, 4)).toBe(7);
  });

  it('0회차로 시작하면 th 자리를 가운데에 둔다', () => {
    const schedules = buildByTh(range(0, 20));

    // 10회차는 인덱스 10
    expect(getFocusSlideIndex(schedules, 10, 4)).toBe(8);
  });

  // E7: 버전 B 에는 4회차가 없다. 예전 계산은 10회차를 인덱스 9 로 보고 11회차 쪽으로 갔다.
  it('빠진 회차가 있어도 그 회차 카드의 실제 자리로 간다', () => {
    const schedules = buildByTh([1, 2, 3, ...range(5, 20)]);

    // 10회차는 인덱스 8
    expect(getFocusSlideIndex(schedules, 10, 4)).toBe(6);
  });

  it('첫 화면에 이미 보이는 카드면 움직이지 않는다', () => {
    const schedules = buildByTh(range(1, 20));

    expect(getFocusSlideIndex(schedules, 4, 4)).toBeNull();
    expect(getFocusSlideIndex(schedules, 5, 4)).toBe(2);
  });

  it('0회차로 시작하면 첫 화면 경계가 한 회차 앞이다', () => {
    const schedules = buildByTh(range(0, 20));

    expect(getFocusSlideIndex(schedules, 3, 4)).toBeNull();
    expect(getFocusSlideIndex(schedules, 4, 4)).toBe(2);
  });

  it('그 회차 카드가 없으면 움직이지 않는다', () => {
    const schedules = buildByTh([1, 2, 3, ...range(5, 20)]);

    expect(getFocusSlideIndex(schedules, 4, 4)).toBeNull();
  });
});
