import { z } from 'zod';

/**
 * 1대1 라이브 멘토링 멘토 설정 zod 스키마.
 *
 * 공유 목 데이터(`@letscareer/mocks`)가 서빙하는 MSW 응답을 파싱한다.
 * 공개 앱(`apps/web/src/api/live-mentoring/liveMentoringSchema.ts`)과
 * 겹치는 타입(카테고리·진행시간·이력·체크리스트·템플릿)은 **동일 형태**를 유지한다.
 */

export const liveMentoringCategorySchema = z.enum([
  'PERSONAL_STATEMENT',
  'RESUME',
  'PORTFOLIO',
]);
export type LiveMentoringCategory = z.infer<typeof liveMentoringCategorySchema>;

/** 백엔드 `LiveMentoringDuration` enum(`MINUTES_30(30)`, `MINUTES_60(60)`) 기준 — 50이 아니라 60이다. */
export const liveMentoringDurationSchema = z.union([
  z.literal(30),
  z.literal(60),
]);
export type LiveMentoringDuration = z.infer<typeof liveMentoringDurationSchema>;

/**
 * 상품 상태 — 서버 `LiveMentoringStatus.java`.
 *
 * 편집 가능(`isEditable`)은 `DRAFT`·`REJECTED`, 공개 노출(`isPubliclyVisible`)은 `APPROVED` 뿐이다.
 * 상품을 한 번도 저장하지 않은 멘토에게도 서버가 `DRAFT` 를 채워 주므로 null 로 오지 않는다
 * (`LiveMentoringMapper.toGetLiveMentoringSettingsResponseDto`).
 */
export const liveMentoringStatusSchema = z.enum([
  'DRAFT',
  'PENDING_REVIEW',
  'APPROVED',
  'REJECTED',
  'INACTIVE',
]);
export type LiveMentoringStatus = z.infer<typeof liveMentoringStatusSchema>;

/** 개설 상태 — 서버 `LiveMentoringOpeningStatus.java`. `OPEN → CLOSED` 단방향이다. */
export const liveMentoringOpeningStatusSchema = z.enum(['OPEN', 'CLOSED']);
export type LiveMentoringOpeningStatus = z.infer<
  typeof liveMentoringOpeningStatusSchema
>;

/**
 * 개설 종료 사유 — 서버 `LiveMentoringCloseReason.java`.
 * 멘토가 직접 종료하는 경로는 없다. 기간 만료 자동 종료와 관리자 강제 종료뿐이다.
 */
export const liveMentoringCloseReasonSchema = z.enum([
  'PERIOD_EXPIRED',
  'ADMIN_FORCED',
]);
export type LiveMentoringCloseReason = z.infer<
  typeof liveMentoringCloseReasonSchema
>;

/**
 * 노출 토글이 있는 섹션의 공통 골격 (시안 3·4·5번).
 * `visible === false` 면 공개 상세에서 섹션을 **통째로 제외**한다.
 */
const sectionWithVisible = <T extends z.ZodRawShape>(extra: T) =>
  z.object({
    visible: z.boolean(),
    title: z.string(),
    subtitle: z.string(),
    ...extra,
  });

/** 시안 1 · 멘토 소개 — 프로필 값을 초기값으로 받아 멘토가 덮어쓴다. */
export const templateIntroSchema = z.object({
  /** 헤드라인의 "확실한 전략으로 {n}명을 합격시킨" 구절. null 이면 구절을 뺀다. */
  passedCount: z.number().nullable(),
  profileImage: z.string().nullable(),
  /** "렛츠커리어 | CEO" 형태. */
  affiliation: z.string(),
  /** "(현) …", "(전) …", "- …" 자유 입력 줄 목록. */
  careerLines: z.array(z.string()),
  /** "멘토님의 한마디" 박스 본문. */
  oneLiner: z.string(),
});

/** 시안 2 · 멘토링 유형 카드. */
export const templateMentoringTypeSchema = z.object({
  typeName: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
});

