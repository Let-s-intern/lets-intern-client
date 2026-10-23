/** 올인원패스(멤버십) 어드민 타입. (회고·참여자는 BE 대기로 아직 mock) */

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
  id: string; // 폼 로컬 식별자
  name: string; // 플랜명
  description: string; // 플랜 설명
  permissions: PassPermission[]; // 포함 권한
  regularPrice: number | null; // 정가
  discountPrice: number | null; // 할인가
  // 서버에 존재하는 권한의 id(권한→membershipPlanPrivilegeId). 수정 시 PATCH/DELETE용.
  privilegeIds?: Partial<Record<PassPermission, number>>;
}

/** 캘린더 일정 유형 */
export type CalendarEventType = 'GUERRILLA' | 'MILESTONE';

/** 1.3 캘린더 관리 일정 한 개 (게릴라세션/마일스톤 수기 입력) */
export interface PassCalendarEvent {
  id: string; // 폼 로컬 식별자
  startDate: string | null; // 시작일(ISO)
  endDate: string | null; // 종료일(ISO)
  type: CalendarEventType;
  title: string;
  url: string | null; // URL(선택)
}

/** 1.4 외부 링크 한 개 */
export interface PassExternalLink {
  id: string; // 폼 로컬 식별자
  name: string; // 링크명
  url: string;
}

/** 연장 옵션 한 개 (연장일 + 가격) */
export interface PassExtensionOption {
  id: string; // 폼 로컬 식별자
  days: number | null; // 연장 일수 (예: 30·90)
  price: number | null; // 연장 가격(원)
}

/**
 * 1.8 랜딩페이지 구성.
 *
 * 저장은 서버 `landingDescription`(JSON) 컬럼으로 직렬화한다(비구매자 노출 페이지라
 * 외부링크 url 등 민감 정보는 담지 않는다). (de)serialize 는 allInOnePassMapper 참고.
 */

/** 추가혜택 중 외부링크에 붙이는 부가정보(설명·아이콘). name 은 외부링크에서 실시간으로 가져온다. */
export interface PassLandingBenefitExtra {
  description: string;
  iconKey: string; // 'icon1' | 'icon2' | 'icon3' (실제 아이콘 파일 매핑 전 플레이스홀더)
}

/** 추가혜택 중 외부링크와 무관하게 직접 추가하는 혜택 */
export interface PassLandingManualBenefit {
  id: string; // 폼 로컬 식별자
  name: string;
  description: string;
  iconKey: string;
}

/** 후기 한 개 (어드민 직접 입력) */
export interface PassLandingReview {
  id: string; // 폼 로컬 식별자
  source: string; // 출처(드롭다운)
  resultTags: string[]; // 결과태그(다중 선택)
  imageUrl: string; // width 고정 이미지
  summary: string; // 요약, 최대 70자
}

/**
 * 랜딩페이지 구성 입력값.
 *
 * 추가혜택만 편집 중엔 쪼개서 보관한다: 외부링크 유래분은 `benefitExtras`(링크 id→설명·아이콘,
 * 이름은 externalLinks 에서 실시간), 그 외는 `manualBenefits`. 저장 시 둘을 합쳐
 * additionalBenefits(name+설명+아이콘, url 제거) 로 직렬화한다.
 */
export interface PassLandingConfig {
  hero: {
    title: string; // 최대 30자
    description: string; // 최대 60자
    recruitFootnote: string; // 모집카드 하단문구, 최대 50자
  };
  lexical: {
    introSection: string; // ① 왜 사야하는지(소개) — 렉시컬 직렬화 JSON
    playbookSection: string; // ② 플레이북
    benefitSection: string; // ③ 패스 특별 혜택
    reviewSection: string; // ④ 기타 후기
  };
  benefitExtras: Record<string, PassLandingBenefitExtra>; // key = externalLink.id
  manualBenefits: PassLandingManualBenefit[];
  reviews: PassLandingReview[];
  finalCta: {
    title: string;
    description: string;
  };
}

/**
 * 생성/수정 폼 입력값. 섹션(1.1~1.6)을 단계적으로 확장한다.
 */
export interface PassFormInput {
  // 1.1 기본 정보
  title: string;
  shortDescription: string;
  purchaseStartDate: string | null; // ISO
  purchaseEndDate: string | null; // ISO
  passDays: number | null; // 패스 기간(일)
  thumbnailUrl: string | null;
  // 1.2 플랜 정보
  plans: PassPlan[];
  // 1.3 캘린더 관리
  calendarEvents: PassCalendarEvent[];
  // 1.4 외부 링크
  externalLinks: PassExternalLink[];
  // 1.4-b 연장 옵션
  extensionOptions: PassExtensionOption[];
  // 1.5 랜딩페이지 구성 (히어로·렉시컬4·추가혜택·후기·최종CTA → landingDescription)
  landing: PassLandingConfig;
  // 1.6 FAQ: 질문/답변은 전 멤버십 공통 풀(/faq, type=MEMBERSHIP)에서 관리
  faqList: number[];
  // 1:1 LIVE 멘토링 50% 쿠폰 월 자동발급 적용 여부 (참여중 유저에게만)
  mentoringCouponAutoIssue: boolean;
}

/** 1.7 FAQ 한 개 */
export interface PassFaq {
  id: string; // 폼 로컬 식별자
  category: string; // 유형(직접입력/기존선택)
  question: string;
  answer: string;
}

