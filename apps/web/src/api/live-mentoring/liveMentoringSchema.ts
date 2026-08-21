import { z } from 'zod';

/**
 * 1대1 라이브 멘토링 공개 페이지 zod 스키마.
 *
 * **개설 목록**(`liveMentoringOpening*`)은 실제 백엔드 `GET /live-mentoring` 응답을 파싱한다.
 * **멘토 상세**(`liveMentorDetail*`)는 아직 백엔드 엔드포인트가 없어
 * 공유 목 데이터(`@letscareer/mocks`)가 서빙하는 MSW 응답을 파싱한다.
 *
 * mentor 앱(`apps/mentor/src/api/live-mentoring/liveMentoringSchema.ts`)과
 * 겹치는 타입(카테고리·진행시간·이력·체크리스트·템플릿)은 **동일 형태**를 유지한다.
 */

export const liveMentoringCategorySchema = z.enum([
  'PERSONAL_STATEMENT',
  'RESUME',
  'PORTFOLIO',
]);
export type LiveMentoringCategory = z.infer<typeof liveMentoringCategorySchema>;

/**
 * 진행시간(분).
 * 백엔드 `LiveMentoringDuration` enum(`MINUTES_30(30)`, `MINUTES_60(60)`) 기준 — 50이 아니라 60이다.
 * (mentor 앱 `liveMentoringSchema.ts` 및 공유 목 `@letscareer/mocks` 와 동일 값)
 */
export const liveMentoringDurationSchema = z.union([
  z.literal(30),
  z.literal(60),
]);
export type LiveMentoringDuration = z.infer<typeof liveMentoringDurationSchema>;

/**
 * 개설 목록에 실리는 멘토 대표 경력 — 백엔드 `RepresentativeCareerResponseDto`.
 *
 * 공용 `UserCareerVo` 계열이라 개별 필드가 모두 nullable 이고,
 * `startDate`/`endDate` 는 `YearMonth` 직렬화 결과(예: `"2020-01"`)다.
 * 대표 경력을 한 번도 지정하지 않은 멘토는 이 객체 자체가 null 로 온다.
 */
export const representativeCareerSchema = z.object({
  id: z.number(),
  company: z.string().nullable(),
  field: z.string().nullable(),
  job: z.string().nullable(),
  position: z.string().nullable(),
  department: z.string().nullable(),
  /** YearMonth 형식, 예: "2020-01" */
  startDate: z.string().nullable(),
  /** 재직 중이면 null. */
  endDate: z.string().nullable(),
});
export type RepresentativeCareer = z.infer<typeof representativeCareerSchema>;

/**
 * 라이브 멘토링 개설 1건 — 백엔드 `LiveMentoringOpeningResponseDto`.
 * (GET /live-mentoring 의 `openingList` 원소)
 *
 * 리스트 카드는 "멘토"가 아니라 "개설(opening)" 단위다: `openingId`가 개설 식별자,
 * `liveMentoringId`는 그 개설이 속한 상품, `mentorId`는 상품을 가진 멘토다.
 * (예전 단일 `id` 는 서버에서 `liveMentoringId`/`openingId` 로 분리됐다.)
 */
export const liveMentoringOpeningSchema = z.object({
  /** 상품 식별자. 공개 상세(`GET /live-mentoring/{liveMentoringId}`)의 키다. */
  liveMentoringId: z.number(),
  /** 개설 식별자. 같은 상품이 여러 번 열리면 매번 새 값이다. */
  openingId: z.number(),
  mentorId: z.number(),
  mentorNickname: z.string().nullable(),
  mentorProfileImage: z.string().nullable(),
  mentorIntroduction: z.string().nullable(),
  /** 대표 경력 미지정 멘토는 null. */
  representativeCareer: representativeCareerSchema.nullable(),
  /** 1대1 멘토링 타이틀(상품명). */
  title: z.string().nullable(),
  /** 멘토가 오픈한 타입(다중). */
  categories: z.array(liveMentoringCategorySchema),
  /** 멘토가 오픈한 진행시간(다중). */
  durations: z.array(liveMentoringDurationSchema),
  /** 여러 진행시간을 열었을 때의 최저가. */
  minimumPrice: z.number(),
});
export type LiveMentoringOpening = z.infer<typeof liveMentoringOpeningSchema>;