/** 시안 3 · 취업 성공 전략의 Point 1건. */
export const templateStrategyPointSchema = z.object({
  image: z.string().nullable(),
  title: z.string(),
  description: z.string(),
});

/**
 * 개설의 진행시간별 판매가 1건 — 서버 `DurationPriceResponse`.
 * 가격은 서버 고정값이라 멘토가 보내지 않는다(30분 35,000원 / 60분 60,000원).
 */
export const liveMentoringDurationPriceSchema = z.object({
  duration: liveMentoringDurationSchema,
  price: z.number(),
});
export type LiveMentoringDurationPrice = z.infer<
  typeof liveMentoringDurationPriceSchema
>;

/** 시안 5 · 결과 사례(Before/After) 1쌍. */
export const templateResultCaseSchema = z.object({
  beforeImage: z.string().nullable(),
  afterImage: z.string().nullable(),
  beforeCaption: z.string(),
  afterCaption: z.string(),
});

/**
 * 상세 페이지 템플릿 — 시안 10개 섹션 중 **멘토가 편집하는 1~5번**과
 * 편집 불가 고정 섹션으로 나뉜다.
 *
 * 6~10번(플랜·진행 프로세스·후기·다른 멘토·FAQ)은 오픈 설정 값이나 시스템 데이터에서
 * 파생되므로 템플릿에 담지 않는다. 후기는 노출 여부만 여기서 제어한다.
 */
export const liveMentoringTemplateSchema = z.object({
  /**
   * 상품 상태 블록 — 서버 `GetLiveMentoringDetailPageResponseDto.mentoring`.
   * 상세 설정 잠금 판정의 근거다.
   */
  mentoring: z.object({
    liveMentoringId: z.number(),
    title: z.string(),
    status: liveMentoringStatusSchema,
    /** 서버 `LiveMentoring.isEditable()` — 상태가 `DRAFT`·`REJECTED` 이고 활성 개설이 없을 때만 true. */
    editable: z.boolean(),
    category: liveMentoringCategorySchema,
  }),
  /** 활성(`OPEN`) 개설. 개설한 적이 없거나 모두 종료됐으면 null. */
  currentOpening: z
    .object({
      openingId: z.number(),
      status: liveMentoringOpeningStatusSchema,
      durationPrices: z.array(liveMentoringDurationPriceSchema),
      feedbackStartDate: z.string(),
      feedbackEndDate: z.string(),
    })
    .nullable(),

  category: liveMentoringCategorySchema,

  // ── 멘토 편집 영역 (시안 0~5) ────────────────────────────
  /** 시안 0 · 히어로 — 제목 아래 불릿 소개. */
  hero: z.object({ bullets: z.array(z.string()) }),
  intro: templateIntroSchema,
  mentoringTypes: z.object({
    title: z.string(),
    subtitle: z.string(),
    items: z.array(templateMentoringTypeSchema),
  }),
  strategy: sectionWithVisible({
    points: z.array(templateStrategyPointSchema),
  }),
  video: sectionWithVisible({
    /** 임베드할 영상 URL(YouTube 등). 비우면 플레이어 자리를 렌더하지 않는다. */
    videoUrl: z.string().nullable(),
    /** 영상 하단 캡션. */
    caption: z.string(),
  }),
  results: sectionWithVisible({
    cases: z.array(templateResultCaseSchema),
  }),

  // ── 편집 불가 ───────────────────────────────────────────
  /** 시안 8 · 후기는 노출 여부와 노출 대상만 고른다. */
  reviews: z.object({
    visible: z.boolean(),
    selectedReviewIds: z.array(z.number()),
  }),
  /*
   * 시안 7(진행 프로세스)·10(FAQ)은 계약에 없다.
   * 멘토가 편집하지 않고 운영 확정 문구라, 서버를 거치지 않고
   * 웹 상세 페이지(`DetailFixedSections.tsx`)에 하드코딩한다.
   * 멘토 미리보기에도 노출하지 않는다.
   *
   * 서버 응답에는 `faq`·`process`·`reviewItems`(현재 전부 빈 배열)와
   * `intro.nickname`·`intro.careers` 도 딸려오지만 여기에 선언하지 않는다.
   * zod 가 잉여 키를 버리므로 파싱은 통과하고, 화면이 쓰지 않는 값을 타입에 들이지 않는다.
   */
});
export type LiveMentoringTemplate = z.infer<typeof liveMentoringTemplateSchema>;
export type TemplateMentoringType = z.infer<typeof templateMentoringTypeSchema>;
export type TemplateStrategyPoint = z.infer<typeof templateStrategyPointSchema>;
export type TemplateResultCase = z.infer<typeof templateResultCaseSchema>;

