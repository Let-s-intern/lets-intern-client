/**
 * 서면 제출 상태 — 화면 표기와 작성 가능 여부의 단일 판정(SSOT).
 *
 * 기존에는 `status === 'ABSENT' || id == null` 식이 7곳에 복사돼 있었고,
 * 그 boolean 하나가 "제출물 열람 가능?"과 "피드백 작성 가능?"을 함께 표현했다.
 * 그래서 "제출은 했지만 피드백 대상은 아님"인 지각 제출(LATE)이 들어갈 자리가 없었다.
 */
export type WrittenSubmissionState = 'submitted' | 'late' | 'notSubmitted';

interface WrittenSubmissionInput {
  /** 출석 상태. 값은 `AttendanceStatus`(PRESENT|UPDATED|LATE|ABSENT). */
  status: string | null | undefined;
  /** 출석 id. 신규 목록 API는 미제출자를 leftJoin 으로 내려주므로 null 가능. */
  attendanceId: number | null | undefined;
}

/**
 * 서면 제출 상태를 판정한다.
 *
 * - notSubmitted: 출석 행이 없거나(id null) 미제출(ABSENT)
 * - late:         지각 제출. 제출물은 있으나 서면 피드백 대상이 아니다
 * - submitted:    그 외(PRESENT·UPDATED)
 *
 * 라이브(`resolveLiveSessionStatus`)가 `LATE|ABSENT` 를 한 덩어리로 '취소' 처리하는
 * 것과 같은 규칙이되, 서면은 제출물 열람 허용 여부가 갈리므로 두 상태를 분리한다.
 *
 * `status` 가 비어 있으면 미제출로 **보지 않는다.** 서면 목록 스키마는 null 을
 * 'ABSENT' 로 채워 내려주므로(`challengeSchema.ts`) 서면 경로에서는 애초에 null 이
 * 오지 않는다. 반면 `MenteeList` 를 공유하는 라이브 모달은 `status: null` 을 그대로
 * 넘긴다(`LiveFeedbackReservationModal.tsx`). null 을 미제출로 판정하면 예약만 된
 * 라이브 세션이 전부 '미제출' 배지가 된다 — 그래서 판정을 명시적 ABSENT 로만 좁힌다.
 */
export function resolveWrittenSubmissionState({
  status,
  attendanceId,
}: WrittenSubmissionInput): WrittenSubmissionState {
  if (attendanceId == null || status === 'ABSENT') return 'notSubmitted';
  if (status === 'LATE') return 'late';
  return 'submitted';
}

/** 피드백 작성·저장·완료가 가능한가. */
export function canWriteWrittenFeedback(
  state: WrittenSubmissionState,
): boolean {
  return state === 'submitted';
}

/** 제출물(경험정리·링크) 열람이 가능한가. 지각 제출도 열람은 허용한다. */
export function canViewSubmission(state: WrittenSubmissionState): boolean {
  return state !== 'notSubmitted';
}

/** 목록·배지의 제출 라벨. */
export const WRITTEN_SUBMISSION_LABEL = {
  submitted: '제출',
  late: '지각 제출',
  notSubmitted: '미제출',
} as const satisfies Record<WrittenSubmissionState, string>;

export type WrittenSubmissionLabel =
  (typeof WRITTEN_SUBMISSION_LABEL)[WrittenSubmissionState];

/** 지각 제출 안내 문구 — 에디터·툴팁이 같은 문장을 쓰도록 모아 둔다. */
export const LATE_SUBMISSION_NOTICE =
  '지각 제출 건은 서면 피드백을 진행하지 않습니다';
