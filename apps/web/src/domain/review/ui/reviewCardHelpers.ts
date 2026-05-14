import { ReportType } from '@/api/report';
import { GetReview, QuestionType, ReviewType } from '@/api/review/review';
import { ProgramTypeUpperCase } from '@/schema';

export function reviewTypeToProgramType(
  reviewType: ReviewType,
): ProgramTypeUpperCase {
  switch (reviewType) {
    case 'CHALLENGE_REVIEW':
    case 'MISSION_REVIEW':
      return 'CHALLENGE';
    case 'LIVE_REVIEW':
      return 'LIVE';
    case 'VOD_REVIEW':
      return 'VOD';
    case 'REPORT_REVIEW':
      return 'REPORT';
  }
}

export const getTitle = (review: GetReview) => {
  switch (review.reviewInfo.type) {
    case 'CHALLENGE_REVIEW':
    case 'LIVE_REVIEW':
    case 'VOD_REVIEW':
      return review.reviewInfo.programTitle;
    case 'REPORT_REVIEW':
      // TODO: 서류 진단 제목이 이 필드가 맞는지 체크 필요.
      return review.reviewInfo.programTitle;
    case 'MISSION_REVIEW':
      return review.reviewInfo.missionTitle;
  }
};

export const questionPriority = (questionType: QuestionType | null) => {
  switch (questionType) {
    case 'GOAL':
      return 1;
    case 'GOAL_RESULT':
      return 2;
    case 'WORRY':
      return 3;
    case 'WORRY_RESULT':
      return 4;
    case 'GOOD_POINT':
      return 5;
    case 'BAD_POINT':
      return 6;
    default:
      return 7;
  }
};

export const getThumbnail = (
  reportType: ReportType | null,
  programThumbnail: string | null,
) => {
  switch (reportType) {
    case 'RESUME':
      return '/images/report/thumbnail_resume.png';
    case 'PERSONAL_STATEMENT':
      return '/images/report/thumbnail_personal.png';
    case 'PORTFOLIO':
      return '/images/report/thumbnail_portfolio.png';
    default:
      return programThumbnail ?? '';
  }
};
