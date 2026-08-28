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
 * 조회 응답의 상품 정보 — **읽기 전용**이다(서버 `MentoringResponse`).
 *
 * `editable` 이 잠금의 근거다. 서버는 `status == DRAFT && !hasActiveOpening()` 일 때만
 * 저장을 허용하고 그렇지 않으면 `validateEditable` 로 막는다. 프론트가 같은 조건을
 * 상태·개설 이력에서 다시 계산하면 두 판정이 어긋나는 날이 온다 — 서버가 준 값을 쓴다.
 */
export const templateMentoringSchema = z.object({
  liveMentoringId: z.number().nullable(),
  title: z.string().nullable(),
  status: liveMentoringStatusSchema.nullable(),
  editable: z.boolean(),
  categories: z.array(liveMentoringCategorySchema),
});
export type TemplateMentoring = z.infer<typeof templateMentoringSchema>;

/**
 * GET/PUT /mentor/live-mentoring/template 응답 — 편집 대상 템플릿 + 읽기 전용 상품 정보.
 * 저장 요청은 이보다 좁다(`liveMentoringTemplateUpdateSchema`).
 */
export const liveMentoringDetailPageSchema = liveMentoringTemplateSchema.extend(
  {
    mentoring: templateMentoringSchema,
  },
);
export type LiveMentoringDetailPage = z.infer<
  typeof liveMentoringDetailPageSchema
>;

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
 * PUT /mentor/live-mentoring/settings 요청 바디.
 *
 * 진행시간은 설정 저장과 개설(`liveMentoringOpeningCreateSchema`) 양쪽에서 보낸다.
 * 상품이 없으면 이 요청이 상품을 `DRAFT` 로 생성한다.
 */
