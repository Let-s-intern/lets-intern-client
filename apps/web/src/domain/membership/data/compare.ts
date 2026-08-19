import type { ChallengeType } from '@/schema';

// 비교(Compare) 섹션 — "공채 n번째 탈락자 vs 공채 단기간 합격자".
// 준비 안 한 사람(loser) vs 7월부터 준비한 합격자(winner)를 카드 2장으로 대비한다.
// 세미나 카드(SeminarSessionCard)의 위계 문법을 차용: winner=브랜드 강조, loser=톤다운.

export interface ComparePanel {
  /** 시각 위계 구분 — winner(강조) vs loser(톤다운) */
  kind: 'loser' | 'winner';
  /** 카드 그라데이션 헤더에 들어가는 제목 */
  heading: string;
  /** 체크 항목 — 각 유형의 준비 모습 3가지 */
  items: string[];
}

export const COMPARE = {
  badge: '왜 지금 시작해야 할까',
  /** 타이틀 3토막 — lead vs hi(강조) */
  titleLead: '공채 n번째 탈락자',
  titleVs: 'vs',
  titleHi: '공채 단기간 합격자',
  loser: {
    kind: 'loser',
    heading: '공채 n번째 탈락자',
    items: [
      '미루고 미루다 공고 뜨면 급하게 지원서 작성',
      '뭐부터 준비할지 몰라 하나도 제대로 못 챙김',
      '탈락 경험은 있지만 뭐가 부족한지 몰라 또 똑같이 준비',
    ],
  },
  winner: {
    kind: 'winner',
    heading: '7월부터 준비한 합격자',
    items: [
      '7월부터 플랜에 맞춰 철저하게 대비',
      '현직자 피드백과 무수한 연습으로 서류·면접 퀄리티 향상',
      '합격자 예시 참고해 미리 지원서 완성',
    ],
  },
} as const satisfies {
  badge: string;
  titleLead: string;
  titleVs: string;
  titleHi: string;
  loser: ComparePanel;
  winner: ComparePanel;
};

// ---------------------------------------------------------------------------
// 개별 구매 대비 올인원 패스 가격 비교 (시안 4.png)
// 위의 COMPARE 상수는 구 "탈락자 vs 합격자" 구조이며 5.4 에서 제거한다.
// ---------------------------------------------------------------------------

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
  { text: '렛츠런 스터디 참여', emphasized: false },
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