/** A-1 개설 목록 행 */
export interface AllInOnePassListItem {
  id: number;
  title: string; // 올인원패스 제목
  purchaseStartDate: string | null; // 구매 가능 기간 시작
  purchaseEndDate: string | null; // 구매 가능 기간 종료
  passDays: number; // 패스 기간(일)
  isVisible: boolean; // 노출 여부
  currentApplicantCount: number; // 신청 인원
  maxApplicantCount: number | null; // null = 무제한(∞)
  createdAt: string; // 개설 일자
}

/** 멤버십으로 이용한 프로그램 종류 */
export type UsedProgramType = 'CHALLENGE' | 'GUIDEBOOK' | 'VOD' | 'MENTORING';

/** 참여자가 멤버십으로 이용한 프로그램 1건 (이용 프로그램 조회 모달) */
export interface UsedProgram {
  id: number;
  type: UsedProgramType;
  title: string;
  usedAt: string | null; // 이용(신청·열람) 일시
}

/**
 * 참여자(멤버십 구매자)의 신청서(application) 1건.
 *
 * 연장마다 새 application 이 생기므로, 한 유저가 여러 건을 가질 수 있다.
 * 테이블에서는 email 기준으로 묶어 유저 1행 + [전체 내역]으로 펼친다.
 * 환불 상태·라벨은 refundState util 이 isCanceled/finalPrice/originalPrice 로
 * 파생하고, 환불은 application(건)별로 독립 처리한다.
 */
export interface PassParticipant {
  id: number; // 신청서 id (환불 대상)
  orderId: string; // 주문번호
  name: string; // 이름
  email: string; // 소통용 이메일(유저 묶음 키)
  phoneNum: string; // 휴대폰 번호
  couponName: string | null; // 쿠폰명
  couponDiscount: number | null; // 쿠폰 할인액 (-1 = 100% 할인)
  productName: string; // 결제 상품(구매한 패스 플랜명)
  programPrice: number; // 정가 (CSV 금액 계산용)
  programDiscount: number; // 프로그램 할인 (CSV 금액 계산용)
  finalPrice: number; // 실결제액
  originalPrice: number | null; // 환불 시 원결제액(전체/부분 판정용)
  isCanceled: boolean; // 취소(환불 완료) 여부
  isAdminRefunded: boolean; // 어드민 환불 여부(환불여부 라벨 구분용)
  createDate: string; // 결제일(신청일자)
  startDate: string; // 이용 시작일 — 최초로 고정(한 유저의 모든 건 동일)
  endDate: string; // 이용 종료일 — 연장마다 누적 증가
  extendedDays: number | null; // 연장 일수(연장 건만 · 최초=null). 커버 구간=[직전 종료+1, endDate]
  usedPrograms: UsedProgram[]; // 이용한 프로그램 목록 (조회 모달)
}

/**
 * A-8 참여 기간 건별 내역 1건 (최초 패스 + 연장 각각 = application 1건).
 * 목록의 [자세히 보기]로 펼쳐 본다.
 */
export interface PassParticipationPeriod {
  applicationId: string; // 주문번호 (연장마다 새 application)
  paidAt: string; // 결제일
  startDate: string; // 이용 시작일 — 최초로 고정(한 유저의 모든 건 동일)
  endDate: string; // 이용 종료일 — 연장마다 누적 증가
  extendedDays: number | null; // 연장 일수(연장 건만 · 최초=null). 커버 구간=[직전 종료+1, endDate]
  price: number; // 결제 금액(원) — 연장은 연장분만
}

/**
 * A-8 참여중 유저 1명 (전 패스 통합 "현재 참여중" 목록).
 *
 * BE는 연장마다 application을 새로 생성하므로, FE가 이메일/전화 기준으로 묶어
 * 유저 1명 = 1행으로 보여준다. 참여 기간은 periods[0] 시작 ~ 마지막 종료로
 * 요약(연장 반영)하고, 건별 내역은 periods(application 목록)로 펼친다.
 */
export interface ActivePassParticipant {
  id: string; // 행 식별자 = 최신(대표) 주문번호
  name: string; // 이름
  email: string; // 이메일
  passTitle: string; // 참여 올인원패스
  periods: PassParticipationPeriod[]; // [0]=최초, 이후 연장. 요약=첫 시작~마지막 종료
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
  visiblePeriodType: string | null; // 노출 시점 단위
  visiblePeriodValue: number | null; // 노출 시점 값(패스 시작일 + N)
  periodType: string | null; // 작성 기간 단위 (INFINITY = 상시)
  periodValue: number | null; // 작성 기간 값(노출 시작 + N)
}

/**
 * A-5 응답의 개별 답변.
 *
 * questionLabel 은 제출 당시 질문 문구의 스냅샷이다. 질문이 이후 수정/삭제돼도
 * 이 답변은 원래 질문 그대로 보이며, 목록 탭은 등장한 questionId 별로 묶는다.
 */
export interface RetrospectiveAnswer {
  questionId: number;
  questionLabel: string;
  answer: string;
}

/** A-5 회고 응답 한 건 */
export interface RetrospectiveResponse {
  id: number;
  submitterName: string;
  submittedAt: string;
  answers: RetrospectiveAnswer[];
}