/**
 * 개설 목록 응답 — 백엔드 `GetLiveMentoringOpeningsResponseDto`.
 * `pageInfo.pageNum` 은 1-based(서버 `one-indexed-parameters: true`).
 */
export const liveMentoringOpeningListSchema = z.object({
  openingList: z.array(liveMentoringOpeningSchema),
  pageInfo: z.object({
    pageNum: z.number(),
    pageSize: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
  }),
});
export type LiveMentoringOpeningList = z.infer<
  typeof liveMentoringOpeningListSchema
>;

/** 멘토 이력 1건 (노출 선택 가능) */
export const liveMentoringCareerSchema = z.object({
  company: z.string(),
  position: z.string(),
  period: z.string(),
  visible: z.boolean(),
});
export type LiveMentoringCareer = z.infer<typeof liveMentoringCareerSchema>;

/** 후기 (PRD §4.5) */
export const liveMentoringReviewSchema = z.object({
  reviewId: z.number(),
  menteeName: z.string(),
  score: z.number(),
  content: z.string(),
  createdAt: z.string(),
});
export type LiveMentoringReview = z.infer<typeof liveMentoringReviewSchema>;

/**
 * 노출 토글이 있는 섹션의 공통 골격 (시안 3·4·5).
 * `visible === false` 면 상세 페이지에서 섹션을 **통째로 제외**한다.
 */
const sectionWithVisible = <T extends z.ZodRawShape>(extra: T) =>
  z.object({
    visible: z.boolean(),
    title: z.string(),
    subtitle: z.string(),
    ...extra,
  });

/**
 * 상세 페이지 템플릿 — 멘토가 상세 페이지 설정에서 편집한 시안 1~5번 섹션 + 고정 섹션.
 * mentor 앱(`apps/mentor/src/api/live-mentoring/liveMentoringSchema.ts`)과 **동일 형태**여야
 * 같은 목/응답을 양쪽에서 파싱할 수 있다.
 */
export const liveMentoringTemplateSchema = z.object({
  /** 카테고리 다중 선택 전환으로 단수 `category` 는 사라졌다(호환 필드 없음). */
  categories: z.array(liveMentoringCategorySchema),

  /** 시안 0 · 히어로 — 제목 아래 불릿 소개. */
  hero: z.object({ bullets: z.array(z.string()) }),

  /** 시안 1 · 멘토 소개 */
  intro: z.object({
    passedCount: z.number().nullable(),
    profileImage: z.string().nullable(),
    affiliation: z.string(),
    careerLines: z.array(z.string()),
    oneLiner: z.string(),
  }),
  /** 시안 2 · 멘토링 유형 */
  mentoringTypes: z.object({
    title: z.string(),
    subtitle: z.string(),
    items: z.array(
      z.object({
        /**
         * `LiveMentoringTypeCard` 의 id.
         *
         * 신청 생성 DTO 가 `mentoringTypeIds`(`List<Long>`, `@NotEmpty`)를 요구하고
         * 서버가 이 id 로 카드를 대조한다. 상세 응답에 없던 것을 서버 Push 0 이
         * 추가했다 — 없으면 프론트가 신청 자체를 만들 수 없다.
         */
        id: z.number(),
        typeName: z.string(),
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
      }),
    ),
  }),
  /** 시안 3 · 취업 성공 전략 */
  strategy: sectionWithVisible({
    points: z.array(
      z.object({
        image: z.string().nullable(),
        title: z.string(),
        description: z.string(),
      }),
    ),
  }),
  /** 시안 4 · 이렇게 도와드려요(영상) */
  video: sectionWithVisible({
    videoUrl: z.string().nullable(),
    caption: z.string(),
  }),
  /** 시안 5 · 결과 사례(Before/After) */
  results: sectionWithVisible({
    cases: z.array(
      z.object({
        beforeImage: z.string().nullable(),
        afterImage: z.string().nullable(),
        beforeCaption: z.string(),
        afterCaption: z.string(),
      }),
    ),
  }),

  // ── 편집 불가 ───────────────────────────────────────────
  reviews: z.object({
    visible: z.boolean(),
    selectedReviewIds: z.array(z.number()),
  }),
  /*
   * 시안 7(진행 프로세스)·10(FAQ)은 계약에 없다.
   * 멘토가 편집하지 않고 운영 확정 문구라, 서버를 거치지 않고
   * `detail/DetailFixedSections.tsx` 에 하드코딩한다.
   */
});
export type LiveMentoringTemplate = z.infer<typeof liveMentoringTemplateSchema>;

