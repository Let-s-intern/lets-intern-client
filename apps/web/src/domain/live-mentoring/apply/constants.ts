import type { LiveMentoringDuration } from '@/api/live-mentoring/liveMentoringSchema';
import { durationLabel } from '../constants';

/**
 * 플랜 표기.
 *
 * 시안의 "베이직 / [추천] 프리미엄 … 패키지" 는 계약에 없다. 서버가 주는 것은
 * `{ duration, price }` 뿐이라 등급 이름을 만들어 낼 근거가 없다. 상세 히어로의
 * 플랜 카드가 이미 쓰고 있는 표기를 그대로 따른다.
 */
export const planLabel = (duration: LiveMentoringDuration): string =>
  `[LIVE] 1:1 멘토링 (${durationLabel(duration)})`;
