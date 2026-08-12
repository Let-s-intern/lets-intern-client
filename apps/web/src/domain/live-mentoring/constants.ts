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
 *
 * 지금은 최신순 하나뿐이다. 개설에서 모집 기간이 사라지면서(LC-3206) 서버
 * `LiveMentoringSortType` enum 에서 `FEEDBACK_START_DATE` 가 빠졌다.
 * 평점순·후기순은 목록 응답에 평점/후기 필드가 없어 아직 제공하지 않는다.
 * 선택지가 하나여도 셀렉트는 그대로 둔다 — 정렬이 다시 늘어날 때 되돌릴 일이 없다.
 */
export const SORT_OPTIONS: { value: LiveMentorSort; label: string }[] = [
  { value: 'LATEST', label: '최신순' },
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

/**
 * 상세 히어로의 진행 기간 표시 (예: "2026년 07월 14일(월) ~ 07월 27일(일)").
 * 시안 0 의 "2000년 00월 00일(수) 00시 00분 - 00시 00분" 형식을 따르되,
 * 시각은 계약에 없어 날짜까지만 표기한다.
 */
export const formatDetailPeriod = (
  start: string | null,
  end: string | null,
): string => {
  // 아직 개설한 적 없는 상품(승인 전 미리보기)은 기간이 없다.
  if (!start || !end) return '오픈 준비 중';
  const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
  const label = (iso: string, withYear: boolean) => {
    const date = new Date(`${iso}T00:00:00`);
    const [y, m, d] = iso.split('-');
    const weekday = WEEKDAYS[date.getDay()];
    return `${withYear ? `${y}년 ` : ''}${m}월 ${d}일(${weekday})`;
  };
  return `${label(start, true)} ~ ${label(end, false)}`;
};

/**
 * 리스트 카드 썸네일 좌상단 배지 (예: "네이버 · 서비스 기획").
 *
 * 대표 경력의 **회사명 · 직무**를 표기한다. 연차는 넣지 않는다 —
 * 목록 응답에는 대표 경력 1건만 실려 총 경력을 알 수 없고, 그 1건의 재직 기간을
 * 연차처럼 보여주면 실제와 어긋난다.
 *
 * 대표 경력은 미지정일 수 있고(`null`) 개별 필드도 모두 nullable 이라,
 * 표시할 게 하나도 없으면 빈 문자열을 돌려준다(배지 미렌더).
 */
export const careerBadgeLabel = (career: RepresentativeCareer | null): string =>
  [career?.company, career?.job ?? career?.position]
    .filter((part): part is string => Boolean(part))
    .join(' · ');