/** 상세 페이지 프로필 블록 (PRD §4.3) */
export const liveMentorProfileSchema = z.object({
  visible: z.boolean(),
  mosaicEnabled: z.boolean(),
  mosaicBlur: z.number(),
  /**
   * 닉네임·한줄소개는 프로필 도메인 값을 그대로 참조하므로 미입력 멘토는 null 로 온다.
   * non-null 로 잡으면 프로필을 덜 채운 멘토의 상세가 파싱 단계에서 통째로 죽는다.
   */
  nickname: z.string().nullable(),
  profileImage: z.string().nullable(),
  introduction: z.string().nullable(),
  careers: z.array(liveMentoringCareerSchema),
});
export type LiveMentorProfile = z.infer<typeof liveMentorProfileSchema>;

/** 멘토 상세 (상세 페이지 렌더용, +reviews) (PRD §4.3) */
export const liveMentorDetailSchema = z.object({
  mentorId: z.number(),
  /**
   * 이 상품이 현재 열려 있는 개설의 id.
   *
   * 신청 생성 경로가 `POST /live-mentoring/openings/{openingId}/applications` 라
   * 결제 페이지가 이 값을 들고 가야 한다. 서버는 예전부터 내려주고 있었는데
   * 스키마에 없어 zod 가 버리고 있었다.
   */
  openingId: z.number(),
  /** 상품명 — 히어로 제목. */
  title: z.string(),
  categories: z.array(liveMentoringCategorySchema),
  durations: z.array(liveMentoringDurationSchema),
  /** 진행시간별 판매가 — 히어로 플랜 옵션이 이 값을 그대로 쓴다. */
  durationPrices: z.array(
    z.object({
      /**
       * 신청 생성 DTO 가 요구하는 `durationPriceId`(`@NotNull Long`).
       *
       * 공개 상세에 없어서 프론트가 신청을 만들 수 없었다 — `mentoringTypes[].id`
       * 가 빠져 Push 0 으로 추가했던 것과 같은 결함이었고, 서버가 `ebb03a66` 으로
       * 고쳤다. 이 값이 비면 결제가 통째로 막히므로 필수로 잡아 파싱 단계에서 잡는다.
       */
      durationPriceId: z.number(),
      duration: liveMentoringDurationSchema,
      price: z.number(),
    }),
  ),
  /**
   * 여러 진행시간을 열었을 때의 최저가(대표 표시용).
   * 아직 한 번도 개설하지 않은 상품은 null 이다 — 승인 전 미리보기로 들어올 수 있다.
   */
  price: z.number().nullable(),
  /** 후기가 한 건도 없으면 서버가 null 을 준다. */
  rating: z.number().nullable(),
  reviewCount: z.number(),
  profile: liveMentorProfileSchema,
  template: liveMentoringTemplateSchema,
  reviews: z.array(liveMentoringReviewSchema),
  /** 이 멘토가 참여 중인 챌린지 (공개 상세 하단). */
  challenges: z.array(
    z.object({
      challengeId: z.number(),
      title: z.string(),
      thumbnail: z.string().nullable(),
    }),
  ),
});
export type LiveMentorDetail = z.infer<typeof liveMentorDetailSchema>;

