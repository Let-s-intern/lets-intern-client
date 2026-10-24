/** 올인원패스 유저 대시보드 타입. BE 도메인명은 membership이지만 FE는 올인원패스/Pass 네이밍(변환은 api 매퍼에서만). */

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
  id: number;
  title: string;
  description: string | null;
  price: number;
  discount: number | null;
  privileges: PassPrivilege[];
}

// ─── 랜딩(구매) 페이지 ───

/** 올인원패스 FAQ 1건 (어드민 MEMBERSHIP FAQ 중 패스별 선택분). category 로 그룹핑 가능. */
export interface PassFaq {
  id: number;
  question: string;
  answer: string;
  category: string | null;
}

/** 랜딩(구매) 페이지 상품 상세. 공개 API `GET /api/v1/membership/{id}`. ⚠️ 비구매자 공개 — 자료집·외부링크url·공지·회고·쿠폰 등 구매자 전용 응답 금지. */
export interface AllInOnePassLanding {
  id: number;
  title: string;
  introduction: string | null;
  landingDescription: string | null;
  thumbnail: string | null;
  beginning: string | null;
  deadline: string | null;
  periodDays: number | null;
  plans: AllInOnePassPlan[];
  faqs: PassFaq[];
}

// ─── 대시보드 ───

/** 대시보드 캘린더 항목 유형 (어드민 수기 입력 = GUERRILLA/MILESTONE, 챌린지는 자동 반영) */
export type PassCalendarEventType = 'CHALLENGE' | 'GUERRILLA' | 'MILESTONE';

/** 프로그램 참여 상태 (참여 전 / 참여 중 / 참여 완료) */
export type PassParticipationStatus = 'BEFORE' | 'IN_PROGRESS' | 'DONE';

/** 대시보드 월 캘린더 항목. CHALLENGE는 진행 기간 막대(레인), GUERRILLA/MILESTONE은 단일일 칩. 우측 패널은 선택일 항목을 카드로 나열. */
export interface PassCalendarEvent {
  id: number;
  type: PassCalendarEventType;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  url?: string | null;
  programId?: number | null;
  challengeApplicationId?: number | null; // null = 미참여
  participationStatus?: PassParticipationStatus | null;
}

/** 캘린더 렌더용 이벤트 — FE가 참여 상태를 파생해 채운 형태. 챌린지는 challengeApplicationId + endDate로 계산, 게릴라세션/마일스톤은 null. */
export type NormalizedCalendarEvent = PassCalendarEvent & {
  status: PassParticipationStatus | null;
};

/** 사이드바 하단 외부 링크(오공고·플레이북·커뮤니티 등). 모든 탭 공통 레이아웃에 노출. 어드민 '외부 링크'에서 자유 추가/삭제. */
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
    startDate: string;
    endDate: string;
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

// ─── 공지사항 / 패스 가이드 ───

/** 공지 유형 (공지사항 / 패스 가이드) */
export type PassNoticeType = 'NOTICE' | 'GUIDE';

/** 올인원패스 공지 1건 (MembershipNotice). 본문은 평문(어드민 textarea)이라 줄바꿈 유지해 렌더. */
export interface AllInOnePassNotice {
  id: number;
  type: PassNoticeType;
  title: string;
  contents: string;
  createDate: string;
}

// ─── 패스 ONLY 자료집 ───

/** 올인원패스 전용 자료집 1건 (MembershipBenefit). introduction은 설명+부가설명 JSON 문자열을 FE가 파싱(평문이면 설명으로 폴백). thumbnail은 필드만 있고 디자인상 미노출. */
export interface PassMaterial {
  id: number;
  type: string;
  title: string;
  introduction: string;
  link: string;
  thumbnail?: string | null;
}

// ─── 회고록 ───

/** 회고 질문 1개 (BE questions[]) */
export interface RetroQuestion {
  membershipQuestionId: number;
  question: string;
  answerGuide: string;
  membershipReviewId: number | null;
  review: string | null;
}

/** 회고 회차 1건 (BE MembershipOrdinal). 상태·일정은 BE 계산값. visible=false면 questions=[]. */
export interface PassRetrospectiveRound {
  id: number;
  th: number;
  visibleAt: string | null;
  submissionDeadline: string | null;
  visible: boolean;
  writable: boolean;
  submitted: boolean;
  adminFeedback: string | null;
  questions: RetroQuestion[];
}
