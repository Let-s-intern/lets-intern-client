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
 * 상품 상태 — 백엔드 `LiveMentoringStatus`.
 *
 * 개설 상태(`liveMentoringOpeningStatusSchema`)와 **다른 축**이다. 상품은 승인 여부를,
 * 개설은 지금 열려 있는지를 나타낸다. 화면 문구에서 둘을 섞지 않는다.
 */
export const liveMentoringStatusSchema = z.enum([
  'DRAFT',
  'APPROVED',
  'INACTIVE',
]);
export type LiveMentoringStatus = z.infer<typeof liveMentoringStatusSchema>;

/** 개설 상태 — 백엔드 `LiveMentoringOpeningStatus`. `OPEN` → `CLOSED` 단방향. */
export const liveMentoringOpeningStatusSchema = z.enum(['OPEN', 'CLOSED']);
export type LiveMentoringOpeningStatus = z.infer<
  typeof liveMentoringOpeningStatusSchema
>;

/** 개설 종료 사유 — 백엔드 `LiveMentoringCloseReason`. */
export const liveMentoringCloseReasonSchema = z.enum([
  'PERIOD_EXPIRED',
  'ADMIN_FORCED',
  'MENTOR_CANCELED',
]);
export type LiveMentoringCloseReason = z.infer<
  typeof liveMentoringCloseReasonSchema
>;

/** 진행시간별 확정 가격. 가격은 서버 고정 정책이라 요청에 담지 않고 응답으로만 받는다. */
export const liveMentoringDurationPriceSchema = z.object({
  duration: liveMentoringDurationSchema,
  price: z.number(),
});
export type LiveMentoringDurationPrice = z.infer<
  typeof liveMentoringDurationPriceSchema
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

/**
 * 시안 1 · 멘토 정보 — **읽기 전용**이다.
 *
 * 저장 요청 DTO(`UpdateLiveMentoringDetailPageRequestDto`)에 `intro` 가 없다.
 * 값의 주인은 프로필 도메인(닉네임·사진·경력·한마디)과 서버 집계(합격 인원)라,
 * 이 화면에서 고칠 수 없고 저장 payload(`liveMentoringTemplateUpdateSchema`)에도
 * 넣지 않는다.
 */
export const templateIntroSchema = z.object({
  /** 헤드라인의 "확실한 전략으로 {n}명을 합격시킨" 구절. null 이면 구절을 뺀다. */
  passedCount: z.number().nullable(),
  /** 프로필 닉네임. 서버는 미입력을 빈 문자열로 채워 내려준다. */
  nickname: z.string(),
  profileImage: z.string().nullable(),
  /** "렛츠커리어 | CEO" 형태. 서버가 대표 경력에서 만들어 내려준다. */
  affiliation: z.string(),
  /** "(현) …", "(전) …", "- …" 자유 입력 줄 목록. */
  careerLines: z.array(z.string()),
  /** "멘토님의 한마디" 박스 본문. */
  oneLiner: z.string(),
  /** 프로필의 소속·직책 한 줄. 미입력이면 null. */
  description: z.string().nullable(),
});
export type TemplateIntro = z.infer<typeof templateIntroSchema>;

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
  /** 카테고리 다중 선택 전환으로 단수 `category` 는 사라졌다(호환 필드 없음). */
  categories: z.array(liveMentoringCategorySchema),

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

/**
 * PUT /mentor/live-mentoring/template 요청 바디 — 서버 요청 DTO
 * (`UpdateLiveMentoringDetailPageRequestDto`)와 **같은 6개 키**다.
 *
 * 조회 응답에만 있는 값(`intro`·`categories`·`mentoring` 등)은 여기에 넣지 않는다.
 * 서버가 모르는 키를 무시(`@JsonIgnoreProperties`)하기 때문에 지금까지는 통과했지만,
 * 그 탓에 "편집했는데 저장되지 않는 필드"가 화면에 남아 있었다.
 */
export const liveMentoringTemplateUpdateSchema = z.object({
  hero: liveMentoringTemplateSchema.shape.hero,
  mentoringTypes: liveMentoringTemplateSchema.shape.mentoringTypes,
  strategy: liveMentoringTemplateSchema.shape.strategy,
  video: liveMentoringTemplateSchema.shape.video,
  results: liveMentoringTemplateSchema.shape.results,
  reviews: liveMentoringTemplateSchema.shape.reviews,
});
export type LiveMentoringTemplateUpdate = z.infer<
  typeof liveMentoringTemplateUpdateSchema
>;