/**
 * 슬롯 상태 — 백엔드 `FeedbackSlotStatus`.
 * mentor 앱(`apps/mentor/src/api/live-mentoring/liveMentoringSchema.ts`)과 **동일 형태**다.
 */
export const feedbackSlotStatusSchema = z.enum(['OPEN', 'RESERVED']);
export type FeedbackSlotStatus = z.infer<typeof feedbackSlotStatusSchema>;

/**
 * 예약 가능 슬롯 1건 — 백엔드 `LiveMentoringScheduleSlotResponseDto`.
 * `startDate`/`endDate` 는 `LocalDateTime`(예: `"2026-09-01T10:00:00"`)이고 길이는 30분 고정이다.
 */
export const liveMentoringSlotSchema = z.object({
  slotId: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  status: feedbackSlotStatusSchema,
});
export type LiveMentoringSlot = z.infer<typeof liveMentoringSlotSchema>;

/**
 * 슬롯 목록 응답 — `GET /live-mentoring/mentors/{mentorId}/slots`.
 *
 * 서버가 활성 개설이 없으면 빈 배열을, 있으면 미래의 `OPEN` 슬롯만 시작 시각
 * 오름차순으로 내려준다. 프론트는 개설 상태와 슬롯 상태를 조합하지 않는다.
 */
export const liveMentoringSlotListSchema = z.object({
  liveMentoringSlotList: z.array(liveMentoringSlotSchema),
});
export type LiveMentoringSlotList = z.infer<typeof liveMentoringSlotListSchema>;

// ── 신청 생성 (POST /live-mentoring/openings/{openingId}/applications) ──────

/**
 * 질문 첨부 종류 — 백엔드 `LiveMentoringAttachmentType`.
 * 상수 이름이 곧 직렬화 값이다. 오타는 컴파일러를 통과해 런타임까지 살아남는다.
 */
export const liveMentoringAttachmentTypeSchema = z.enum(['NONE', 'FILE', 'URL']);
export type LiveMentoringAttachmentType = z.infer<
  typeof liveMentoringAttachmentTypeSchema
>;

/**
 * 신청 상태 — 백엔드 `LiveMentoringApplicationStatus`.
 *
 * 저장값은 괄호 안 숫자(`PAYMENT_PENDING(1)` … `CONFIRMED(4)`)지만 JSON 으로는
 * 상수 이름이 나간다. DB 를 직접 볼 때 declaration 순서로 착각하지 않도록 적어 둔다.
 */
export const liveMentoringApplicationStatusSchema = z.enum([
  'PAYMENT_PENDING',
  'EXPIRED',
  'CANCELED',
  'CONFIRMED',
]);
export type LiveMentoringApplicationStatus = z.infer<
  typeof liveMentoringApplicationStatusSchema
>;

/**
 * 신청 생성 요청 — 백엔드 `CreateLiveMentoringApplicationRequestDto`.
 *
 * 제약은 서버 Bean Validation 을 그대로 옮겼다. 서버가 400 을 주기 전에 여기서
 * 걸러야 사용자가 결제 직전에 튕기지 않는다.
 *
 * | 필드 | 서버 제약 |
 * |---|---|
 * | `durationPriceId` | `@NotNull` |
 * | `slotIds` | `@NotEmpty` `@Size(max = 2)` — 60분 플랜이 연속 2칸이라 상한이 2다 |
 * | `mentoringTypeIds` | `@NotEmpty` |
 * | `reservationChangeAgreed` | `@NotNull` |
 * | `contactEmail` | `@NotBlank` `@Email` `@Size(max = 255)` |
 * | `question.deferred` | `@NotNull` |
 * | `question.content` | `@Size(max = 5000)` — 필수가 아니다 |
 * | `question.attachmentType` | `@NotNull` |
 * | `question.url` | `@Size(max = 2048)` |
 * | `question.mentorShareAgreed` | `@NotNull` |
 * | `couponCode` | `@Size(max = 100)` — 선택 |
 *
 * **이름·휴대폰 필드는 없다.** 시안 `2-0` 이 요구하는 것과 어긋난다 (PRD 7-6 —
 * 표시 전용으로 두고 `contactEmail` 만 보낸다).
 */
