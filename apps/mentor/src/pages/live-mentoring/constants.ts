import type {
  LiveMentoringCategory,
  LiveMentoringDuration,
} from '@/api/live-mentoring/liveMentoringSchema';

/**
 * 선택지·가격 상수.
 *
 * 목 패키지(`@letscareer/mocks`)에도 같은 값이 있지만 그쪽은 **목 데이터 생성용**이다.
 * 실행 코드가 목 패키지를 참조하면 목을 끄는 순간 화면이 따라 사라지므로 여기에 둔다.
 * 서버 `LiveMentoringCategory`·`LiveMentoringDuration` enum 과 같은 값이어야 한다.
 */
export const LIVE_MENTORING_CATEGORIES: readonly LiveMentoringCategory[] = [
  'PERSONAL_STATEMENT',
  'RESUME',
  'PORTFOLIO',
] as const;

export const LIVE_MENTORING_DURATIONS: readonly LiveMentoringDuration[] = [
  30, 60,
] as const;

/** 진행시간 → 서버 고정가(원). 멘토가 입력하지 않고 개설 요청에도 싣지 않는다. */
const PRICE_BY_DURATION: Record<LiveMentoringDuration, number> = {
  30: 35000,
  60: 60000,
};

/**
 * 여러 진행시간을 고르면 공개 카드에 **최저가**를 노출한다. 빈 배열이면 0.
 * 최솟값 하나만 필요하므로 정렬 없이 한 번만 순회한다.
 */
export const getLowestPrice = (
  durations: readonly LiveMentoringDuration[],
): number => {
  let lowest: number | null = null;
  for (const duration of durations) {
    const price = PRICE_BY_DURATION[duration];
    if (lowest === null || price < lowest) lowest = price;
  }
  return lowest ?? 0;
};

/**
 * 카테고리 enum → 한글 라벨 (UI 레이어 정의).
 * 스키마/공유 목에는 enum 값만 존재하므로 표시 라벨은 여기서 관리한다.
 * 자기소개서=PERSONAL_STATEMENT / 이력서=RESUME / 포트폴리오=PORTFOLIO.
 */
export const CATEGORY_LABELS: Record<LiveMentoringCategory, string> = {
  PERSONAL_STATEMENT: '자기소개서',
  RESUME: '이력서',
  PORTFOLIO: '포트폴리오',
};

/** 진행시간(분) 표시 라벨. */
export const durationLabel = (durationMin: number): string =>
  `${durationMin}분`;

/** 가격 표시(원). 예: 35000 → "35,000원" */
export const formatPrice = (price: number): string =>
  `${price.toLocaleString('ko-KR')}원`;

/*
 * 아래 4개는 **웹 공개 카드와 픽셀 단위로 같은 미리보기**를 만들기 위한 포맷터다.
 * 원본: apps/web/src/domain/live-mentoring/constants.ts
 * 앱 간 코드를 공유하지 않는 규칙 때문에 의도적으로 복제했다 —
 * 웹 카드 표기 규칙이 바뀌면 여기도 같이 고쳐야 미리보기가 거짓말을 하지 않는다.
 */

/** 카드 하단 바의 진행시간 표기 (예: "30분 / 60분"). */
export const durationsLabel = (durations: number[]): string =>
  durations.map(durationLabel).join(' / ');

/** 카드 하단 바의 가격 표기 (예: "30,000원~"). 여러 진행시간이면 최저가라 물결을 붙인다. */
export const cardPriceLabel = (durations: number[], price: number): string =>
  `${formatPrice(price)}${durations.length > 1 ? '~' : ''}`;

/** 카드 진행기간 표시 (예: "25.02.15 ~ 25.02.28"). 값이 없으면 "미정". */
export const formatOpeningPeriod = (
  start: string | null,
  end: string | null,
): string => {
  const yymmdd = (iso: string | null) =>
    iso ? iso.slice(2).split('-').join('.') : '미정';
  return `${yymmdd(start)} ~ ${yymmdd(end)}`;
};

/**
 * 카드 썸네일 좌상단 배지 — 대표 경력의 **회사명 · 직무**.
 * 웹 공개 카드(`apps/web/.../constants.ts` careerBadgeLabel)와 동일 규칙이어야
 * 미리보기가 실제 노출과 일치한다. 연차는 양쪽 모두 표기하지 않는다.
 */
export const careerBadgeLabel = (
  career: {
    company: string | null;
    job: string | null;
    position: string | null;
  } | null,
): string =>
  [career?.company, career?.job ?? career?.position]
    .filter((part): part is string => Boolean(part))
    .join(' · ');

/** 프로필 이미지가 없을 때 썸네일에 대신 넣는 문구. */
export const imagePlaceholderTitle = (nickname: string): string =>
  `${nickname} 멘토님의 멘토링`;

/**
 * 대표 경력 한 줄 표시 (예: "네이버 · 프로덕트 기획").
 *
 * 웹 공개 카드(`apps/web/src/domain/live-mentoring/constants.ts`
 * `representativeCareerLabel`)와 **동일한 규칙**이어야 미리보기가 실제 노출과 일치한다.
 * 회사·직무가 모두 비면 빈 문자열을 돌려준다(호출부에서 렌더를 건너뛴다).
 */
export const representativeCareerLabel = (career: {
  company: string | null;
  job: string | null;
  position: string | null;
}): string =>
  [career.company, career.job ?? career.position]
    .filter((part): part is string => Boolean(part))
    .join(' · ');

/**
 * 경력 기간 표시. YearMonth("2020-01") → "2020.01".
 * endDate가 없으면(재직 중) "재직중"으로 표시한다.
 */
export const formatCareerPeriod = (
  startDate: string | null,
  endDate: string | null,
): string => {
  if (!startDate) return '';
  const fmt = (yearMonth: string) => yearMonth.replace('-', '.');
  return `${fmt(startDate)} ~ ${endDate ? fmt(endDate) : '재직중'}`;
};