/**
 * 오픈 설정 화면에서 보여주는 경력 1건 — 백엔드 `UserCareerVo` 형태를 그대로 따른다.
 * 상세 페이지 템플릿(intro.careerLines)의 자유 텍스트 줄과는 다른 타입:
 * 이 필드들은 프로필(UserCareer) 도메인 소유라 오픈 설정 화면에서는 조회만 되고 수정할 수 없다.
 */
export const liveMentoringSettingsCareerSchema = z.object({
  id: z.number(),
  company: z.string().nullable(),
  field: z.string().nullable(),
  job: z.string().nullable(),
  position: z.string().nullable(),
  department: z.string().nullable(),
  employmentType: z.string().nullable(),
  /** YearMonth 형식, 예: "2020-01" */
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  isAddedByAdmin: z.boolean(),
  /**
   * 대표 경력 여부. 멘토당 최대 1건만 true 이고, 한 번도 지정하지 않았으면 전부 false 다.
   * 이 경력이 공개 리스트 멘토 카드에 노출된다
   * (지정: `PATCH /user-career/my/{careerId}/representative`).
   */
  isRepresentative: z.boolean(),
});
export type LiveMentoringSettingsCareer = z.infer<
  typeof liveMentoringSettingsCareerSchema
>;

/**
 * 상품 설정 — 서버 `GetLiveMentoringSettingsResponseDto`.
 *
 * `상품 1 : 개설 N` 분리 이후 이 응답은 **상품 정보만** 담는다.
 * 개설에 딸린 값(`isOpen`·`durations`·`feedbackStartDate`·`feedbackEndDate`)은 서버가 더 이상 주지 않고,
 * 개설 이력(`openingHistoryResponseSchema`)에서 가져온다.
 *
 * `nickname/profileImage/introduction/careers`는 프로필 도메인에서 참조만 해오는 읽기 전용 필드다 —
 * PUT 요청 바디에는 포함되지 않는다(`liveMentoringSettingsUpdateSchema` 참고).
 */
export const liveMentoringSettingsSchema = z.object({
  /** 상품 식별자. 상품을 한 번도 저장하지 않았으면 null. */
  liveMentoringId: z.number().nullable(),
  nickname: z.string().nullable(),
  profileImage: z.string().nullable(),
  introduction: z.string().nullable(),
  /** 프로필(UserCareer) 도메인 소유. 서버 `UserCareerVo` 11필드 그대로이며 계약 변경이 없다 — 제거 아님. */
  careers: z.array(liveMentoringSettingsCareerSchema),
  /** 1대1 멘토링 타이틀(상품명). 상품을 한 번도 저장하지 않았으면 null. */
  title: z.string().nullable(),
  /** 상품 상태. 상품이 없어도 서버가 `DRAFT` 로 채워 주므로 null 이 아니다. */
  status: liveMentoringStatusSchema,
  /** 상품 타입. 서버가 정확히 1개만 저장하지만 응답은 배열이다. */
  categories: z.array(liveMentoringCategorySchema),
});
export type LiveMentoringSettings = z.infer<typeof liveMentoringSettingsSchema>;

/**
 * PUT /mentor/live-mentoring/settings 요청 바디 — 서버 `UpdateLiveMentoringSettingsRequestDto`.
 * 개설 관련 필드가 빠져 `{title, categories}` 2개뿐이다.
 */
