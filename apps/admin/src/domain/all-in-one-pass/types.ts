/**
 * 올인원패스(멤버십) 어드민 타입.
 *
 * 백엔드 도메인이 아직 없어 현재는 mock(./mock)으로만 동작한다. 화면은 이
 * 타입에만 의존하므로, 실제 API 스펙이 나오면 mock 을 실제 호출로 교체해도
 * 화면 코드는 바뀌지 않는다. 필요한 화면부터 타입을 점진적으로 확장한다.
 */

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
}

/** 캘린더 일정 유형 */
export type CalendarEventType = 'SEMINAR' | 'MILESTONE';

/** 1.3 캘린더 관리 일정 한 개 (세미나/마일스톤 수기 입력) */
export interface PassCalendarEvent {
  id: string; // 폼 로컬 식별자
  date: string | null; // 일정 날짜(ISO)
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
  // 1.5 상세페이지 콘텐츠 (렉시컬 직렬화 JSON 문자열)
  detailContent: string | null;
  // 1.6 혜택
  benefits: PassBenefit[];
  // 1.7 FAQ
  faqs: PassFaq[];
}

/** 1.6 혜택 한 개 */
export interface PassBenefit {
  id: string; // 폼 로컬 식별자
  isVisible: boolean; // 행별 노출 토글
  category: string; // 유형(직접입력/기존선택) → 유저 기타혜택 카드 뱃지
  thumbnailUrl: string | null;
  title: string;
  link: string;
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
  isVisible: boolean; // 노출 여부(단일 노출)
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
 * 참여자(멤버십 구매자) 1명.
 *
 * 기존 프로그램 참여자 테이블(신청서)과 동일한 필드 구성을 따른다. 환불 상태·라벨은
 * refundState util 이 isCanceled/finalPrice/originalPrice 로 파생하므로 그 필드를 그대로
 * 갖는다(재사용). 여기에 멤버십 전용으로 usedPrograms(이용 프로그램)만 더한다.
 */
export interface PassParticipant {
  id: number; // 신청서 id (환불 대상)
  orderId: string; // 주문번호
  name: string; // 이름
  email: string; // 소통용 이메일
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
  createDate: string; // 신청일자
  usedPrograms: UsedProgram[]; // 이용한 프로그램 목록 (조회 모달)
}

/** A-3 공지/가이드 콘텐츠 구분 */
export type NoticeType = 'NOTICE' | 'GUIDE';

/** A-3 공지·가이드 한 개 */
export interface AllInOnePassNotice {
  id: number;
  type: NoticeType;
  title: string;
  content: string; // 본문(평문)
  createdAt: string; // 생성일(ISO)
  linkedPassIds: number[]; // 노출 영역: 이 콘텐츠를 노출할 패스 id 목록
}

/** A-4 공통 질문 (전 패스 공통, 모든 회차에 포함) */
export interface RetrospectiveCommonQuestion {
  id: number;
  order: number; // 표시 순서
  question: string;
}

/**
 * A-4 회고 회차 한 개.
 *
 * 노출 시점·작성 가능 기간은 저장하지 않는다. 회차 번호와 유저의 패스 시작일로
 * 프론트에서 파생한다(회차 N = 패스 시작 +2N주에 2주간 작성 가능).
 */
export interface RetrospectiveRound {
  id: number;
  round: number; // 회차 번호
  weeklyQuestion: string; // 주차별 질문(1개)
  responseCount: number; // 응답 수
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
  submitterName: string; // 제출자 이름
  passName: string; // 구매한 올인원패스 이름
  submittedAt: string; // 제출일(ISO)
  answers: RetrospectiveAnswer[];
}
