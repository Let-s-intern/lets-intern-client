/**
 * 리뷰 v1 ↔ v2 어댑터 채널 (admin 미러).
 * 전체 동작 설명은 apps/web/src/api/review-adapters.ts 참고.
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
      throw new Error(
        '[review-adapters] VOD_REVIEW 는 v2 programType 미정의. BE 협의 필요.',
      );
  }
};

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
