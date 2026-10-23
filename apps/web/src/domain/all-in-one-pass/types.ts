/**
 * 올인원패스(all-in-one-pass) 유저 대시보드 타입.
 *
 * 백엔드 도메인명은 membership 이지만 FE 제품명은 올인원패스라 타입·필드는 AllInOnePass/Pass
 * 네이밍을 쓴다(어드민과 동일 관례). 백엔드 필드명은 api 계층 매퍼에서만 변환한다.
 * 타입은 이 파일 한 곳에 모으며, 공용부터 만들고 탭 전용 타입은 그 탭 작업 시 여기에 추가한다.
 * 유저 조회 API 미구현이라 현재는 mock 동작 → 실제 API 시 api 훅 queryFn 만 교체.
 *
 * 참고 엔티티: lets-career-server-dev domain/membership/entity/*, MembershipApplication.
 */

/** 이용권 프로그램 종류 (ProgramType). LIVE = 유저 화면 "라이브 클래스" */
export type PassProgramType = 'CHALLENGE' | 'GUIDEBOOK' | 'VOD' | 'LIVE';

/** 이용권 방식 (MembershipPrivilegeType) */
export type PassPrivilegeType = 'ALL_IN_ONE' | 'LIMITED_COUNT';

/** 플랜에 포함된 이용권 하나 (MembershipPlanPrivilege). programType 이 플랜 내 유일키라 id 불필요. */
export interface PassPrivilege {
  programType: PassProgramType;
  privilegeType: PassPrivilegeType;
}

/** 플랜 (MembershipPlan) */
export interface AllInOnePassPlan {
  id: number; // membershipPlanId
  title: string;
  description: string | null;
  price: number; // 정가 (BE price)
  discount: number | null; // 할인액(차감 금액, BE discount). 최종가 = price - discount. null/0 = 할인 없음
  privileges: PassPrivilege[];
}

/**
 * 내가 구매한 올인원패스 1건 (MembershipApplication).
 *
 * `/all-in-one-pass/[applicationId]` 의 applicationId 가 이 id 다. 유저는 여러 건 소유 가능
 * (→ 배열). 대시보드의 남은 기간(D-day)·이용 기간은 startDate/endDate 로 파생한다.
 * 접근 가드·여러 탭이 공유하므로 공용 타입에 둔다.
 */
export interface AllInOnePassApplication {
  id: number;
  passTitle: string; // 구매 시점 패스명 (예: "2026 하반기 올인원패스")
  startDate: string; // 이용 시작 (ISO)
  endDate: string; // 이용 종료 (ISO)
  plan: AllInOnePassPlan; // 내가 산 플랜 + 이용권
  /**
   * 이용권 카드에 함께 노출되는 멘토링 쿠폰들. 멘토링은 privilege 가 아니라 쿠폰이라
   * 할인 방식(50%/전액/금액)에 따라 쿠폰명이 달라진다 → 쿠폰명 그대로 표기.
   * // TODO(BE): 실제로는 GET /coupon/my?programType=LIVE_MENTORING 파생.
   */
  mentoringCoupons: PassMentoringCoupon[];
}

/** 이용권 카드에 노출되는 멘토링 쿠폰 (쿠폰명 + 사용 가능 횟수) */
export interface PassMentoringCoupon {
  name: string; // 예: "1:1 LIVE 멘토링 50% 할인 쿠폰"
  count: number; // 사용 가능 횟수
}

// ─── 랜딩(구매) 페이지 ───

/**
 * 올인원패스 FAQ 1건 (어드민 MEMBERSHIP FAQ 중 패스별 선택분). category 로 그룹핑 가능.
 */
export interface PassFaq {
  id: number;
  question: string;
  answer: string;
  category: string | null;
}

/**
 * 랜딩(구매) 페이지 상품 상세. 공개 API `GET /api/v1/membership/{id}`(미개발, mock).
 * ⚠️ 비구매자 공개 페이지 — 자료집·외부링크 url·공지·회고·쿠폰 등 구매자 전용은 응답 금지.
 */
export interface AllInOnePassLanding {
  id: number; // membershipId
  title: string;
  introduction: string | null;
  landingDescription: string | null; // 랜딩 전용 상세 JSON (FE 파싱)
  thumbnail: string | null;
  beginning: string | null; // 판매 시작 (ISO)
  deadline: string | null; // 판매 종료 (ISO)
  periodDays: number | null; // 이용 기간(일)
  plans: AllInOnePassPlan[];
  faqs: PassFaq[];
}

// ─── U-1 대시보드 ───

/** 대시보드 캘린더 항목 유형 (어드민 수기 입력 = GUERRILLA/MILESTONE, 챌린지는 자동 반영) */
export type PassCalendarEventType = 'CHALLENGE' | 'GUERRILLA' | 'MILESTONE';

/** 프로그램 참여 상태 (참여 전 / 참여 중 / 참여 완료) */
export type PassParticipationStatus = 'BEFORE' | 'IN_PROGRESS' | 'DONE';

/**
 * U-1 대시보드 월 캘린더 항목. CHALLENGE 는 진행 기간을 막대(레인)로, GUERRILLA/MILESTONE
 * 은 단일일 칩으로. 우측 패널은 선택일에 걸친 항목을 카드로 나열.
 * // TODO(BE): 대응 엔티티 없음(갭 B).
 */
