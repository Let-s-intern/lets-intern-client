import { CurrentChallenge } from '@/context/CurrentChallengeProvider';

// 챌린지별 리워드 금액
export const getRewardAmount = (
  currentChallenge: CurrentChallenge | null | undefined,
) => {
  const challengeType = currentChallenge?.challengeType || '';
  if (
    challengeType === 'EXPERIENCE_SUMMARY' ||
    challengeType === 'CAREER_START'
  ) {
    return '3,000원';
  } else if (
    challengeType === 'PERSONAL_STATEMENT' ||
    challengeType === 'MARKETING' ||
    challengeType === 'PORTFOLIO'
  ) {
    return '5,000원';
  }
  return '현금 리워드';
};
