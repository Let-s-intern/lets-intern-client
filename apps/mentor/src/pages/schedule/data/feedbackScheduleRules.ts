import {
  addDays,
  endOfDay,
  isWithinInterval,
  parseISO,
  startOfDay,
} from 'date-fns';

/**
 * 라이브 피드백 일정/슬롯 오픈 기간 규칙 — 미션 일자(missionStartDate/EndDate) 앵커 오프셋.
 *
 * PRD §4·§6-2 하단 표 근거 (미션 일자 기준 오프셋):
 * | 구분            | 기간(오프셋)                                |
 * | --------------- | ------------------------------------------- |
 * | LIVE 슬롯 오픈  | 미션 시작일 -3일 00:00:00 ~ -2일 23:59:59   |
 * | LIVE 예약(멘티) | 미션 시작일 ~ 미션 종료일                   |
 * | LIVE 진행       | 미션 종료일 +2일 00:00:00 ~ +4일 23:59:59   |
 *
 * BE 산식 근거(멘토 피드백 마감 알림 배치 `MentorFeedback*NotificationTasklet`):
 *  - slotDeadline  = missionStartDate.minusDays(2) 23:59
 *  - feedbackStart = missionEndDate.plusDays(2) 00:00
 *  - feedbackEnd   = missionEndDate.plusDays(4)
 * (⚠️ 서면 피드백 진행기간은 별도 +1~+3 규칙 — writtenFeedback.ts / buildMissionRangeMap 참조)
 * → 경계 시각은 위 표(±N일 00:00:00 / 23:59:59)를 FE 기준으로 삼는다.
 *   즉 여는 경계는 해당 일자의 하루 시작(00:00:00), 닫는 경계는 하루 끝(23:59:59)으로 취한다.
 *
 * ⚠️ 순수 규칙만 담는다(부수효과·쿼리 없음). 소비처가 미션 일자를 넘겨 기간을 파생한다.
 */

/** 슬롯 오픈 기간 오프셋(일) — 미션 시작일 기준. start=-3일 시작, end=-2일 끝. */
export const SLOT_OPEN_OFFSET_DAYS = { start: -3, end: -2 } as const;

/** 진행 기간 오프셋(일) — 미션 종료일 기준. start=+2일 시작, end=+4일 끝. */
export const PROGRESS_OFFSET_DAYS = { start: 2, end: 4 } as const;

/** 파생된 기간 구간. `start`/`end`는 경계 시각까지 포함한 Date. */
export interface ScheduleWindow {
  start: Date;
  end: Date;
}

/**
 * 슬롯 오픈 기간: 미션 시작일 -3일 00:00:00 ~ -2일 23:59:59.
 * @param missionStartDate BE 미션 시작 일시(ISO LocalDateTime 문자열)
 */
export function computeSlotOpenWindow(
  missionStartDate: string,
): ScheduleWindow {
  const anchor = parseISO(missionStartDate);
  return {
    start: startOfDay(addDays(anchor, SLOT_OPEN_OFFSET_DAYS.start)),
    end: endOfDay(addDays(anchor, SLOT_OPEN_OFFSET_DAYS.end)),
  };
}

/**
 * 진행 기간: 미션 종료일 +2일 00:00:00 ~ +4일 23:59:59.
 * @param missionEndDate BE 미션 종료 일시(ISO LocalDateTime 문자열)
 *
 * TODO(미배선): 현재 정의만 있고 캘린더에 "진행 기간" 바로 배선되지 않았다(PRD §4 표의
 *   LIVE/서면 진행 기간). 진행 기간 바를 추가하려면 useLiveFeedbackData에서 이 함수로
 *   기간을 만들어 period 바로 push하고 렌더 분기를 추가할 것.
 */
export function computeProgressWindow(missionEndDate: string): ScheduleWindow {
  const anchor = parseISO(missionEndDate);
  return {
    start: startOfDay(addDays(anchor, PROGRESS_OFFSET_DAYS.start)),
    end: endOfDay(addDays(anchor, PROGRESS_OFFSET_DAYS.end)),
  };
}

/**
 * 예약(멘티) 기간: 미션 시작일 00:00:00 ~ 미션 종료일 23:59:59.
 */
export function computeReservationWindow(
  missionStartDate: string,
  missionEndDate: string,
): ScheduleWindow {
  return {
    start: startOfDay(parseISO(missionStartDate)),
    end: endOfDay(parseISO(missionEndDate)),
  };
}

/** `now`가 구간에 포함되는지(경계 포함) 판정. */
export function isWithinWindow(now: Date, window: ScheduleWindow): boolean {
  return isWithinInterval(now, { start: window.start, end: window.end });
}

/**
 * 여러 미션의 슬롯 오픈 윈도를 단일 게이팅 윈도로 합성한다.
 *
 * 통합 편집기(모든 챌린지/미션 슬롯을 한 그리드에서 오픈)에서는 미션마다 오픈 윈도
 * (미션 시작 -3d~-2d)가 다르다. 게이팅 prop은 단일 `ScheduleWindow`이므로,
 * "하나라도 열려 있으면 통과"라는 union 시맨틱을 다음 우선순위로 안전하게 근사한다:
 *
 *  1) `now`가 포함되는 윈도가 하나라도 있으면 그 윈도를 반환 → 게이팅 통과(오픈 허용).
 *  2) 없으면 앞으로 열릴 가장 가까운(시작이 `now` 이후 최솟값) 윈도를 반환
 *     → 게이팅 활성 + "언제 열 수 있는지" 안내.
 *  3) 활성·예정 윈도가 모두 없으면(미션 일자 미반영 또는 전부 과거) `null` 반환
 *     → 게이팅 미적용(현행 유지, forward-compatible 폴백; 앱이 깨지지 않는다).
 *
 * @param missionStartDates 미션 시작 일시(ISO) 목록. null/undefined/빈 문자열은 무시.
 * @param now 기준 시각(보통 `currentNow()`).
 */
export function selectSlotOpenWindow(
  missionStartDates: Array<string | null | undefined>,
  now: Date,
): ScheduleWindow | null {
  const windows = missionStartDates
    .filter((d): d is string => !!d)
    .map(computeSlotOpenWindow);

  const active = windows.find((w) => isWithinWindow(now, w));
  if (active) return active;

  const nowMs = now.getTime();
  const upcoming = windows
    .filter((w) => w.start.getTime() > nowMs)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  return upcoming[0] ?? null;
}