export const createLiveMentoringApplicationRequestSchema = z.object({
  durationPriceId: z.number(),
  slotIds: z.array(z.number()).min(1).max(2),
  mentoringTypeIds: z.array(z.number()).min(1),
  reservationChangeAgreed: z.boolean(),
  contactEmail: z.string().email().max(255),
  question: z.object({
    deferred: z.boolean(),
    /* 나중에 작성하기(`deferred: true`)면 비어 있다. 서버도 필수로 보지 않는다. */
    content: z.string().max(5000).nullish(),
    attachmentType: liveMentoringAttachmentTypeSchema,
    fileId: z.number().nullish(),
    url: z.string().max(2048).nullish(),
    mentorShareAgreed: z.boolean(),
  }),
  couponCode: z.string().max(100).nullish(),
});
export type CreateLiveMentoringApplicationRequest = z.infer<
  typeof createLiveMentoringApplicationRequestSchema
>;

/**
 * 신청 생성 응답 — 백엔드 `CreateLiveMentoringApplicationResponseDto`.
 *
 * `reservation.expiresAt` 이 10분 선점 만료 시각이고, `payment.orderId` 를 Toss 에 넘긴다.
 * 시각은 전부 타임존 없는 `LocalDateTime` 문자열이다.
 */
export const createLiveMentoringApplicationResponseSchema = z.object({
  applicationId: z.number(),
  product: z.object({
    durationPriceId: z.number(),
    name: z.string(),
    durationMinutes: z.number(),
  }),
  reservation: z.object({
    slotIds: z.array(z.number()),
    startAt: z.string(),
    endAt: z.string(),
    applicationStatus: liveMentoringApplicationStatusSchema,
    expiresAt: z.string(),
  }),
  mentoringTypes: z.array(
    z.object({ mentoringTypeId: z.number(), name: z.string() }),
  ),
  payment: z.object({
    originalPrice: z.number(),
    productDiscount: z.number(),
    couponDiscount: z.number(),
    finalAmount: z.number(),
    orderId: z.string(),
    currency: z.string(),
  }),
});
export type CreateLiveMentoringApplicationResponse = z.infer<
  typeof createLiveMentoringApplicationResponseSchema
>;

// ── 결제 승인 (POST /live-mentoring/applications/{applicationId}/payment/confirm) ──

/**
 * 결제 승인 요청 — 백엔드 `ConfirmLiveMentoringPaymentRequestDto`.
 *
 * `amount` 가 **문자열**이다(`@NotBlank String amount`). 응답에서는 숫자로 돌아온다.
 * 이 비대칭은 실수가 아니라 계약이므로 스키마에도 그대로 둔다 — 한쪽을 숫자로
 * 맞춰 두면 승인 요청이 400 으로 떨어지고, 그때는 이미 Toss 결제창이 닫힌 뒤다.
 *
 * `paymentKey` 만 제약이 없다. Toss 가 주는 값을 그대로 넘긴다.
 */
export const confirmLiveMentoringPaymentRequestSchema = z.object({
  paymentKey: z.string(),
  orderId: z.string().min(1),
  amount: z.string().min(1),
});
export type ConfirmLiveMentoringPaymentRequest = z.infer<
  typeof confirmLiveMentoringPaymentRequestSchema
>;

/**
 * 결제 승인 응답 — 백엔드 `ConfirmLiveMentoringPaymentResponseDto`.
 * 요청과 달리 `amount` 는 `Integer` 다.
 */
