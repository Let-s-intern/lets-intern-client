/**
 * 멘토 피드백 모달(라이브 · 서면) 디자인 토큰 — **여기 한 곳에서만** 모양을 관리한다.
 *
 * 사용처: LiveFeedbackReservationModal, FeedbackModal, FeedbackHeader,
 *         FeedbackLayout, MenteeList, MenteeInfo, SidebarGuideLinks, InfoTooltip,
 *         LiveMentoringSubmissionModal(1대1).
 *
 * 1대1 모달은 라이브 피드백 예약 모달과 같은 모양으로 보여야 해서 이 토큰을 함께 쓴다.
 * 다만 그쪽 컴포넌트(FeedbackHeader 등)를 그대로 가져다 쓰지는 않는다 — 멘티 여러 명을
 * 오가는 모달용이라 1대1 에는 채울 수 없는 값을 요구한다.
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
  /** 사이드 패널(제출물 임베드)이 열렸을 때 넓힌 너비 — 임베드+에디터를 함께 넉넉히 표시 */
  modalContainerWide: 'md:w-[1280px]',
  /** 좌(제출물)·우(사전 질문) 패널이 동시에 열렸을 때 — 에디터 폭 확보용 */
  modalContainerWidest: 'md:w-[1560px]',
  /**
   * "크게 보기" 전체화면 — 뷰포트를 꽉 채운다.
   * 기본/넓힘 토큰의 여백·크기·라운드를 모두 덮어야 하므로 무접두사와 `md:` 를 함께 지정한다
   * (twMerge 는 접두사가 다르면 별개 키로 보아 하나만으로는 덮이지 않는다).
   * 이 토큰은 항상 마지막에 합성한다.
   */
  modalContainerFullscreen:
    'mx-0 h-[100dvh] max-h-none w-screen max-w-none rounded-none md:mx-0 md:h-[100dvh] md:w-screen md:rounded-none',

  /** 카드 표면(테두리·라운드·패딩) — 멘티정보 카드 / 예약일시 카드 공통 */
  cardSurface: 'border-neutral-80 rounded-[4px] border p-4',

  /**
   * 참고자료 진입 버튼 — 제출물 보기 / 경험 보기 / 사전 질문 보기 공통.
   * 셋이 같은 줄 높이로 보여야 하므로 모양을 한 곳에서 관리한다.
   * (옆에 두고 보는 `SideViewButton` 과 높이 34px 로 맞춰져 있다.)
   */
  panelEntryButton:
    'inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50',
  /** 위 버튼의 컴팩트(크게 보기) 변형 */
  panelEntryButtonCompact:
    'inline-flex shrink-0 items-center gap-1 rounded border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50',

  /** 구분선 */
  dividerVertical: 'hidden w-px shrink-0 self-stretch bg-gray-200 md:block',
  dividerTop: 'border-neutral-80 border-t',

  /** 헤더 상태 카운트 칩 모양 (색은 statusColors.ts 의 statusBadgeOrMuted) */
  headerChip: 'rounded-[4px] px-2 py-0.5 text-xs font-medium',

  /** 멘티 리스트 상태 뱃지 모양 (색은 statusColors.ts 의 STATUS_BADGE) */
  listBadgeSm: 'rounded-[4px] px-2 py-0.5 text-[10px] font-medium',
  listBadgeMd: 'rounded-[4px] px-2.5 py-0.5 text-[11px] font-medium',

  /** 상태 점(●) — base + 상태별 색 */
  dotBase: 'h-1.5 w-1.5 rounded-full',
  dotOk: 'bg-green-500',
  dotPending: 'bg-primary',
  dotAbsent: 'bg-red-500',
  dotNone: 'bg-neutral-300',

  /** 카드 내 아웃라인 버튼(제출물 보기 · 참여 확인하기) */
  outlineButton:
    'inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[4px] border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50',
  outlineButtonDisabled:
    'inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[4px] border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-300',

  /** 하단 보조 버튼(멘티와 대화하기) */
  footerSecondary:
    'rounded-[4px] border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50',
  footerSecondaryDisabled:
    'rounded-[4px] border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-300',

  /** 하단 주요 버튼(라이브 입장하기) */
  footerPrimary:
    'bg-primary hover:bg-primary-hover rounded-[4px] px-4 py-2 text-sm font-semibold text-white transition-colors',
  footerPrimaryDisabled:
    'rounded-[4px] bg-neutral-200 px-4 py-2 text-sm font-semibold text-white',

  /** 사전 Q&A 본문(가변 높이·내부 스크롤) — 레이아웃은 mt-3 등으로 합성 */
  qnaBody:
    'min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-neutral-700',

  /** 사이드바 가이드 링크 버튼(세로 정렬) */
  guideButton:
    'flex items-center justify-between gap-1 rounded-[4px] border border-gray-300 px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-800',

  /** 필드 라벨(작은 회색 텍스트) */
  fieldLabel: 'text-xs text-neutral-500',

  /** 서면 피드백 에디터 영역 */
  writtenEditorSurface: 'rounded-[4px] border border-gray-200 bg-white p-6',
  writtenEditorEmpty:
    'rounded-[4px] border border-dashed border-neutral-200 bg-neutral-50/50 p-8',
  /** 서면 피드백 하단 액션 버튼 */
  writtenSubmitButton:
    'bg-primary hover:bg-primary-hover whitespace-nowrap rounded-[4px] px-3 py-1.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:px-5 md:py-2',
  writtenSaveButton:
    'border-primary text-primary hover:bg-primary-5 whitespace-nowrap rounded-[4px] border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:px-5 md:py-2',

  /** ⓘ 툴팁 박스(흰 네모 말풍선) — 위치(top/left)는 인라인 style 로 합성 */
  tooltipBox:
    'z-[1000] w-56 -translate-x-1/2 rounded-[4px] border border-neutral-200 bg-white px-3 py-2 text-xs leading-5 text-neutral-700 shadow-lg transition-opacity',
} as const;

export type FeedbackModalDesign = typeof feedbackModalDesign;
