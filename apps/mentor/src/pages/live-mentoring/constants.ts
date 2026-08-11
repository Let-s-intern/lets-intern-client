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
 * "수정"(`POST /start-edit`) 성공 안내 문구.
 *
 * 서버가 하는 일(상품을 초안으로 되돌림)은 두 화면에서 같지만, 그 결과 "지금
 * 이 화면에서 뭘 할 수 있게 됐는지"는 화면마다 다르다 — 오픈 설정에서는 이
 * 화면의 제목·타입·진행시간·기간이 바로 편집 가능해지고, 상세 페이지
 * 설정에서는 좌측 편집 폼이 바로 열린다. 하나의 문구로 합쳐 두면 오픈
 * 설정에서 눌렀을 때 "상세 페이지를 수정할 수 있다"는 엉뚱한 안내가 된다.
 *
 * 확인 모달 없이 버튼 클릭 즉시 실행한다(저장 버튼이 dirty일 때만 활성화되고
 * 이탈 시 경고가 뜨므로 사전 확인이 없어도 실수로 잃을 게 없다). 그래서 "이후에
 * 뭘 해야 하는지"만 이 성공 토스트로 짧게 알린다.
 */
export const START_EDIT_SUCCESS_DETAIL = {
  title: '이제 상세 페이지를 수정할 수 있어요.',
  description: '수정을 마치면 오픈 설정에서 다시 오픈해주세요.',
} as const;

/** "수정"(`POST /start-edit`) 성공 안내 문구 — 오픈 설정 화면용. */
export const START_EDIT_SUCCESS_SETTINGS = {
  title: '이제 설정을 다시 고칠 수 있어요.',
  description: '고친 내용을 저장한 뒤 오픈하기를 누르면 다시 열립니다.',
} as const;

/**
 * 공개 상세 페이지 주소.
 *
 * 승인 여부와 무관하게 열린다 — 서버 공개 상세 조회는 상품 상태를 검사하지 않는다.
 * 목록 노출만 승인·개설·기간의 영향을 받으므로, 멘토는 승인 전에도 이 주소로 결과물을
 * 미리 볼 수 있다.
 */
export const publicDetailUrl = (mentorId: number): string =>
  `${import.meta.env.VITE_WEB_URL ?? ''}/live-mentoring/${mentorId}`;

/**
 * YouTube 링크를 서버가 받는 embed 주소로 정규화한다.
 *
 * 서버(`LiveMentoringUrlPolicy`)는 `https://www.youtube.com/embed/{id}` 형태만 받는다.
 * 호스트가 `youtu.be` 거나 `?si=...` 같은 쿼리가 붙으면 전부 거부하고, 그 결과 상세
 * 페이지 저장 **전체**가 400 으로 실패한다. 멘토는 보통 공유 버튼으로 얻은 링크를
 * 붙여넣으므로, 흔한 형태를 받아 embed 로 바꿔준다.
 *
 * 변환할 수 없으면 null 을 돌려주고 호출부가 저장을 막는다 — 서버까지 보내 400 을
 * 받는 것보다 입력 옆에서 알려주는 편이 낫다.
 */
export const toYoutubeEmbedUrl = (input: string): string | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  let videoId: string | null = null;

  if (host === 'youtu.be') {
    videoId = url.pathname.slice(1);
  } else if (
    host === 'www.youtube.com' ||
    host === 'youtube.com' ||
    host === 'm.youtube.com'
  ) {
    if (url.pathname === '/watch') videoId = url.searchParams.get('v');
    else if (url.pathname.startsWith('/embed/'))
      videoId = url.pathname.slice('/embed/'.length);
    else if (url.pathname.startsWith('/shorts/'))
      videoId = url.pathname.slice('/shorts/'.length);
  }

  // 서버 패턴(`^/embed/[A-Za-z0-9_-]+$`)과 같은 문자 집합만 통과시킨다.
  if (!videoId || !/^[A-Za-z0-9_-]+$/.test(videoId)) return null;
  return `https://www.youtube.com/embed/${videoId}`;
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
