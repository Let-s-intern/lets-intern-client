import { ChallengeType } from '@/schema';

/**
 * 챌린지 타입 별 테마 색상
 */

export const DEFAULT_COLOR = '#4A76FF';

export function getChallengeThemeColor(challengeType: ChallengeType): string {
  switch (challengeType) {
    case 'HR':
      return '#FF5E00';
    default:
      return DEFAULT_COLOR;
  }
}