export const confirmLiveMentoringPaymentResponseSchema = z.object({
  applicationId: z.number(),
  paymentId: z.number(),
  orderId: z.string(),
  amount: z.number(),
  applicationStatus: liveMentoringApplicationStatusSchema,
});
export type ConfirmLiveMentoringPaymentResponse = z.infer<
  typeof confirmLiveMentoringPaymentResponseSchema
>;

// ── 마이페이지 신청현황 (GET /live-mentoring/applications/my) ────────────────

/**
 * 신청현황 카드 1건 — 백엔드 `MyLiveMentoringApplicationResponse`.
 *
 * `entryLink` 는 발급 구조가 정해지지 않아 **항상 null 이다**(PRD 4-8). 화면은 이 값이
 * 비면 `멘토링 입장` 을 비활성으로 그린다 — 버튼을 감추지는 않는다.
 *
 * 결제가 붙지 않은 신청은 서버가 목록에서 걸러 주므로 프론트가 상태로 다시 거르지 않는다.
 */
export const myLiveMentoringApplicationSchema = z.object({
  applicationId: z.number(),
  /** 결제가 아직 없으면 null. */
  paymentId: z.number().nullable(),
  mentorName: z.string().nullable(),
  thumbnail: z.string().nullable(),
  productName: z.string().nullable(),
  durationMinutes: z.number(),
  /** `LocalDateTime`. 참여 예정·중·종료 판정의 기준이다. */
  reservationStartAt: z.string(),
  reservationEndAt: z.string(),
  status: liveMentoringApplicationStatusSchema,
  /** 질문을 썼는지. 카드 버튼이 `작성` 인지 `수정` 인지 가른다. */
  questionWritten: z.boolean(),
  entryLink: z.string().nullable(),
});
export type MyLiveMentoringApplication = z.infer<
  typeof myLiveMentoringApplicationSchema
>;

export const myLiveMentoringApplicationListSchema = z.object({
  applicationList: z.array(myLiveMentoringApplicationSchema),
});

// ── 멘토링 질문 (GET·PATCH /live-mentoring/applications/{id}/question) ──────

/**
 * 질문 조회 응답 — 백엔드 `GetLiveMentoringQuestionResponseDto`.
 *
 * **`editable` 은 서버가 계산한 값이다.** 예약 시작 48시간 기준인데, 화면이 같은
 * 계산을 다시 하면 클라이언트와 서버의 시계 차이로 결과가 어긋나 저장 시점에 거부된다.
 * 서버 DTO 주석도 같은 말을 한다.
 *
 * 첨부 URL 의 필드 이름이 요청(`url`)과 응답(`attachmentUrl`)에서 다르다.
 */
export const liveMentoringQuestionSchema = z.object({
  applicationId: z.number(),
  deferred: z.boolean(),
  content: z.string().nullable(),
  attachmentType: liveMentoringAttachmentTypeSchema,
  fileId: z.number().nullable(),
  attachmentUrl: z.string().nullable(),
  mentorShareAgreed: z.boolean(),
  reservationStartAt: z.string(),
  editable: z.boolean(),
});
export type LiveMentoringQuestion = z.infer<typeof liveMentoringQuestionSchema>;

/**
 * 질문 수정 요청 — 백엔드 `UpdateLiveMentoringQuestionRequestDto`.
 * 필드와 제약이 신청 생성의 `question` 과 같다. 서버도 같은 검증기를 돌린다.
 */
export const updateLiveMentoringQuestionRequestSchema = z.object({
  deferred: z.boolean(),
  content: z.string().max(5000).nullish(),
  attachmentType: liveMentoringAttachmentTypeSchema,
  fileId: z.number().nullish(),
  url: z.string().max(2048).nullish(),
  mentorShareAgreed: z.boolean(),
});
export type UpdateLiveMentoringQuestionRequest = z.infer<
  typeof updateLiveMentoringQuestionRequestSchema
>;
