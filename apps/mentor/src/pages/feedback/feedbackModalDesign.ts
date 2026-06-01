/**
 * 멘토 피드백 모달(라이브 · 서면) 디자인 토큰 — **여기 한 곳에서만** 모양을 관리한다.
 *
 * 사용처: LiveFeedbackReservationModal, FeedbackModal, FeedbackHeader,
 *         FeedbackLayout, MenteeList, MenteeInfo, SidebarGuideLinks, InfoTooltip.
 *
 * 규칙:
 * - 라운드 / 색 / 테두리 / 패딩 / 폰트 같은 "모양"은 전부 이 파일에서 고친다.
 * - 레이아웃(flex, grid, w/h, gap 등)은 각 컴포넌트에서 `twMerge(token, '레이아웃...')` 로 합성한다.
 * - 상태별 "색"(완료/진행중/대기 등)은 `@/constants/statusColors` 의 STATUS_BADGE 를 따른다.
 *
 * 라운드 스케일 참고: rounded(4) < rounded-md(6) < rounded-lg(8) < rounded-xl(12) < rounded-full(원형)
 */
export const feedbackModalDesign = {
  /** 모달 컨테이너 — 가로 w-[..] · 세로 md:h-[..] · 라운드 */
  modalContainer:
    'mx-2 h-[85vh] w-[1040px] max-w-full overflow-hidden rounded-2xl md:mx-4 md:h-[720px] md:rounded-3xl',

  /** 카드 표면(테두리·라운드·패딩) — 멘티정보 카드 / 예약일시 카드 공통 */
  cardSurface: 'border-neutral-80 rounded-lg border p-4',

  /** 구분선 */
  dividerVertical: 'hidden w-px shrink-0 self-stretch bg-gray-200 md:block',
  dividerTop: 'border-neutral-80 border-t',

  /** 헤더 상태 카운트 칩 모양 (색은 statusColors.ts 의 statusBadgeOrMuted) */
  headerChip: 'rounded px-2 py-0.5 text-xs font-medium',

  /** 멘티 리스트 상태 뱃지 모양 (색은 statusColors.ts 의 STATUS_BADGE) */
  listBadgeSm: 'rounded px-2 py-0.5 text-[10px] font-medium',
  listBadgeMd: 'rounded px-2.5 py-0.5 text-[11px] font-medium',

  /** 상태 점(●) — base + 상태별 색 */
  dotBase: 'h-1.5 w-1.5 rounded-full',
  dotOk: 'bg-green-500',
  dotPending: 'bg-primary',
  dotAbsent: 'bg-red-500',
  dotNone: 'bg-neutral-300',

  /** 카드 내 아웃라인 버튼(제출물 보기 · 참여 확인하기) */
  outlineButton:
    'inline-flex w-fit items-center gap-1.5 rounded border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50',
  outlineButtonDisabled:
    'inline-flex w-fit items-center gap-1.5 rounded border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-300',

  /** 하단 보조 버튼(멘티와 대화하기) */
  footerSecondary:
    'rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50',
  footerSecondaryDisabled:
    'rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-300',

  /** 하단 주요 버튼(라이브 입장하기) */
  footerPrimary:
    'bg-primary hover:bg-primary-hover rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors',
  footerPrimaryDisabled:
    'rounded-md bg-neutral-200 px-4 py-2 text-sm font-semibold text-white',

  /** 사전 Q&A 본문(가변 높이·내부 스크롤) — 레이아웃은 mt-3 등으로 합성 */
  qnaBody:
    'min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-neutral-700',

  /** 사이드바 가이드 링크 버튼(세로 정렬) */
  guideButton:
    'flex items-center justify-between gap-1 rounded-md border border-gray-300 px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-800',

  /** 필드 라벨(작은 회색 텍스트) */
  fieldLabel: 'text-xs text-neutral-500',

  /** ⓘ 툴팁 박스(흰 네모 말풍선) — 위치(top/left)는 인라인 style 로 합성 */
  tooltipBox:
    'z-[1000] w-56 -translate-x-1/2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs leading-5 text-neutral-700 shadow-lg transition-opacity',
} as const;

export type FeedbackModalDesign = typeof feedbackModalDesign;
