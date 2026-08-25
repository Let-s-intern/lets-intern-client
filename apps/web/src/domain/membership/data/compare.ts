import type { ChallengeType } from '@/schema';

// 비교(Compare) 섹션 — 개별 구매 대비 올인원 패스 가격 비교 (시안 4.png).
//
// 금액은 하드코딩이다. 어드민에서 끌어오는 방식(lib/useComparePrices.ts)도 만들었으나
// 되돌렸다 — 조합에 든 챌린지 중 하나라도 모집 중이 아니면 합계를 믿을 수 없어 그 탭이
// 통째로 사라지고, 타입당 1회씩 조회가 붙어 진입 시 10회가 나갔다. 비교표는 시즌 시작 시
// 정해두고 가는 편이 화면이 안정적이다.
//
// 대신 어드민에서 가격을 바꿔도 여기는 따라가지 않는다. 시즌 중 할인이 바뀌면
// 이 파일을 고쳐 배포해야 한다.
//
// 값 출처: 각 챌린지의 베이직 플랜 정가·판매가 (2026-08-20 확인)

/** 좌측 개별 구매 카드에 한 줄로 그려지는 챌린지 1종 */
export interface CompareComboItem {
  /** 챌린지 타입. 지금은 식별용이고, 연동으로 되돌릴 때 조회 키가 된다 */
  challengeType: ChallengeType;
  /** 화면에 그릴 이름. 어드민 제목은 기수/시즌이 붙어 길어지므로 하드코딩한다 */
  name: string;
  /** 베이직 플랜 정가 */
  regularPrice: number;
  /** 베이직 플랜 판매가 = 화면의 "현재 할인가" */
  price: number;
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
        regularPrice: 150000,
        price: 128500,
      },
      {
        challengeType: 'ETC',
        name: '인적성 챌린지',
        regularPrice: 109000,
        price: 79000,
      },
    ],
  },
  {
    id: 'large-corp-portfolio',
    label: '대기업 자소서 + 포트폴리오',
    items: [
      {
        challengeType: 'PERSONAL_STATEMENT_LARGE_CORP',
        name: '대기업 자기소개서 챌린지',
        regularPrice: 150000,
        price: 128500,
      },
      {
        challengeType: 'PORTFOLIO',
        name: '포트폴리오 챌린지',
        regularPrice: 100000,
        price: 78500,
      },
    ],
  },
  {
    id: 'resume-statement-portfolio',
    label: '이력서 + 자소서 + 포트폴리오',
    items: [
      {
        challengeType: 'CAREER_START',
        name: '이력서 챌린지',
        regularPrice: 50000,
        price: 33000,
      },
      {
        challengeType: 'PERSONAL_STATEMENT',
        name: '자기소개서 챌린지',
        regularPrice: 95000,
        price: 73500,
      },
      {
        challengeType: 'PORTFOLIO',
        name: '포트폴리오 챌린지',
        regularPrice: 100000,
        price: 78500,
      },
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
  /** 의미가 끊기는 자리에서 자른다. 601px 이상에서는 한 줄로 붙는다(base.css 의 .brk) */
  subtitleLines: [
    '개별 구매보다 더 저렴한 가격으로',
    '혜택은 더 풍성하게 준비했어요.',
  ],
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

/** 조합의 개별 구매 합계 */
export function getComboTotal(combo: CompareCombo): number {
  return combo.items.reduce((sum, item) => sum + item.price, 0);
}
