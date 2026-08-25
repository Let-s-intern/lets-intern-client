/**
 * 라이브 피드백·라이브 멘토링 예약 슬롯의 시간 규칙.
 *
 * 멘토가 여는 화면, 멘티가 고르는 화면, 어드민 주간 캘린더가 **모두 이 값을 쓴다.**
 * 세 곳이 각자 상한을 적어두던 시절에 어드민만 22:00 에서 끊겨,
 * 멘토가 연 22:00~22:30 슬롯이 어드민에서 아무 표시 없이 사라진 적이 있다
 * (2026-08-14 운영 문의). 그래서 값을 한 곳에 모았다.
 *
 * 정책: 슬롯은 09:00 에 시작해 22:30 시작이 마지막이다. 마지막 슬롯은 23:00 에 끝난다.
 *
 * 서버는 슬롯 시각을 검증하지 않는다(`FeedbackSlot.createFeedbackSlot`).
 * 지금은 이 상수가 사실상 유일한 방어선이므로, 화면에서 우회할 수 있는 경로를
 * 만들지 않는다. 정책을 바꾸려면 여기만 고친다.
 */

/** 슬롯이 시작할 수 있는 가장 이른 시각(시). */
export const SLOT_START_HOUR = 9;

/**
 * 슬롯이 끝날 수 있는 가장 늦은 시각(시). 이 시각은 포함하지 않는다.
 * 23 이면 마지막 슬롯 시작은 22:30, 종료는 23:00 이다.
 */
export const SLOT_END_HOUR = 23;

/** 슬롯 한 칸의 길이(분). */
export const SLOT_MINUTES = 30;

/** 하루에 놓이는 슬롯 칸 수. */
export const SLOTS_PER_DAY =
  ((SLOT_END_HOUR - SLOT_START_HOUR) * 60) / SLOT_MINUTES;

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * 슬롯 시작 시각 목록. `['09:00', '09:30', ..., '22:00', '22:30']`
 *
 * 화면마다 반복문을 다시 쓰지 않는다. 경계를 한 번만 정의해 어긋날 자리를 없앤다.
 */
export const SLOT_START_TIMES: readonly string[] = Array.from(
  { length: SLOTS_PER_DAY },
  (_, index) => {
    const minutesFromStart = index * SLOT_MINUTES;
    const hour = SLOT_START_HOUR + Math.floor(minutesFromStart / 60);
    return `${pad(hour)}:${pad(minutesFromStart % 60)}`;
  },
);

/**
 * 시작 시각이 규칙 안에 있는지. `'22:30'` 은 참, `'23:00'` 은 거짓이다.
 * 서버 검증이 없으므로 저장 전에 이걸로 거른다.
 */
export const isAllowedSlotStartTime = (time: string): boolean =>
  SLOT_START_TIMES.includes(time);

/**
 * 그리드 시작(09:00) 기준 몇 번째 칸인지. 범위 밖이면 `null`.
 *
 * 어드민 주간 캘린더처럼 칸 번호로 배치하는 화면이 쓴다.
 * 범위 밖을 `null` 로 돌려주어 호출부가 "그릴 수 없다" 를 알아채게 한다.
 * 예전 어드민은 범위 밖 값을 그대로 넘겨받아 조용히 버렸다.
 */
export const toSlotIndex = (hour: number, minute: number): number | null => {
  const minutesFromStart = hour * 60 + minute - SLOT_START_HOUR * 60;
  if (minutesFromStart < 0) return null;

  const index = Math.floor(minutesFromStart / SLOT_MINUTES);
  return index < SLOTS_PER_DAY ? index : null;
};
