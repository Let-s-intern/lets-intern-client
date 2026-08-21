import type { SelectedApplySlot } from '../apply/types';
import { toTimeKey } from '../apply/utils';
import type { QuestionInput } from './types';

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

/**
 * 질문 입력이 서버 검증을 통과할 수 있는지 본다. 통과하면 null, 아니면 안내 문구.
 *
 * 규칙은 서버 `LiveMentoringApplicationValidator.validateQuestion` 을 그대로 옮겼다.
 * 여기서 걸러 두지 않으면 `결제하기` 를 누른 뒤 `LIVE_MENTORING_INVALID_QUESTION`
 * 400 만 돌아오는데, 그 문구("질문 및 첨부 정보가 올바르지 않습니다")로는 무엇을
 * 고쳐야 하는지 알 수 없다.
 */
export const validateQuestionInput = (
  question: QuestionInput,
): string | null => {
  // 나중에 작성하기면 아무것도 보지 않는다 — 서버도 그렇다.
  if (question.deferred) return null;

  if (question.content.trim().length === 0) {
    return '멘토에게 궁금한 점을 작성하거나 `나중에 작성하기` 를 선택해 주세요.';
  }

  if (question.attachmentType === 'FILE' && question.fileId === null) {
    return '첨부할 파일을 업로드해 주세요.';
  }

  if (question.attachmentType === 'URL') {
    // 서버가 절대 https URI 에 호스트까지 있는지 본다.
    let parsed: URL;
    try {
      parsed = new URL(question.url);
    } catch {
      return '첨부 URL 은 https:// 로 시작하는 주소여야 합니다.';
    }
    if (parsed.protocol !== 'https:' || parsed.hostname.length === 0) {
      return '첨부 URL 은 https:// 로 시작하는 주소여야 합니다.';
    }
  }

  if (question.attachmentType !== 'NONE' && !question.mentorShareAgreed) {
    return '첨부 자료를 멘토에게 전달하는 데 동의해 주세요.';
  }

  return null;
};
