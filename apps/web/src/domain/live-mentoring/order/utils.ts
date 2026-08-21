import type { SelectedApplySlot } from '../apply/types';
import { toTimeKey } from '../apply/utils';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

/**
 * 선택한 슬롯들을 **한 구간**으로 합쳐 표시한다 (시안 `2-0` 의 "예약 일시").
 *
 * 60분 플랜은 30분짜리 두 칸이라 그대로 두면 "12:00~12:30, 12:30~13:00" 두 줄이 된다.
 * 사용자가 산 것은 한 시간짜리 멘토링 하나이므로 첫 칸의 시작과 마지막 칸의 끝을 잇는다.
 * 서버도 신청 생성 응답에서 같은 방식으로 `startAt`/`endAt` 을 만든다.
 *
 * 시각은 타임존 없는 `LocalDateTime` 문자열이라 잘라서 다룬다. 날짜만 요일 계산에
 * `Date` 를 쓰는데, `T00:00:00` 을 붙여 로컬 자정으로 고정한다.
 */
export const formatReservationRange = (
  slots: SelectedApplySlot[],
): string | null => {
  if (slots.length === 0) return null;

  let first = slots[0];
  let last = slots[0];
  for (const slot of slots) {
    if (slot.startDate < first.startDate) first = slot;
    if (slot.endDate > last.endDate) last = slot;
  }

  const [year, month, day] = first.date.split('-');
  const weekday = WEEKDAYS[new Date(`${first.date}T00:00:00`).getDay()];

  return `${year}.${month}.${day} (${weekday}) ${toTimeKey(first.startDate)} ~ ${toTimeKey(last.endDate)}`;
};
