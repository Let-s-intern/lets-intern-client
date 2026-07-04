import { challengeTypeSchema } from '@/schema';

export type ProgressItemType = {
  index: number;
  title: string;
  subTitle?: string;
};

export const description =
  '*더 자세한 내용은 상단 메뉴에서 커리큘럼을 클릭해주세요.';

export const MISSION = {
  title: '미션 수행 방법',
  content: [
    '챌린지 대시보드를 통해 미션수행',
    '매 회차별 챌린지 가이드북 및\n미션 템플릿과 함께 미션 공개',
    '모든 미션은 시간과 장소에 구애받지 않고, 나의 일정에 맞춰 미션 별 마감일까지만 제출하면 완료',
  ],
};

export const {
  CAREER_START,
  PERSONAL_STATEMENT,
  PORTFOLIO,
  PERSONAL_STATEMENT_LARGE_CORP,
  MARKETING,
  EXPERIENCE_SUMMARY,
  ETC,
} = challengeTypeSchema.enum;
