import { ChallengeType } from '@/schema';

export const THUMBNAIL_IMAGES: Partial<Record<ChallengeType, string>> = {
  PERSONAL_STATEMENT: '/images/thumbnail-personal-statement.png',
  PERSONAL_STATEMENT_LARGE_CORP:
    '/images/thumbnail-personal-statement-large-corp.png',
  EXPERIENCE_SUMMARY: '/images/thumbnail-experience-summary.png',
  DOCUMENT_PREPARATION: '/images/thumbnail-document-preparation.png',
  PORTFOLIO: '/images/thumbnail-portfolio.png',
};

export const BADGE_COLORS: Partial<Record<ChallengeType, string>> = {
  PERSONAL_STATEMENT: '#FF9C34',
  PERSONAL_STATEMENT_LARGE_CORP: '#FF9C34',
  EXPERIENCE_SUMMARY: '#57B3FF',
  DOCUMENT_PREPARATION: '#DB77FF',
  PORTFOLIO: '#4F79FE',
};
