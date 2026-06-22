// 플랜 섹션 데이터 (카드형 + 비교표). 가격·할인은 membership.ts MEMBERSHIP_PLANS 를 참조하고,
// 여기서는 카드 문구와 비교표 행만 관리한다.
import type { MembershipPlanKey } from "./membership";

export interface PlanFeature {
  /** 항목 텍스트 */
  text: string;
  /** 괄호 보조 설명 (muted) */
  sub?: string;
  /** 미포함(흐린) 항목이면 true */
  off?: boolean;
}

export interface PlanCard {
  key: MembershipPlanKey;
  /** 버튼 스타일 구분 */
  variant: "basic" | "standard" | "premium";
  /** 추천 강조 카드 */
  featured?: boolean;
  ribbon?: string;
  /** 타깃 설명 (줄바꿈 단위) */
  target: string[];
  features: PlanFeature[];
  button: string;
}

export const PLAN_CARDS: PlanCard[] = [
  {
    key: "BASIC",
    variant: "basic",
    target: ["스스로 동기부여하며", "달리는 공채 2트 이상"],
    features: [
      { text: "가이드북 3종", sub: "(경험정리·이력서·포트폴리오)" },
      { text: "렛츠런 스터디 3개월 무료" },
      { text: "취업 서비스 제휴 혜택 제공" },
      { text: "기타 챌린지 10% 할인" },
      { text: "세미나 VOD · 대기업 챌린지 할인 · 1:1 멘토링", off: true },
    ],
    button: "베이직 선택",
  },
  {
    key: "STANDARD",
    variant: "standard",
    featured: true,
    ribbon: "🔥 가장 많이 선택",
    target: ["챌린지로 확실한 동기부여가", "필요한 취준생"],
    features: [
      { text: "가이드북 6종 전체 열람" },
      { text: "렛츠런 스터디 3개월 무료" },
      { text: "세미나 VOD 20종 전체 열람" },
      { text: "취업 서비스 제휴 혜택 제공" },
      { text: "챌린지 할인", sub: "(대기업 25%·기타 15%)" },
      { text: "1:1 현직자 멘토링", off: true },
    ],
    button: "스탠다드 선택 →",
  },
  {
    key: "PREMIUM",
    variant: "premium",
    target: ["공채 1트, 혹은 합격이", "간절한 분께"],
    features: [
      { text: "가이드북 6종 전체 열람" },
      { text: "렛츠런 스터디 3개월 무료" },
      { text: "세미나 VOD 20종 전체 열람" },
      { text: "1:1 현직자 멘토링 총 3회" },
      { text: "취업 서비스 제휴 혜택 제공" },
      { text: "챌린지 할인", sub: "(대기업 30%·기타 20%)" },
    ],
    button: "프리미엄 선택",
  },
];

/** 취업 서비스 제휴 혜택(3플랜 공통) */
export const PARTNER_PERKS = [
  "산타토익 할인권 제공",
  "뷰인터 AI면접연습 이용권 제공",
  "슈퍼인턴 인재 등록 시 우선 검토 및 AI 서류 리포트 크레딧 제공",
];

export interface CompareRow {
  label: string;
  /** 값: "✓"=체크, "–"=대시, 문자열=텍스트, 배열=여러 줄 목록 */
  basic: string | string[];
  standard: string | string[];
  premium: string | string[];
}

export const COMPARE_ROWS: CompareRow[] = [
  {
    label: "가이드북 (경·이·자·포·면·인적성)",
    basic: "3종",
    standard: "6종 전체",
    premium: "6종 전체",
  },
  {
    label: "렛츠런 스터디 (페이백 X)",
    basic: "무료",
    standard: "무료",
    premium: "무료",
  },
  { label: "세미나 VOD 20종 전체", basic: "–", standard: "✓", premium: "✓" },
  { label: "1:1 현직자 멘토링", basic: "–", standard: "–", premium: "총 3회" },
  {
    label: "취업 서비스 제휴 혜택",
    basic: PARTNER_PERKS,
    standard: PARTNER_PERKS,
    premium: PARTNER_PERKS,
  },
  { label: "대기업 챌린지 할인", basic: "–", standard: "25%", premium: "30%" },
  {
    label: "기타 챌린지 할인 (자·포·마케팅·HR·기획)",
    basic: "10%",
    standard: "15%",
    premium: "20%",
  },
];
