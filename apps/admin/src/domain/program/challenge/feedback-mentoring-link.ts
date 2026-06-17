import { type ChallengeType, challengeTypeSchema } from '@/schema';

/**
 * ChallengeType → 피드백 멘토링 페이지 challengeKey 매핑.
 * 피드백 멘토링이 존재하는 챌린지만 포함.
 *
 * NOTE: challenge-feedback 도메인의 ChallengeKey 타입을 직접 import하지 않음 (도메인 간 참조 금지).
 * 문자열 리터럴로 직접 정의.
 */
const FEEDBACK_MENTORING_CHALLENGE_MAP: Partial<Record<ChallengeType, string>> =
  {
    [challengeTypeSchema.enum.EXPERIENCE_SUMMARY]: 'experience',
    [challengeTypeSchema.enum.CAREER_START]: 'resume',
    [challengeTypeSchema.enum.PERSONAL_STATEMENT]: 'personal-statement',
    [challengeTypeSchema.enum.PORTFOLIO]: 'portfolio',
    [challengeTypeSchema.enum.PERSONAL_STATEMENT_LARGE_CORP]: 'large-corp',
    [challengeTypeSchema.enum.MARKETING]: 'marketing',
    [challengeTypeSchema.enum.HR]: 'hr',
  } as const;

/**
 * 챌린지 타입에 해당하는 피드백 멘토링 페이지 URL을 반환한다.
 * 매핑에 없는 타입이면 null을 반환한다.
 */
export function getFeedbackMentoringUrl(
  challengeType: ChallengeType,
): string | null {
  const key = FEEDBACK_MENTORING_CHALLENGE_MAP[challengeType];
  if (!key) return null;
  return `/challenge/feedback-mentoring?challenge=${key}`;
}

/**
 * 해당 챌린지 타입에 피드백 멘토링이 존재하는지 여부를 반환한다.
 */
export function hasFeedbackMentoring(challengeType: ChallengeType): boolean {
  return challengeType in FEEDBACK_MENTORING_CHALLENGE_MAP;
}
