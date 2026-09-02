import type { LiveMentoringAttachmentType } from '@/api/live-mentoring/liveMentoringSchema';

/**
 * 전액 할인 쿠폰은 서버가 `discount: -1` 로 내려준다 (`calculatePrice` 규칙).
 *
 * 쿠폰 훅이 아니라 여기 두는 이유 — 훅은 HTTP 모듈을 끌고 오는데, 금액 표시
 * 컴포넌트가 상수 하나 때문에 그 의존을 함께 짊어질 이유가 없다.
 */
export const FULL_DISCOUNT = -1;

/**
 * 결제 페이지에서 받는 멘토 질문 입력값.
 *
 * 그대로 신청 생성 요청의 `question` 이 된다 — 글자수 상한도 서버
 * `CreateLiveMentoringApplicationRequestDto.Question` 과 같은 값을 쓴다.
 */
export interface QuestionInput {
  /** `나중에 작성하기`. 켜면 아래 값들은 보내지 않는다. */
  deferred: boolean;
  content: string;
  attachmentType: LiveMentoringAttachmentType;
  /** `uploadFileForId` 가 돌려준 파일 id. 첨부가 파일일 때만 채운다. */
  fileId: number | null;
  url: string;
  mentorShareAgreed: boolean;
}

/** 서버 `@Size(max = 5000)`. */
export const QUESTION_CONTENT_MAX = 5000;
/** 서버 `@Size(max = 2048)`. */
export const QUESTION_URL_MAX = 2048;

export const EMPTY_QUESTION: QuestionInput = {
  deferred: false,
  content: '',
  attachmentType: 'NONE',
  fileId: null,
  url: '',
  mentorShareAgreed: false,
};
