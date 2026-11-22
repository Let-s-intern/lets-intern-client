import { ChallengeType } from '@/schema';

/**
 * 챌린지 상세의 '템플릿으로 혼자' 가 보여 줄 가이드북 (LC-3631).
 * 서버에 챌린지와 가이드북을 잇는 데이터가 없어 프론트 상수로 둔다.
 * 운영 가이드북 id 기준이다. 여기에 없는 챌린지 타입은 진행 방식 선택을 보이지 않는다.
 */
const TEMPLATE_GUIDEBOOK_ID: Partial<Record<ChallengeType, number>> = {
  CAREER_START: 6, // 이력서 완성 가이드북
  PERSONAL_STATEMENT: 5, // 자기소개서 완성 가이드북
  PORTFOLIO: 2, // 포트폴리오 완성 가이드북
  EXPERIENCE_SUMMARY: 7, // 경험정리 완성 가이드북
  PERSONAL_STATEMENT_LARGE_CORP: 15, // 대기업 자기소개서 완성 가이드북
};

export const getTemplateGuidebookId = (challengeType: ChallengeType) =>
  TEMPLATE_GUIDEBOOK_ID[challengeType] ?? null;
