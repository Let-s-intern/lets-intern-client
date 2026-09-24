// 개편 시안 6 — 패스 혜택 4카드와 "자세히 보기" 모달 4종.
//
// 이 파일이 드는 것은 **카드 문구와 모달 머리말**뿐이다. 모달 본문에 들어가는 목록은
// 기존 섹션이 쓰던 데이터를 그대로 가리킨다 — 챌린지 10종·가이드북 7종·VOD·멘토링
// 쿠폰을 여기에 다시 적으면 상품이 바뀔 때 두 곳이 어긋난다.
//
// 배지 번호가 기존 섹션과 다르다. 섹션 시절에는 `PASS BENEFIT 02·03·04·06` 이었고
// 시안 6-1~6-4 는 `01~04` 다. 혜택이 4개로 정리되면서 번호가 다시 매겨졌으므로
// **시안 번호를 따른다.**

import { CHALLENGE_ITEMS } from './challengeModalItems';
import { GUIDEBOOK_ITEMS } from './guidebooks';
import { MARKETER_VOD, type MarketerVodCard } from './marketerVod';
import { MENTORING_COUPON } from './mentoringCoupon';

export type PassBenefitId = 'challenge' | 'guidebook' | 'vod' | 'mentoring';

export interface PassBenefitModalHead {
  /** `PASS BENEFIT 01` 형태 */
  badge: string;
  eyebrow: string;
  titleLines: readonly string[];
  subLines: readonly string[];
}

export interface PassBenefitEntry {
  id: PassBenefitId;
  /** 카드 좌상단 아이콘. 시안이 그림이 아니라 이모지로 그려져 있다 */
  icon: string;
  cardTitle: string;
  cardBody: string;
  modal: PassBenefitModalHead;
}

/*
 * VOD 4종은 모두 상세 주소를 받아 `MARKETER_VOD.cards` 에 들어가 있다.
 * 예전에는 주소를 못 받은 두 장을 여기서 자리만 잡아 두고 걸렀는데, 이제 거를 것이 없다.
 */
export const PASS_BENEFIT_VOD_CARDS: readonly MarketerVodCard[] =
  MARKETER_VOD.cards;

/** 모달 본문이 쓰는 기존 목록. 여기서만 가리키고 내용은 원본 파일이 든다 */
export const PASS_BENEFIT_SOURCES = {
  challenge: CHALLENGE_ITEMS,
  guidebook: GUIDEBOOK_ITEMS,
  vod: PASS_BENEFIT_VOD_CARDS,
  mentoring: MENTORING_COUPON,
} as const;

export const PASS_INTRO = {
  /** 인트로 1단 */
  leadLines: ['초안을 만드는 것부터', '경험을 점검하고, 실제 지원하기까지'],
  leadSub: '혼자 준비하기엔 해야 할 일이 너무 많으니까',
  /** 인트로 2단 */
  bridge: '렛츠커리어가 하나에 모두 담았습니다!',
  /** 인트로 3단 */
  title: '마케팅 올인원 패스',
  bodyLines: [
    '한 번의 패스 참여로 현재 오픈되어 있는 필요한 챌린지에 자유롭게 참여하고,',
    '가이드북 · 현직자 세미나 · 1:1 멘토링 등을 활용해',
  ],
  /** 본문 마지막 줄만 굵다 */
  bodyStrong: '지금, 내 시작점부터 취업까지 필요한 준비를 이어갈 수 있습니다.',
  cardCtaLabel: '자세히 보기',
  ctaLabel: '마케팅 올인원 패스 혜택보기',
  /*
   * 하단 버튼이 어디로 가는지 시안에 적혀 있지 않다. 패스에 무엇이 포함되는지 값과 함께
   * 한 줄씩 늘어놓는 자리는 가격 섹션(`#pricing`)뿐이라 그쪽으로 보낸다.
   * 이 섹션 자신이 "혜택" 섹션이므로 위로 되돌리는 앵커는 뜻이 없다.
   *
   * 예전에는 `#compare` 였다. 그 섹션이 PricingSection 으로 바뀌며 id 가 사라졌고,
   * 없는 id 를 가리키면 눌러도 아무 일이 일어나지 않는다.
   */
  ctaAnchor: 'pricing',
  anchorId: 'pass-intro',
} as const;

export const PASS_BENEFITS_MODALS: readonly PassBenefitEntry[] = [
  {
    id: 'challenge',
    icon: '✍️',
    cardTitle: '챌린지 10종 자유 참여',
    cardBody:
      '경험정리 · 서류 완성 · 포트폴리오 · 면접까지, 지금 필요한 챌린지를 골라 참여합니다.',
    modal: {
      badge: 'PASS BENEFIT 01',
      eyebrow: '10 CHALLENGES',
      titleLines: ['취준 필수 챌린지 참여 10종 - 베이직'],
      subLines: [
        '진단 결과에 따라 10주 합격 플레이북을 활용해 나의 단계에 맞는 챌린지에 참여하세요.',
        '베이직보다 높은 단계의 플랜은 차액 결제 후 이용가능해요.',
      ],
    },
  },
  {
    id: 'guidebook',
    icon: '📚',
    cardTitle: '가이드북 7종 제공',
    cardBody: '혼자 준비할 때 막히는 지점을 채워주는 마케팅 취준 가이드북.',
    modal: {
      badge: 'PASS BENEFIT 02',
      // 시안은 `6 GUIDE BOOK` 이지만 제목도 카드도 7종이다. 배지 쪽이 오타다.
      eyebrow: '7 GUIDE BOOK',
      titleLines: ['취준 필수 가이드북 7종'],
      subLines: ['패스 이용기간 동안 자유롭게 이용할 수 있어요.'],
    },
  },
  {
    id: 'vod',
    icon: '🎥',
    cardTitle: '현직자 Live 세미나 · VOD',
    cardBody:
      '직무 · 산업 · 서류 · 면접 인사이트를 현직 마케터에게 직접 듣습니다.',
    modal: {
      badge: 'PASS BENEFIT 03',
      eyebrow: MARKETER_VOD.eyebrow,
      // 제목의 "N종" 은 원본 데이터를 따른다. 링크를 받아 카드가 늘면 거기서 함께 고친다.
      titleLines: [MARKETER_VOD.title],
      subLines: [MARKETER_VOD.sub],
    },
  },
  {
    id: 'mentoring',
    icon: '👤',
    cardTitle: '현직자 1:1 멘토링',
    cardBody: '내 경험과 결과물이 실제 지원 가능한 수준인지 검증받습니다.',
    modal: {
      badge: 'PASS BENEFIT 04',
      eyebrow: MENTORING_COUPON.eyebrow,
      titleLines: MENTORING_COUPON.titleLines,
      subLines: [MENTORING_COUPON.sub],
    },
  },
];
