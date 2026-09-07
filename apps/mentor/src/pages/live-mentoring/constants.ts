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
 * 공개 상세 페이지 주소.
 *
 * 오픈 여부와 무관하게 열린다 — 서버 공개 상세 조회는 개설을 검사하지 않는다.
 * 목록 노출만 개설·기간의 영향을 받으므로, 멘토는 오픈 전에도 이 주소로 결과물을
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
 * 아래 3개는 **웹 공개 카드와 픽셀 단위로 같은 미리보기**를 만들기 위한 포맷터다.
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

/**
 * 하단 고정 플로팅 바의 바깥 래퍼.
 *
 * 왼쪽 사이드바(296px)와 오른쪽 미리보기 컬럼(412px + 그리드 간격 24px)을 뺀
 * **편집 영역의 가운데**에 둔다.
 *
 * 화면 전체 기준으로 중앙정렬하면 사이드바 때문에 왼쪽으로 치우쳐 보이고, 오른쪽을
 * 비워 두지 않으면 미리보기 위로 걸쳐 프레임 아래를 덮는다. 두 스텝(오픈 설정·상세
 * 페이지 설정)의 미리보기 컬럼 폭을 같게 맞춰 둬서 값 하나로 둘 다 맞는다.
 *
 * 오픈 설정과 상세 페이지 설정이 같은 규칙을 쓴다 — 두 화면을 오가는 멘토에게 바가
 * 같은 자리에 있어야 한다.
 *
 * `z-40` 은 모달(`BaseModal`·`MentorAlertModal` 은 z-50 이상)보다 한 단 아래다.
 * 예전에는 모달이 뜰 때마다 호출부가 바를 감췄는데, 모달이 늘 때마다 그 플래그를 위로
 * 끌어올려야 했다. 쌓임 순서로 정리하면 호출부가 알 필요가 없다.
 */
export const FLOATING_BAR_WRAP =
  'fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4 md:px-8 lg:left-[296px] lg:right-[436px]';

/**
 * 플로팅 바 본체. 내용 폭에 맞춰 줄어들되 콘텐츠 영역을 넘지 않는다.
 *
 * 스텝 이동 버튼을 좌우로 늘리면서(LC-3282) 상한도 함께 올렸다. 3xl 에서는 버튼 둘이
 * 자리를 다 먹어 옆의 저장 상태 문구가 곧바로 말줄임이 된다.
 */
export const FLOATING_BAR_BODY =
  'shadow-05 flex w-full max-w-4xl items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3';
