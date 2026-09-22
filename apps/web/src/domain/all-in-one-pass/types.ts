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

/** 이용권 프로그램 종류 (ProgramType). LIVE = 유저 화면 "무료 세미나" */
export type PassProgramType = 'CHALLENGE' | 'GUIDEBOOK' | 'VOD' | 'LIVE';

/** 이용권 방식 (MembershipPrivilegeType) */
export type PassPrivilegeType = 'ALL_IN_ONE' | 'LIMITED_COUNT';

/** 플랜에 포함된 이용권 하나 (MembershipPlanPrivilege) */
export interface PassPrivilege {
  id: number;
  programType: PassProgramType;
  privilegeType: PassPrivilegeType;
  /** 개수/횟수 (예: 챌린지 10종, 멘토링 1회). 이용권 뱃지 표기에 사용 */
  programCount: number;
}

/** 플랜 (MembershipPlan) */
export interface AllInOnePassPlan {
  id: number;
  title: string;
  description: string | null;
  price: number; // 정가
  discount: number; // 할인액
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
}

/**
 * 사이드바 하단 외부 링크(오공고·플레이북·커뮤니티 등). 모든 탭 공통 레이아웃에 노출.
 * // TODO(BE): 대응 엔티티 없음(갭 B). 어드민 '외부 링크'에서 자유 추가/삭제.
 */
export interface PassExternalLink {
  id: number;
  name: string;
  url: string;
}
