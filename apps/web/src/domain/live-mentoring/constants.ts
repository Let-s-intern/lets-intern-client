import type {
  LiveMentoringCategory,
  LiveMentoringDuration,
  RepresentativeCareer,
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

/**
 * 정렬 옵션 — 백엔드 `sortType` 이 받는 값만 노출한다.
 * 평점순·후기순은 목록 응답에 평점/후기 필드가 없어 아직 제공하지 않는다.
 */
export const SORT_OPTIONS: { value: LiveMentorSort; label: string }[] = [
  { value: 'LATEST', label: '최신순' },
  { value: 'FEEDBACK_START_DATE', label: '진행일정 빠른순' },
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

/**
 * 대표 경력 한 줄 표시 (예: "네이버 · 프로덕트 기획").
 *
 * 대표 경력은 **미지정일 수 있고**(`null`) 개별 필드도 모두 nullable 이라,
 * 표시할 내용이 하나도 없으면 빈 문자열을 돌려준다(호출부에서 렌더를 건너뛴다).
 */
export const representativeCareerLabel = (
  career: RepresentativeCareer | null,
): string => {
  if (!career) return '';
  return [career.company, career.job ?? career.position]
    .filter((part): part is string => Boolean(part))
    .join(' · ');
};

/**
 * 대표 경력 재직 기간 표시 (예: "2020.01 ~ 재직중").
 * `YearMonth` 문자열("2020-01")을 점 표기로 바꾸고, 종료일이 없으면 재직 중으로 본다.
 * 시작일이 없으면 빈 문자열(기간 미표시).
 */
export const formatCareerPeriod = (
  startDate: string | null,
  endDate: string | null,
): string => {
  if (!startDate) return '';
  const ym = (yearMonth: string) => yearMonth.replace('-', '.');
  return `${ym(startDate)} ~ ${endDate ? ym(endDate) : '재직중'}`;
};