export const liveMentoringSettingsUpdateSchema = z.object({
  title: z.string(),
  /** 서버 `@Size(min = 1, max = 1)` — 정확히 1개여야 하고, 2개를 보내면 400 이다. */
  categories: z.array(liveMentoringCategorySchema),
});
export type LiveMentoringSettingsUpdate = z.infer<
  typeof liveMentoringSettingsUpdateSchema
>;

/** 정산 현황 행 (PRD §4.6, read-only). */
export const settlementRowSchema = z.object({
  period: z.string(),
  completedCount: z.number(),
  grossAmount: z.number(),
  status: z.enum(['PENDING', 'PAID']),
});
export type SettlementRow = z.infer<typeof settlementRowSchema>;

/** 개별 정산 내역 항목 (완료 건별). */
export const settlementItemSchema = z.object({
  settlementId: z.number(),
  date: z.string(),
  menteeName: z.string(),
  category: liveMentoringCategorySchema,
  durationMin: liveMentoringDurationSchema,
  amount: z.number(),
  status: z.enum(['PENDING', 'PAID']),
});
export type SettlementItem = z.infer<typeof settlementItemSchema>;

export const settlementListResponseSchema = z.object({
  settlementList: z.array(settlementRowSchema),
  itemList: z.array(settlementItemSchema),
});
export type SettlementListResponse = z.infer<
  typeof settlementListResponseSchema
>;

/**
 * 개설 이력 1건 — 서버 `GetLiveMentoringOpeningHistoryResponseDto.OpeningHistoryItemResponse`.
 *
 * 타이틀·카테고리는 개설이 아니라 상품 소유라 여기에 없다(`liveMentoringSettingsSchema` 참고).
 * 예약 수도 서버가 더 이상 주지 않는다.
 */
export const openingHistoryItemSchema = z.object({
  openingId: z.number(),
  status: liveMentoringOpeningStatusSchema,
  /** 진행시간별 판매가. 표시 가격은 이 중 최저가다. */
  durationPrices: z.array(liveMentoringDurationPriceSchema),
  feedbackStartDate: z.string(),
  feedbackEndDate: z.string(),
  /** 개설 시각. 서버가 개설 생성 시 항상 채운다. */
  openedAt: z.string(),
  /** 종료 시각. `status === 'OPEN'` 이면 null. */
  closedAt: z.string().nullable(),
  /** 종료 사유. `status === 'OPEN'` 이면 null. */
  closeReason: liveMentoringCloseReasonSchema.nullable(),
});
export type OpeningHistoryItem = z.infer<typeof openingHistoryItemSchema>;

/**
 * 개설 이력 응답 — `GET /mentor/live-mentoring/open-status`,
 * `POST /mentor/live-mentoring/openings` 공통. 정렬은 `openingId` 내림차순이다.
 * 상품이 없으면 `{liveMentoringId: null, openings: []}` 으로 200 이다.
 */
export const openingHistoryResponseSchema = z.object({
  liveMentoringId: z.number().nullable(),
  openings: z.array(openingHistoryItemSchema),
});
export type OpeningHistoryResponse = z.infer<
  typeof openingHistoryResponseSchema
>;

/**
 * POST /mentor/live-mentoring/openings 요청 바디 — 서버 `CreateLiveMentoringOpeningRequestDto`.
 *
 * 가격은 서버 고정값이라 보내지 않는다.
 * 같은 트랜잭션에서 상품의 제목·카테고리도 갱신되므로 개설 직전 별도 `PUT /settings` 는 필요 없다.
 */
export const createOpeningRequestSchema = z.object({
  title: z.string(),
  /** 서버 `@Size(min = 1, max = 1)` — 정확히 1개여야 한다. */
  categories: z.array(liveMentoringCategorySchema),
  /** 서버 `@NotEmpty` — 1개 이상. */
  durations: z.array(liveMentoringDurationSchema),
  feedbackStartDate: z.string(),
  feedbackEndDate: z.string(),
});
export type CreateOpeningRequest = z.infer<typeof createOpeningRequestSchema>;
