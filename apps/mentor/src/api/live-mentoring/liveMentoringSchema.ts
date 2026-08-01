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
 * 오픈 설정(메타) (PRD §5 S3-a).
 * `nickname/profileImage/introduction/careers`는 프로필 도메인에서 참조만 해오는 읽기 전용 필드다 —
 * PUT 요청 바디에는 포함되지 않는다(`liveMentoringSettingsUpdateSchema` 참고).
 */
export const liveMentoringSettingsSchema = z.object({
  nickname: z.string().nullable(),
  profileImage: z.string().nullable(),
  introduction: z.string().nullable(),
  careers: z.array(liveMentoringSettingsCareerSchema),
  /** 1대1 멘토링 타이틀(상품명). 한 번도 오픈한 적 없으면 null. */
  title: z.string().nullable(),
  /** 현재 오픈 중인지. 오픈 중에는 수정 불가. */
  isOpen: z.boolean(),
  /** 오픈한 타입(다중). */
  categories: z.array(liveMentoringCategorySchema),
  /** 오픈한 진행시간(다중). */
  durations: z.array(liveMentoringDurationSchema),
  /** 피드백 진행 일정(오픈 기간) 시작·종료일. 한 번도 오픈한 적 없으면 null. */
  feedbackStartDate: z.string().nullable(),
  feedbackEndDate: z.string().nullable(),
});
export type LiveMentoringSettings = z.infer<typeof liveMentoringSettingsSchema>;

/** PUT /mentor/live-mentoring/settings 요청 바디 — 백엔드가 실제로 받는 6개 필드뿐. */
export const liveMentoringSettingsUpdateSchema = z.object({
  title: z.string(),
  isOpen: z.boolean(),
  categories: z.array(liveMentoringCategorySchema),
  durations: z.array(liveMentoringDurationSchema),
  feedbackStartDate: z.string(),
  feedbackEndDate: z.string(),
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

/** 오픈 현황 행 (PRD §4.7, read-only). */
export const openStatusRowSchema = z.object({
  title: z.string(),
  categories: z.array(liveMentoringCategorySchema),
  durations: z.array(liveMentoringDurationSchema),
  price: z.number(),
  feedbackStartDate: z.string(),
  feedbackEndDate: z.string(),
  status: z.enum(['OPEN', 'CLOSED']),
  reservationCount: z.number(),
});
export type OpenStatusRow = z.infer<typeof openStatusRowSchema>;

export const openStatusListResponseSchema = z.object({
  openStatusList: z.array(openStatusRowSchema),
});
export type OpenStatusListResponse = z.infer<
  typeof openStatusListResponseSchema
>;
