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
 * 시안 6-3 은 VOD 를 4장 그리는데 지금 데이터에는 2장뿐이다. 모자란 두 장은 상품 링크를
 * 받지 못했다 (PRD 7절 C). 자리만 만들어 두고 `url` 이 없으면 목록에서 빠진다 —
 * 링크가 없는 카드를 그려 두면 눌러도 아무 일이 없거나 엉뚱한 곳으로 가고, 그 자리에서
 * 이탈한다.
 *
 * 링크를 받으면 `url` 과 `banner` 두 줄을 채우면 카드가 켜진다. 배너 이미지 파일도
 * 함께 받아 `public/images/membership/` 에 넣어야 한다.
 */
const PENDING_VOD_CARDS: MarketerVodCard[] = [
  {
    banner: '',
    bannerAlt:
      '렛츠커리어 라이브 클래스 무료 세미나. 마케팅 포트폴리오, 어떤 경험을 담아야 합격할까? 라라스윗 합격자가 알려주는 그로스 마케팅 실무와 포트폴리오 작성법.',
    title: '라라스윗 그로스 마케터 2명이 공개하는 합격 포트폴리오·면접 전략',
    bullets: [
      '합격 포트폴리오 구성과 경험 정리법',
      '강점을 살리는 면접 답변 전략',
      '인턴에서 정규직으로 전환한 노하우',
    ],
    regularPrice: 29000,
  },
  {
    banner: '',
    bannerAlt:
      '렛츠커리어 라이브 클래스 무료 세미나. 마케팅 경험, 도대체 얼마나 있어야 합격할까? 현직 인사담당자가 말하는 마케팅 합격 기준부터 경험 진단, 지금 당장 해야 할 준비까지.',
    title: '렛츠커리어 CEO 쥬디 멘토의 마케팅 경험 합격 기준',
    bullets: [
      '마케팅 취업에서 평가자가 보는 진짜 합격 기준',
      '내 경험이 합격 수준인지 직접 진단하는 법',
      '진단 결과에 따라 지금 당장 해야 할 준비',
    ],
    regularPrice: 29000,
  },
];

/** 모달 본문에 그릴 VOD 카드. 상품 링크가 있는 것만 남는다 */
export const PASS_BENEFIT_VOD_CARDS: readonly MarketerVodCard[] = [
  ...MARKETER_VOD.cards,
  ...PENDING_VOD_CARDS,
].filter((card) => Boolean(card.url));

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
   * 한 줄씩 늘어놓는 자리는 가격 비교 섹션(`#compare`)뿐이라 그쪽으로 보낸다.
   * 이 섹션 자신이 "혜택" 섹션이므로 위로 되돌리는 앵커는 뜻이 없다.
   */
  ctaAnchor: 'compare',
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
