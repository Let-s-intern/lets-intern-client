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

/** 필터 사이드바에 노출할 카테고리 순서. */
export const CATEGORY_FILTER_ORDER: LiveMentoringCategory[] = [
  'PERSONAL_STATEMENT',
  'RESUME',
  'PORTFOLIO',
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

/** 리스트 카드 하단 바의 진행시간 표기 (예: "30분 / 60분"). */
export const durationsLabel = (durations: LiveMentoringDuration[]): string =>
  durations.map(durationLabel).join(' / ');

/** 가격 표시 포맷 (예: "35,000원"). 여러 진행시간이면 최저가가 들어온다. */
export const formatPrice = (price: number): string =>
  `${price.toLocaleString('ko-KR')}원`;

/** 여러 진행시간이면 최저가임을 나타내는 접두("최저 "). */
export const priceLabel = (
  durations: LiveMentoringDuration[],
  price: number,
): string => `${durations.length > 1 ? '최저 ' : ''}${formatPrice(price)}`;

/**
 * 리스트 카드 하단 바의 가격 표기 (예: "30,000원~").
 * 여러 진행시간을 열었으면 최저가라는 뜻으로 물결(`~`)을 붙인다.
 */
export const cardPriceLabel = (
  durations: LiveMentoringDuration[],
  price: number,
): string => `${formatPrice(price)}${durations.length > 1 ? '~' : ''}`;

/** 피드백 진행 일정(오픈 기간) 표시 (예: "07.14 ~ 07.28"). */
export const formatFeedbackPeriod = (start: string, end: string): string => {
  const md = (iso: string) => iso.slice(5).replace('-', '.');
  return `${md(start)} ~ ${md(end)}`;
};

/** 리스트 카드의 진행기간 표시 (예: "25.02.15 ~ 25.02.28"). */
export const formatOpeningPeriod = (start: string, end: string): string => {
  const yymmdd = (iso: string) => iso.slice(2).split('-').join('.');
  return `${yymmdd(start)} ~ ${yymmdd(end)}`;
};

/**
 * `YearMonth` 문자열("2020-01") 기준 재직 연차(내림).
 * 종료일이 없으면 재직 중으로 보고 `now` 까지로 계산한다.
 */
const careerYears = (
  startDate: string,
  endDate: string | null,
  now: Date,
): number => {
  const toMonths = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-').map(Number);
    return year * 12 + month;
  };
  const endMonths = endDate
    ? toMonths(endDate)
    : now.getFullYear() * 12 + (now.getMonth() + 1);
  return Math.max(0, Math.floor((endMonths - toMonths(startDate)) / 12));
};

/**
 * 리스트 카드 썸네일 좌상단 배지 (예: "PM 5년+").
 *
 * 대표 경력의 **직무 + 재직 연차**로 조합한다. 대표 경력은 미지정일 수 있고(`null`)
 * 개별 필드도 모두 nullable 이라, 직무가 없으면 빈 문자열을 돌려준다(배지 미렌더).
 * 1년 미만이면 연차를 빼고 직무만 표기한다.
 *
 * 연차는 **대표 경력 1건 기준**이다 — 총 경력 합산 값이 목록 응답에 없다.
 */
export const careerBadgeLabel = (
  career: RepresentativeCareer | null,
  now: Date = new Date(),
): string => {
  const job = career?.job ?? career?.position;
  if (!job) return '';
  if (!career?.startDate) return job;
  const years = careerYears(career.startDate, career.endDate, now);
  return years >= 1 ? `${job} ${years}년+` : job;
};
