import type {
  LiveMentoringCategory,
  LiveMentoringDuration,
} from '@/api/live-mentoring/liveMentoringSchema';
import type { LiveMentorSort } from '@/api/live-mentoring/liveMentoring';

/**
 * 카테고리 한글 라벨 매핑.
 * 공유 스키마에는 enum 값만 존재하므로 라벨은 UI 레이어(web 도메인)에서 정의한다.
 * (mentor 앱 `pages/live-mentoring/constants.ts` 와 동일 규칙 — 앱별 중복 허용)
 */
export const CATEGORY_LABELS: Record<LiveMentoringCategory, string> = {
  PERSONAL_STATEMENT: '자기소개서',
  RESUME: '이력서',
  PORTFOLIO: '포트폴리오',
};

/** 카테고리 필터 탭 순서 ('ALL' = 전체). */
export const CATEGORY_FILTERS: {
  value: LiveMentoringCategory | 'ALL';
  label: string;
}[] = [
  { value: 'ALL', label: '전체' },
  { value: 'PERSONAL_STATEMENT', label: CATEGORY_LABELS.PERSONAL_STATEMENT },
  { value: 'RESUME', label: CATEGORY_LABELS.RESUME },
  { value: 'PORTFOLIO', label: CATEGORY_LABELS.PORTFOLIO },
];

/** 정렬 옵션. */
export const SORT_OPTIONS: { value: LiveMentorSort; label: string }[] = [
  { value: 'rating', label: '평점순' },
  { value: 'reviews', label: '후기순' },
  { value: 'latest', label: '최신순' },
];

/** 진행시간 라벨 (예: "30분"). */
export const durationLabel = (durationMin: LiveMentoringDuration): string =>
  `${durationMin}분`;

/** 가격 표시 포맷 (예: "35,000원"). 여러 진행시간이면 최저가가 들어온다. */
export const formatPrice = (price: number): string =>
  `${price.toLocaleString('ko-KR')}원`;

/** 여러 진행시간이면 최저가임을 나타내는 접두("최저 "). */
export const priceLabel = (
  durations: LiveMentoringDuration[],
  price: number,
): string => `${durations.length > 1 ? '최저 ' : ''}${formatPrice(price)}`;

/** 피드백 진행 일정(오픈 기간) 표시 (예: "07.14 ~ 07.28"). */
export const formatFeedbackPeriod = (start: string, end: string): string => {
  const md = (iso: string) => iso.slice(5).replace('-', '.');
  return `${md(start)} ~ ${md(end)}`;
};
