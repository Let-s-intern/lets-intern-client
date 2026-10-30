/** 올인원패스(멤버십) 어드민 타입. */

/** 모집상태 (구매 가능 기간으로 파생 · util/passStatus.ts) */
export type PassRecruitmentStatus = 'BEFORE' | 'PROCEEDING' | 'CLOSED';

/** 포함 권한(프로그램 이용권) 종류 */
export type PassPermission =
  | 'CHALLENGE_ALL_IN_ONE'
  | 'GUIDEBOOK_ALL_IN_ONE'
  | 'VOD_ALL_IN_ONE'
  | 'LIVE_CLASS_ALL_IN_ONE';

/** 플랜(권한 구성) 한 개 */
export interface PassPlan {
  id: string;
  name: string;
  description: string;
  permissions: PassPermission[];
  regularPrice: number | null;
  discountPrice: number | null;
  privilegeIds?: Partial<Record<PassPermission, number>>;
}

export type CalendarEventType = 'GUERRILLA' | 'MILESTONE';

/** 캘린더 관리 일정 한 개 (게릴라세션/마일스톤 수기 입력) */
export interface PassCalendarEvent {
  id: string;
  startDate: string | null;
  endDate: string | null;
  type: CalendarEventType;
  title: string;
  url: string | null;
}

/** 외부 링크 한 개 */
export interface PassExternalLink {
  id: string;
  name: string;
  url: string;
}

/** 연장 옵션 한 개 (연장일 + 가격) */
export interface PassExtensionOption {
  id: string;
  days: number | null;
  price: number | null;
}

/** 랜딩페이지 구성. 서버 `landingDescription`(JSON) 컬럼으로 직렬화(비구매자 노출 페이지라 외부링크 url 등 민감정보 제외) · (de)serialize는 allInOnePassMapper 참고. */

/** 혜택요약 카드 1개 (아이콘·이름·설명). 저장 시 최대 6개. id 는 폼 편집용(직렬화 X). */
export interface PassBenefitCard {
  id: string;
  iconKey: string;
  name: string;
  description: string;
}

export interface PassLandingVod {
  title: string;
  thumbnail: string;
  description: string;
}

/** 후기 한 개 (어드민 직접 입력) */
export interface PassLandingReview {
  id: string;
  source: string;
  resultTags: string[];
  imageUrl: string;
  summary: string;
}

/** 랜딩페이지 구성 입력값. 혜택요약은 `benefitsSummary` 카드 목록(아이콘·이름·설명, 최대 6, VOD 제외)으로 통째 보관·직렬화. 가격섹션 '특별 혜택' 칩은 저장 시 외부링크명으로 파생. */
export interface PassLandingConfig {
  displayDeadline: string | null;
  hero: {
    title: string;
    description: string;
    recruitFootnote: string;
  };
  lexical: {
    introSection: string;
    playbookSection: string;
    benefitSection: string;
    reviewSection: string;
  };
  /** 혜택요약 카드(최대 6, VOD 제외 — VOD는 옵션 토글로 웹에서 동적 노출). */
  benefitsSummary: PassBenefitCard[];
  vods: PassLandingVod[];
  vodCount: number;
  reviews: PassLandingReview[];
  finalCta: {
    title: string;
    description: string;
  };
}

/** 생성/수정 폼 입력값. */
export interface PassFormInput {
  title: string;
  shortDescription: string;
  purchaseStartDate: string | null;
  purchaseEndDate: string | null;
  passDays: number | null;
  thumbnailUrl: string | null;
  plans: PassPlan[];
  calendarEvents: PassCalendarEvent[];
  externalLinks: PassExternalLink[];
  extensionOptions: PassExtensionOption[];
  landing: PassLandingConfig;
  faqList: number[];
  mentoringCouponAutoIssue: boolean;
}

/** FAQ 한 개 */
export interface PassFaq {
  id: string;
  category: string;
  question: string;
  answer: string;
}