/** 조회한 템플릿에서 저장 요청 바디만 뽑아낸다. 읽기 전용 값은 여기서 떨어진다. */
export const toTemplateUpdatePayload = (
  template: LiveMentoringTemplate,
): LiveMentoringTemplateUpdate => ({
  hero: template.hero,
  mentoringTypes: template.mentoringTypes,
  strategy: template.strategy,
  video: template.video,
  results: template.results,
  reviews: template.reviews,
});
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
 * 오픈 설정(메타) — `GET`/`PUT /mentor/live-mentoring/settings` 공통 응답.
 *
 * `nickname/profileImage/introduction/careers`는 프로필 도메인에서 참조만 해오는 읽기 전용 필드다 —
 * PUT 요청 바디에는 포함되지 않는다(`liveMentoringSettingsUpdateSchema` 참고).
 *
 * 상품을 한 번도 만들지 않은 멘토는 `liveMentoringId`·`title`·`status` 가 null 이고
 * 배열은 빈 배열이다. 프로필 필드는 그래도 채워져 온다.
 */
export const liveMentoringSettingsSchema = z.object({
  /** 상품 식별자. 설정을 한 번도 저장한 적 없으면 null. */
  liveMentoringId: z.number().nullable(),
  nickname: z.string().nullable(),
  profileImage: z.string().nullable(),
  introduction: z.string().nullable(),
  careers: z.array(liveMentoringSettingsCareerSchema),
  /** 1대1 멘토링 타이틀(상품명). 상품이 없으면 null. */
  title: z.string().nullable(),
  /**
   * 상품 상태. 잠금 판정의 근거다.
   * 백엔드에 `isOpen` 같은 단일 불리언은 없다 — 개설 여부는 오픈 현황(개설 이력)에서 본다.
   */
  status: liveMentoringStatusSchema.nullable(),
  /** 오픈한 타입(다중). */
  categories: z.array(liveMentoringCategorySchema),
  /** 개설할 때 저장한 진행시간(다중). 한 번도 개설하지 않았으면 빈 배열. */
  durations: z.array(liveMentoringDurationSchema),
});
export type LiveMentoringSettings = z.infer<typeof liveMentoringSettingsSchema>;

/**
 * PUT /mentor/live-mentoring/settings 요청 바디 — 백엔드가 받는 건 이 2개뿐이다.
 *
 * 진행시간은 이 요청이 아니라 개설(`liveMentoringOpeningCreateSchema`)로 보낸다.
 * 상품이 없으면 이 요청이 상품을 `DRAFT` 로 생성한다.
 */
export const liveMentoringSettingsUpdateSchema = z.object({
  title: z.string(),
  categories: z.array(liveMentoringCategorySchema),
});
export type LiveMentoringSettingsUpdate = z.infer<
  typeof liveMentoringSettingsUpdateSchema
>;

/**
 * POST /mentor/live-mentoring/openings 요청 바디 — 최초 개설과 재개설 공통.
 *
 * 검토 제출(`POST /submit`)이 사라지면서 개설 경로가 이 하나로 합쳐졌다.
 * 승인 이후에는 `PUT /settings` 가 잠기기 때문에 제목·타입까지 **한 요청에**
 * 담아 보낸다(서버 `updateSettingsForOpening`). 관리자 승인 없이 바로 열린다.
 *
 * 날짜는 담지 않는다 — 예약 가능 일정은 슬롯(`PUT /slots`)으로 따로 등록한다.
 * 가격은 서버 고정 정책(30분 35,000원 / 60분 60,000원)이라 보내지 않는다.
 */
export const liveMentoringOpeningCreateSchema = z.object({
  title: z.string(),
  categories: z.array(liveMentoringCategorySchema),
  durations: z.array(liveMentoringDurationSchema),
});
export type LiveMentoringOpeningCreate = z.infer<
  typeof liveMentoringOpeningCreateSchema
>;

/**
 * 개설 이력 1건 — `GET /mentor/live-mentoring/open-status` 의 `openings[]`.
 *
 * 상품(제목·타입)이 아니라 **개설** 단위다. 제목·타입은 상품에 하나뿐이라 이 행에 실리지 않는다.
 * 예약 수도 응답에 없다 — 예약·결제 연동 전까지는 표에 넣지 않는다.
 */
export const openingHistoryItemSchema = z.object({
  openingId: z.number(),
  status: liveMentoringOpeningStatusSchema,
  durationPrices: z.array(liveMentoringDurationPriceSchema),
  openedAt: z.string(),
  /** 종료 전이면 null. */
  closedAt: z.string().nullable(),
  closeReason: liveMentoringCloseReasonSchema.nullable(),
});
export type OpeningHistoryItem = z.infer<typeof openingHistoryItemSchema>;

/** 개설 이력 응답. 상품이 없으면 `liveMentoringId: null`, `openings: []`. */
export const openingHistoryResponseSchema = z.object({
  liveMentoringId: z.number().nullable(),
  openings: z.array(openingHistoryItemSchema),
});
export type OpeningHistoryResponse = z.infer<
  typeof openingHistoryResponseSchema
>;
