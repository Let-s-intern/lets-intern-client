/**
 * 리뷰 v1 ↔ v2 어댑터 채널.
 *
 * Push 6 (PRD §5.6) — v1 (`reviewItemList[]` 분리형) 과 v2 (`content` 단일형) 간
 * 응답·요청 매핑이 필요해질 경우를 위한 자리표시자(placeholder).
 *
 * **현재는 활성 호출처가 없다.** 본 Push에서는 회귀 위험이 큰 4개 도메인(challenge /
 * mission / live / report) UI 재설계를 보류했고, v2 BE 응답 스키마가 미확정이므로
 * 어댑터 채널만 만들어두고 실제 매핑 구현은 후속 PR에서 진행한다.
 *
 * 구현 시 아래 매핑이 적용되어야 한다:
 *
 * ### v1 → v2 (응답 변환)
 * ```ts
 * {
 *   reviewInfo: {
 *     reviewId, score, npsScore, type, programId, programTitle,
 *     attendanceReview, // 미션 후기
 *   },
 *   reviewItemList: [
 *     { questionType: 'GOOD_POINT', answer },
 *     { questionType: 'BAD_POINT',  answer },
 *     { questionType: 'GOAL_RESULT', answer },
 *     // …
 *   ],
 * }
 *  →
 * {
 *   id, programType, programId, programTitle,
 *   score, nps: npsScore,
 *   content: reviewItemList.map(i => `[${i.questionType}] ${i.answer}`).join('\n\n'),
 * }
 * ```
 *
 * ### v2 → v1 (UI 호환용)
 * 위 변환의 역방향. `content` 를 GOOD_POINT/BAD_POINT/GOAL_RESULT 로 분해하는 것은
 * 일반적으로 불가하므로 BE 와 협의해 별도 필드(`goodPoint`, `badPoint` 등) 를 받거나,
 * UI 측을 단일 textarea 로 재설계해야 한다.
 *
 * @see {@link CreateReviewV2Req} apps/web/src/schema.ts
 * @see {@link ReviewV2Item} apps/web/src/schema.ts
 */

import type {
  CreateReviewV2Req,
  ReviewV2Item,
  ReviewV2ProgramType,
} from '@/schema';

import type {
  GetReview,
  PostReviewParams,
  ReviewType,
} from '@/api/review/review';

/**
 * v1 ReviewType 을 v2 programType 으로 매핑.
 * MISSION_REVIEW 는 v2 작성 비대상이므로 별도 처리(서버 405 가능).
 */
export const reviewTypeToV2ProgramType = (
  type: ReviewType,
): ReviewV2ProgramType => {
  switch (type) {
    case 'CHALLENGE_REVIEW':
      return 'CHALLENGE';
    case 'LIVE_REVIEW':
      return 'LIVE';
    case 'REPORT_REVIEW':
      return 'REPORT';
    case 'MISSION_REVIEW':
      return 'MISSION';
    case 'VOD_REVIEW':
      // VOD 는 v2 programType 미정의 — BE 협의 필요.
      throw new Error(
        '[review-adapters] VOD_REVIEW 는 v2 programType 미정의. BE 협의 필요.',
      );
  }
};

/**
 * v2 programType 을 v1 ReviewType 으로 매핑.
 */
export const v2ProgramTypeToReviewType = (
  programType: ReviewV2ProgramType,
): ReviewType => {
  switch (programType) {
    case 'CHALLENGE':
      return 'CHALLENGE_REVIEW';
    case 'LIVE':
      return 'LIVE_REVIEW';
    case 'REPORT':
      return 'REPORT_REVIEW';
    case 'MISSION':
      return 'MISSION_REVIEW';
  }
};

/**
 * v1 작성 페이로드를 v2 페이로드로 변환.
 * `reviewItemList[]` 의 각 항목을 `[QUESTION_TYPE] answer` 형태로 직렬화하여
 * 단일 `content` 로 합친다.
 *
 * 주의: 본 함수는 임시 변환이며, 실제 활성화 시 BE 가 다중 필드를 수용하는지
 * (예: `goodPoint`, `badPoint` 등 별도 컬럼) 먼저 확인할 것.
 */
export const v1ReviewToV2Req = ({
  programId,
  reviewForm,
}: {
  programId: number;
  reviewForm: PostReviewParams;
}): CreateReviewV2Req => {
  const programType = reviewTypeToV2ProgramType(reviewForm.type);
  if (programType === 'MISSION') {
    throw new Error(
      '[review-adapters] MISSION 은 v2 작성 비대상(서버 405 가능). v1 그대로 사용.',
    );
  }

  const content = (reviewForm.reviewItemList ?? [])
    .map((item) => `[${item.questionType}] ${item.answer}`)
    .join('\n\n');

  // npsAns / npsCheckAns 는 v1 에 없음 — BE 와 협의해 빈값 또는 추가 입력으로 처리.
  return {
    programType: programType as Exclude<ReviewV2ProgramType, 'MISSION'>,
    programId,
    nps: reviewForm.npsScore,
    npsAns: '',
    npsCheckAns: false,
    score: reviewForm.score,
    content,
  };
};

/**
 * v2 응답 한 건을 v1 GetReview 형태로 변환 (UI 호환용).
 * `content` 는 단일 문자열이므로 reviewItemList 한 항목으로만 채운다.
 */
export const v2ItemToV1Review = (item: ReviewV2Item): GetReview => {
  return {
    reviewInfo: {
      reviewId: item.id ?? 0,
      score: item.score ?? null,
      npsScore: item.nps ?? null,
      type: item.programType
        ? v2ProgramTypeToReviewType(item.programType)
        : null,
      createDate: item.createdDate ?? null,
      programId: item.programId ?? null,
      programTitle: item.programTitle ?? null,
      programThumbnail: null,
      challengeType: null,
      reportType: null,
      missionTitle: null,
      missionTh: null,
      attendanceReview: null,
      name: item.name ?? null,
      wishJob: null,
      wishCompany: null,
    },
    reviewItemList: item.content
      ? [
          {
            reviewItemId: 0,
            questionType: 'GOOD_POINT',
            answer: item.content,
          },
        ]
      : null,
  };
};
