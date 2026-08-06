import type { LiveMentoringCategory } from '@/api/live-mentoring/liveMentoringSchema';

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

/**
 * 상세 수정 시작(`POST /start-edit`) 안내 문구.
 *
 * 오픈 설정과 상세 페이지 설정 두 화면에서 같은 행동을 제공하므로 문구를 한곳에 둔다.
 * 화면마다 따로 적으면 한쪽만 고쳐져 같은 버튼이 다른 말을 하게 된다.
 *
 * "초안"(서버 `DRAFT`) 같은 상태 이름을 쓰지 않는다 — 멘토에게 필요한 건 상태명이 아니라
 * "검토를 다시 받아야 하고 그동안 오픈이 멈춘다"는 결과다.
 */
export const START_EDIT_CONFIRM = {
  title: '상세 페이지를 수정할까요?',
  description:
    '수정하려면 관리자 검토를 다시 받아야 해요. 검토가 끝날 때까지는 오픈할 수 없습니다. 진행시간·기간·타입만 바꾸는 거라면 오픈 설정에서 고치고 바로 다시 오픈하면 돼요.',
  confirmText: '검토 다시 받기',
  cancelText: '그만두기',
} as const;

export const START_EDIT_SUCCESS = {
  title: '이제 상세 페이지를 수정할 수 있어요.',
  description: '수정을 마치면 검토를 제출해주세요. 승인되면 다시 오픈됩니다.',
} as const;

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
