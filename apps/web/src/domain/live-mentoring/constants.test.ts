import type { LiveMentoringSlot } from '@/api/live-mentoring/liveMentoringSchema';
import { discountRate, slotPeriod } from './constants';

function slot(
  slotId: number,
  startDate: string,
  endDate: string,
): LiveMentoringSlot {
  return { slotId, startDate, endDate, status: 'OPEN' };
}

describe('slotPeriod', () => {
  it('슬롯이 없으면 null 을 돌려준다', () => {
    expect(slotPeriod([])).toBeNull();
  });

  it('슬롯이 하나면 그 슬롯의 시작·종료가 그대로 기간이 된다', () => {
    expect(
      slotPeriod([slot(1, '2026-09-01T10:00:00', '2026-09-01T10:30:00')]),
    ).toEqual({
      beginning: '2026-09-01T10:00:00',
      deadline: '2026-09-01T10:30:00',
    });
  });

  it('여러 슬롯이면 첫 슬롯 시작 ~ 마지막 슬롯 종료를 쓴다', () => {
    expect(
      slotPeriod([
        slot(1, '2026-09-01T10:00:00', '2026-09-01T10:30:00'),
        slot(2, '2026-09-03T14:00:00', '2026-09-03T14:30:00'),
        slot(3, '2026-09-30T17:00:00', '2026-09-30T17:30:00'),
      ]),
    ).toEqual({
      beginning: '2026-09-01T10:00:00',
      deadline: '2026-09-30T17:30:00',
    });
  });

  // 서버는 오름차순으로 주지만 정렬이 계약에 명시된 것은 멘토용 API 뿐이다.
  // 순서가 어긋나도 기간이 뒤집히지 않아야 한다.
  it('입력 순서가 뒤섞여도 가장 이른 시작과 가장 늦은 종료를 고른다', () => {
    expect(
      slotPeriod([
        slot(3, '2026-09-30T17:00:00', '2026-09-30T17:30:00'),
        slot(1, '2026-09-01T10:00:00', '2026-09-01T10:30:00'),
        slot(2, '2026-09-03T14:00:00', '2026-09-03T14:30:00'),
      ]),
    ).toEqual({
      beginning: '2026-09-01T10:00:00',
      deadline: '2026-09-30T17:30:00',
    });
  });

  it('같은 날 여러 슬롯이면 그 날의 첫 시작과 마지막 종료가 된다', () => {
    expect(
      slotPeriod([
        slot(1, '2026-09-01T14:00:00', '2026-09-01T14:30:00'),
        slot(2, '2026-09-01T10:00:00', '2026-09-01T10:30:00'),
      ]),
    ).toEqual({
      beginning: '2026-09-01T10:00:00',
      deadline: '2026-09-01T14:30:00',
    });
  });
});

describe('discountRate', () => {
  it('정가 대비 할인율을 반올림해 돌려준다', () => {
    // 시안 이미지에는 14% / 15% 가 구워져 있었지만 실제 값은 이렇게 나온다
    expect(discountRate(35000, 50000)).toBe(30);
    expect(discountRate(60000, 100000)).toBe(40);
  });

  it('정가와 판매가가 같으면 0 이다 — 할인 배지를 숨기는 신호다', () => {
    expect(discountRate(50000, 50000)).toBe(0);
  });

  it('판매가가 정가보다 높아도 음수를 내지 않는다', () => {
    expect(discountRate(70000, 50000)).toBe(0);
  });
});
