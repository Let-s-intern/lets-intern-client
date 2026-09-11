/**
 * 올인원패스(멤버십) 어드민 타입.
 *
 * 백엔드 도메인이 아직 없어 현재는 mock(./mock)으로만 동작한다. 화면은 이
 * 타입에만 의존하므로, 실제 API 스펙이 나오면 mock 을 실제 호출로 교체해도
 * 화면 코드는 바뀌지 않는다. 필요한 화면부터 타입을 점진적으로 확장한다.
 */

/** 모집상태 (구매 가능 기간으로 파생 · util/passStatus.ts) */
export type PassRecruitmentStatus = 'BEFORE' | 'PROCEEDING' | 'CLOSED';

/** A-1 개설 목록 행 */
export interface AllInOnePassListItem {
  id: number;
  title: string; // 올인원패스 제목
  purchaseStartDate: string | null; // 구매 가능 기간 시작
  purchaseEndDate: string | null; // 구매 가능 기간 종료
  passMonths: number; // 패스 기간(개월)
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
