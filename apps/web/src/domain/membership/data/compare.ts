import type { ChallengeType } from '@/schema';

// 비교(Compare) 섹션 — 개별 구매 대비 올인원 패스 가격 비교 (시안 4.png).
// 금액은 어드민 챌린지 가격에서 끌어오므로(lib/useComparePrices.ts) 여기엔 문구만 둔다.

/** 좌측 개별 구매 카드에 한 줄로 그려지는 챌린지 1종 */
export interface CompareComboItem {
  /** 가격을 끌어올 챌린지 타입 — /challenge/active?type= 의 인자 */
  challengeType: ChallengeType;
  /** 화면에 그릴 이름. 어드민 제목은 기수/시즌이 붙어 길어지므로 하드코딩한다 */
  name: string;
}

/** 탭 1개 = 개별 구매 조합 1종 */
export interface CompareCombo {
  id: string;
  /** 탭 라벨 */
  label: string;
  items: CompareComboItem[];
}

/** 탭 3종 (시안 4.png 상단 알약) */
export const COMPARE_COMBOS: CompareCombo[] = [
  {
    id: 'large-corp-aptitude',
    label: '대기업 자소서 + 인적성',
    items: [
      {
        challengeType: 'PERSONAL_STATEMENT_LARGE_CORP',
        name: '대기업 자기소개서 챌린지',
      },
      { challengeType: 'ETC', name: '인적성 챌린지' },
    ],
  },
  {
    id: 'large-corp-portfolio',
    label: '대기업 자소서 + 포트폴리오',
    items: [
      {
        challengeType: 'PERSONAL_STATEMENT_LARGE_CORP',
        name: '대기업 자기소개서 챌린지',
      },
      { challengeType: 'PORTFOLIO', name: '포트폴리오 챌린지' },
    ],
  },
  {
    id: 'resume-statement-portfolio',
    label: '이력서 + 자소서 + 포트폴리오',
    items: [
      { challengeType: 'CAREER_START', name: '이력서 챌린지' },
      { challengeType: 'PERSONAL_STATEMENT', name: '자기소개서 챌린지' },
      { challengeType: 'PORTFOLIO', name: '포트폴리오 챌린지' },
    ],
  },
];

/** 우측 올인원 카드 항목 — 첫 줄만 흰 박스로 강조한다(시안) */
export interface AllInOneItem {
  text: string;
  /** true 면 흰 박스 + 체크 아이콘, false 면 플러스 아이콘 */
  emphasized: boolean;
}

export const ALL_IN_ONE_ITEMS: AllInOneItem[] = [
  { text: '챌린지 10종', emphasized: true },
  { text: '가이드북 6종', emphasized: false },
  { text: '이대로만 따라오면 합격 13주 플레이북', emphasized: false },
  { text: '1:1 멘토링 50% 할인 혜택 등', emphasized: false },
];

/** 섹션 문구 — 가격만 연동하고 카피는 하드코딩한다 */
export const COMPARE_COPY = {
  titleLead: '필요한 프로그램 2개만 골라도',
  titleHi: '올인원 패스가 더 저렴해요',
  subtitle: '개별 구매보다 더 저렴한 가격으로 혜택은 더 풍성하게 준비했어요.',
  individualLabel: '개별 구매',
  allInOneLabel: '올인원 패스로 구매',
  /** 좌측 각 줄의 금액 앞 라벨 */
  priceCaption: '현재 할인가',
  /** 모집 중인 기수가 없어 가격을 못 가져온 항목 */
  priceUnavailable: '현재 모집 중인 기수 없음',
  /** 좌측 합계 — {n} 은 항목 수로 치환한다 */
  totalCaption: '{n}개 개별 구매 시',
  /** 우측 합계 라벨 */
  allInOneTotalCaption: '하반기 공채 준비 올인원 패스',
} as const;