/** 개설 목록 행 */
export interface AllInOnePassListItem {
  id: number;
  title: string;
  purchaseStartDate: string | null;
  purchaseEndDate: string | null;
  passDays: number;
  isVisible: boolean;
  currentApplicantCount: number;
  maxApplicantCount: number | null; // null = 무제한(∞)
  createdAt: string;
}

/** 멤버십으로 이용한 프로그램 종류 */
export type UsedProgramType = 'CHALLENGE' | 'GUIDEBOOK' | 'VOD' | 'MENTORING';

/** 참여자가 멤버십으로 이용한 프로그램 1건 (이용 프로그램 조회 모달) */
export interface UsedProgram {
  id: number;
  type: UsedProgramType;
  title: string;
  usedAt: string | null;
  isRefunded: boolean;
}

/** 참여자(멤버십 구매자)의 신청서(application) 1건. 연장마다 새 application이 생겨 한 유저가 여러 건을 가질 수 있어 테이블에선 email로 묶어 1행 + [전체 내역]으로 펼침. 환불 상태·라벨은 refundState util이 isCanceled/finalPrice/originalPrice로 파생, 환불은 건별 독립 처리. */
export interface PassParticipant {
  id: number;
  orderId: string;
  name: string;
  email: string;
  phoneNum: string;
  couponName: string | null;
  couponDiscount: number | null; // -1 = 100% 할인
  productName: string;
  programPrice: number;
  programDiscount: number;
  finalPrice: number;
  originalPrice: number | null;
  isCanceled: boolean;
  isAdminRefunded: boolean;
  createDate: string;
  startDate: string;
  endDate: string;
  extendedDays: number | null; // 연장 건만 (최초=null)
  usedPrograms: UsedProgram[];
}

/** 참여 기간 건별 내역 1건 (최초 패스 + 연장 각각 = application 1건). 목록의 [자세히 보기]로 펼쳐 봄. */
export interface PassParticipationPeriod {
  type: string; // PASS(패스 기간) | EXTENSION(연장)
  title: string; // "패스 기간" / "N일 연장" (BE 제공)
  orderId: string;
  paidAt: string;
  finalPrice: number;
  days: number;
  startDate: string;
  endDate: string;
  isRefunded: boolean;
}

/** 참여중 유저 1명 (전 패스 통합 "현재 참여중" 목록). BE가 연장마다 application을 새로 생성해 FE가 이메일/전화로 묶어 유저 1명 = 1행으로 보여주고, 참여 기간은 periods[0] 시작~마지막 종료로 요약(연장 반영), 건별 내역은 periods로 펼침. */
export interface ActivePassParticipant {
  id: number;
  orderId: string;
  name: string;
  email: string;
  passTitle: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPayment: number;
  extensionCount: number;
}

export interface RetrospectiveCommonQuestion {
  id: number;
  question: string;
  answerGuide: string;
}

export interface RetrospectiveRound {
  id: number;
  round: number;
  weeklyQuestion: string;
  answerGuide: string;
  responseCount: number;
  visiblePeriodType: string | null;
  visiblePeriodValue: number | null;
  periodType: string | null; // INFINITY = 상시
  periodValue: number | null;
}

/** 응답의 개별 답변. questionLabel은 제출 당시 질문 문구의 스냅샷이라 질문이 이후 수정/삭제돼도 원래 질문 그대로 보이며, 목록 탭은 등장한 questionId별로 그룹핑. */
export interface RetrospectiveAnswer {
  questionId: number;
  questionLabel: string;
  answer: string;
}

/** 회고 응답 한 건 (id = ordinalId, 코멘트 PATCH/DELETE 대상) */
export interface RetrospectiveResponse {
  id: number;
  submitterName: string;
  submittedAt: string;
  submitted: boolean;
  answers: RetrospectiveAnswer[];
  adminFeedback: string | null;
}