export const liveMentoringSettingsUpdateSchema = z.object({
  title: z.string(),
  categories: z.array(liveMentoringCategorySchema),
  durations: z.array(liveMentoringDurationSchema),
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

/**
 * 예약 상태 — 백엔드 `LiveMentoringApplicationStatus`.
 *
 * 멘토 예약 목록(`GET /mentor/live-mentoring/reservations`)은 서버 쿼리가
 * `status.eq(CONFIRMED)` 로 걸러 결제 완료 확정 건만 내린다. 나머지 값은 계약상 존재할
 * 뿐 이 응답에는 오지 않으므로 **프론트에서 다시 거르지 않는다** — 두 곳에서 거르면
 * 규칙이 갈라진다.
 */
export const liveMentoringReservationStatusSchema = z.enum([
  'PAYMENT_PENDING',
  'EXPIRED',
  'CANCELED',
  'CONFIRMED',
]);
export type LiveMentoringReservationStatus = z.infer<
  typeof liveMentoringReservationStatusSchema
>;

/**
 * 멘토가 보는 1대1 라이브 멘토링 예약 1건 — 백엔드
 * `MentorLiveMentoringReservationResponse`.
 *
 * 멘티가 신청 시 낸 질문·전달 파일은 본문이 아니라 **제출 여부만** 내려온다
 * (`questionWritten`·`attachmentSubmitted`). 멘토가 그 내용을 여는 화면은 아직 없다.
 */
export const liveMentoringReservationSchema = z.object({
  applicationId: z.number(),
  menteeId: z.number(),
  menteeName: z.string(),
  /** 멘토 상품명. 멘토당 상품이 하나라 모든 행에서 같은 값이다. */
  productName: z.string(),
  /** 진행시간(분). 30 또는 60. */
  durationMinutes: z.number(),
  /** ISO date-time */
  reservationStartAt: z.string(),
  /** ISO date-time */
  reservationEndAt: z.string(),
  status: liveMentoringReservationStatusSchema,
  /** 멘토에게 미리 전달할 질문을 작성했는지. */
  questionWritten: z.boolean(),
  /** 자소서·이력서 등 전달 파일을 올렸는지. */
  attachmentSubmitted: z.boolean(),
  createDate: z.string(),
});
export type LiveMentoringReservation = z.infer<
  typeof liveMentoringReservationSchema
>;

/** GET /mentor/live-mentoring/reservations 응답. 페이지네이션이 없다. */
export const liveMentoringReservationListSchema = z.object({
  reservationList: z.array(liveMentoringReservationSchema),
});
export type LiveMentoringReservationList = z.infer<
  typeof liveMentoringReservationListSchema
>;

/**
 * 질문 첨부 종류 — 백엔드 `LiveMentoringAttachmentType`.
 * 상수 이름이 곧 직렬화 값이다. 공개 앱
 * (`apps/web/src/api/live-mentoring/liveMentoringSchema.ts`)과 같은 형태를 유지한다.
 */
export const liveMentoringAttachmentTypeSchema = z.enum([
  'NONE',
  'FILE',
  'URL',
]);
export type LiveMentoringAttachmentType = z.infer<
  typeof liveMentoringAttachmentTypeSchema
>;

/**
 * 멘토가 보는 예약 1건의 상세 — 백엔드
 * `GetMentorLiveMentoringReservationDetailResponseDto`
 * (`GET /mentor/live-mentoring/reservations/{applicationId}`).
 *
 * 목록(`liveMentoringReservationSchema`)이 제출 여부만 내리는 것과 달리, 이 응답은
 * 멘티가 낸 질문 본문과 첨부를 담는다. 목록은 캘린더가 주 단위로 계속 호출하므로
 * 본문을 싣지 않는다 — 계약을 나누는 이유는 PRD 4.1 에 있다.
 *
 * **파일 첨부의 이름·주소 필드(`attachmentFileName`·`attachmentFileUrl`)를 두지 않는다.**
 * 업로드 키가 `FileType + 원본 파일명` 이라 파일명 자체가 곧 S3 키고, 그 주소는 서명도
 * 만료도 없는 공개 주소다. 이름을 내리는 것이 주소를 알려주는 것과 같다(PRD 4.2).
 * `attachmentType` 이 `FILE` 이면 화면은 "냈다" 는 사실만 표시한다.
 */
/** 출석 상태 — 라이브 피드백(`FeedbackAttendanceStatus`)과 같은 값이다. */
export const liveMentoringAttendanceStatusSchema = z.enum([
  'PENDING',
  'PRESENT',
  'ABSENT',
]);

export type LiveMentoringAttendanceStatus = z.infer<
  typeof liveMentoringAttendanceStatusSchema
>;

export const liveMentoringReservationDetailSchema = z.object({
  applicationId: z.number(),
  menteeName: z.string(),
  /** 상품명 스냅샷. 상품명이 바뀌어도 신청 시점 이름을 그대로 쓴다. */
  productName: z.string(),
  /** 진행시간(분). 30 또는 60. */
  durationMinutes: z.number(),
  /** ISO date-time */
  reservationStartAt: z.string(),
  /** ISO date-time */
  reservationEndAt: z.string(),
  /**
   * 멘토링 카테고리. **nullable 이다.**
   *
   * 서버 `mentoring_category` 컬럼이 나중에 추가되면서 기존 행이 유효 코드(1~3) 밖인 0 으로
   * 채워졌다. 로컬 기준 26건 중 23건이 0 이고, 그 건들은 서버가 null 로 내린다.
   * 백필 전까지 열어 둔다 — non-nullable 이면 그 건에서 파싱이 통째로 깨져 모달이 아예
   * 안 뜬다. 실 API 로 유효값이 오는 건이 있다는 이유로 되돌리지 않는다.
   */
  mentoringCategory: liveMentoringCategorySchema.nullable(),
  /** 멘티가 신청 시 "나중에 작성하기" 를 골랐는지. */
  questionDeferred: z.boolean(),
  /** 질문 본문. 미작성이면 null. 최대 5000자. */
  questionContent: z.string().nullable(),
  attachmentType: liveMentoringAttachmentTypeSchema,
  /**
   * `attachmentType` 이 `URL` 이고 멘토 전달에 동의했을 때만 값이 온다.
   *
   * **동의하지 않은 건은 서버가 null 로 비운 채 내린다** — 화면에서 가리는 것이 아니다.
   * 값을 내려놓고 감추면 응답 본문에 남아 개발자 도구로 보인다(PRD 4.4).
   * `attachmentType` 은 그대로 오므로 화면은 "냈지만 동의하지 않았다" 를 구분해 안내한다.
   */
  attachmentUrl: z.string().nullable(),
  /** 첨부를 멘토에게 전달하는 데 동의했는지. 질문 본문은 이 동의와 무관하다. */
  mentorShareAgreed: z.boolean(),
  /**
   * 질문 최종 수정 시각. **이번 백엔드 작업에서는 내리지 않기로 했다**(PRD 4.5, 9-2).
   * `Application` 의 `lastModifiedDate` 는 결제 승인·취소로도 움직여 "질문이 바뀌었다" 는
   * 거짓 신호를 준다. 질문 전용 컬럼 추가는 스키마 변경이라 범위를 넘는다.
   * 나중에 붙을 때 계약을 다시 고치지 않도록 nullish 로 열어 둔다 — 없어도 파싱이 통과한다.
   */
  questionUpdatedAt: z.string().nullish(),
  /**
   * 멘토·멘티 출석. 라이브 피드백과 같은 값을 쓴다(`PENDING`/`PRESENT`/`ABSENT`).
   *
   * 서버 컬럼을 나중에 추가했으므로 배포 순서가 어긋나 이 필드가 없는 응답이 올 수
   * 있다. 없으면 화면은 "아직 기록 없음" 으로 다루면 되고 파싱까지 깨질 이유가 없어
   * nullish 로 연다. `mentoringCategory` 에서 이미 겪은 실수다.
   */
  mentorStatus: liveMentoringAttendanceStatusSchema.nullish(),
  menteeStatus: liveMentoringAttendanceStatusSchema.nullish(),
  /**
   * 회의실 주소. 아직 아무도 입장하지 않았으면 null 이다.
   *
   * null 이어도 입장 버튼은 눌린다 — 누르는 순간 서버가 방을 만든다. 둘 다 상대가
   * 먼저 들어오기를 기다리는 데드락을 막기 위한 설계다.
   */
  meetingUrl: z.string().nullish(),
});
export type LiveMentoringReservationDetail = z.infer<
  typeof liveMentoringReservationDetailSchema
>;