export interface PassCalendarEvent {
  id: number;
  type: PassCalendarEventType;
  title: string;
  description: string | null;
  startDate: string; // ISO
  endDate: string | null; // 종료 시각 — 챌린지 막대 종료 / 게릴라세션·마일스톤 기간 종료(버튼 활성 판정)
  /** 게릴라세션·마일스톤 외부 링크. 챌린지는 id로 URL 조립하므로 없음 */
  url?: string | null;
  /** 챌린지 상세(`/program/challenge/{id}`)·대시보드 URL 구성용 (BE 팩트) */
  programId?: number | null;
  /** 챌린지 참여 인스턴스 id. null = 미참여(참여 전). (BE 팩트) */
  challengeApplicationId?: number | null;
  /** BE가 내려준 참여 상태(benefit/challenge 3분류). 있으면 FE 파생 대신 이걸 사용. */
  participationStatus?: PassParticipationStatus | null;
}

/**
 * 캘린더 렌더용 이벤트 — FE가 참여 상태를 파생(normalize)해 채운 형태.
 * 챌린지는 challengeApplicationId + endDate로 계산, 게릴라세션/마일스톤은 null.
 */
export type NormalizedCalendarEvent = PassCalendarEvent & {
  status: PassParticipationStatus | null;
};

/**
 * 사이드바 하단 외부 링크(오공고·플레이북·커뮤니티 등). 모든 탭 공통 레이아웃에 노출.
 * // TODO(BE): 대응 엔티티 없음(갭 B). 어드민 '외부 링크'에서 자유 추가/삭제.
 */
export interface PassExternalLink {
  id: number;
  name: string;
  url: string;
}

// ─── 내 신청 상세 (GET /membership-application/{applicationId} 응답 shape) ───

/** 연장 옵션 (연장 모달) */
export interface AllInOnePassOption {
  membershipOptionId: number;
  title: string;
  extensionDays: number;
  price: number;
  discount: number | null;
}

/** 내 신청 상세 — 대시보드 공통 소스. description 은 JSON(캘린더·외부링크·멘토링쿠폰) 문자열 */
export interface AllInOnePassApplicationDetail {
  membershipApplicationId: number;
  membershipId: number;
  title: string;
  startDate: string;
  endDate: string;
  periodDays: number;
  plan: { title: string; privilegeList: PassPrivilege[] };
  description: string;
  optionList: AllInOnePassOption[];
}

/** description(JSON) 파싱 결과 — 어드민 저장 형식 (게릴라/마일스톤·외부링크·멘토링쿠폰) */
export interface PassDescriptionBlob {
  calendarEvents: {
    id: string;
    startDate: string; // 시작(시간 포함)
    endDate: string; // 종료(시간 포함)
    type: 'GUERRILLA' | 'MILESTONE';
    title: string;
    url?: string | null;
  }[];
  externalLinks: { id: string; name: string; url: string }[];
  mentoringCouponAutoIssue: boolean;
}

// ─── 나의 패스 이용 > VOD ───

/** 세미나 VOD 1건 (seminar-vod 공개 API). url 은 외부 상세페이지. */
export interface PassVod {
  id: number;
  title: string;
  description: string | null;
  thumbnailUrl: string;
  url: string;
}

// ─── U-5 공지사항 / 패스 가이드 ───

/** 공지 유형 (공지사항 / 패스 가이드) */
export type PassNoticeType = 'NOTICE' | 'GUIDE';

/**
 * 올인원패스 공지 1건 (MembershipNotice). 본문은 평문(어드민 textarea)이라 줄바꿈 유지해 렌더.
 * // TODO(BE): 유저 조회 API 나오면 api/notices queryFn 만 교체.
 */
export interface AllInOnePassNotice {
  id: number;
  type: PassNoticeType;
  title: string;
  contents: string;
  createDate: string;
}

// ─── U-8 패스 ONLY 자료집 ───

/**
 * 올인원패스 전용 자료집 1건 (MembershipBenefit). introduction 은 설명+부가설명을 담은 JSON
 * 문자열이며 FE가 파싱한다(평문이면 설명으로 폴백). thumbnail 은 필드만 있고 디자인상 미노출.
 * // TODO(BE): 유저 조회 API 나오면 api/materials queryFn 만 교체.
 */
export interface PassMaterial {
  id: number;
  type: string;
  title: string;
  introduction: string;
  link: string;
  thumbnail?: string | null;
}

// ─── U-4 회고록 ───

/** 회고 질문 1개 (BE questions[]). review=기존 답변, membershipReviewId=수정 PATCH 대상. */
export interface RetroQuestion {
  membershipQuestionId: number;
  common: boolean; // 공통질문 여부
  question: string;
  answerGuide: string; // placeholder
  membershipReviewId: number | null; // 미작성이면 null → 신규 POST
  review: string | null; // 기존 답변
  submittedAt: string | null;
}

/**
 * 회고 회차 1건 (BE MembershipOrdinal). 노출/작성 상태·일정은 BE가 계산해 내려준다.
 * submissionDeadline === null = 마감 없음(상시 = 마무리 회고). visible=false면 questions=[].
 */
export interface PassRetrospectiveRound {
  id: number; // ordinalId
  th: number;
  visibleAt: string | null; // 노출 시작
  submissionDeadline: string | null; // 제출 마감(null=상시)
  visible: boolean; // 현재 노출 여부
  writable: boolean; // 현재 작성 가능 여부
  submitted: boolean; // 회차 질문 전부 응답?
  adminFeedback: string | null; // 운영자 코멘트(회차 단위)
  questions: RetroQuestion[];
}
