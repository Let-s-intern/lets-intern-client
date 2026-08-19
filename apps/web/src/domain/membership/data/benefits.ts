// 혜택 섹션의 노출 문구. 시안 6-0(헤더) / 7-1~7-4(블록 소제목)에서 옮겼다.
//
// 제휴 3종(산타토익·뷰인터·슈퍼인턴)은 전용 "멤버 전용 제휴 서비스 혜택" 섹션
// (partners.ts / PartnerBenefitsSection)으로 분리.

/** 헤드라인 한 조각. hl 이면 포인트 컬러로 강조한다 */
export interface HeadSegment {
  text: string;
  hl?: boolean;
}

/** 블록 소제목 — lines 는 줄바꿈 단위 */
export interface BenefitBlockHead {
  lines: HeadSegment[][];
  sub?: string;
}

/** 섹션 헤더 (시안 6-0) */
export const BENEFITS_HEADER = {
  badge: '공채 준비 올인원 패스 혜택',
  titleTop: '하반기 공채 준비에 필요한',
  titleMain: [
    { text: '올인원 패스', hl: true },
    { text: ' 하나로 누리는 ' },
    { text: '모든 혜택', hl: true },
  ] satisfies HeadSegment[],
  sub: '개별 구매보다 더 저렴한 가격으로 혜택은 더 풍성하게 준비했어요.',
};

/** 블록 1 — 가이드북 (시안 7-1) */
export const GUIDEBOOK_BLOCK_HEAD: BenefitBlockHead = {
  lines: [[{ text: '취업 준비 핵심 단계 가이드북 6종 무료 제공' }]],
  sub: '올패스 이용기간동안 전종 모두 이용가능합니다.',
};

/** 블록 2 — 챌린지 7종 (시안 7-2) */
export const CORE_CHALLENGE_BLOCK_HEAD: BenefitBlockHead = {
  lines: [
    [{ text: '혼자서 하기 힘들다면?' }],
    [
      { text: '취업 준비 핵심! ' },
      { text: '챌린지 7종 1회씩 무료 참여', hl: true },
      { text: ' 혜택' },
    ],
  ],
  sub: '공채 시즌에 꼭 필요한 것만 모두 모았습니다.',
};

/** 블록 3 — 직무별 챌린지 3종 (시안 7-3) */
export const JOB_CHALLENGE_BLOCK_HEAD: BenefitBlockHead = {
  lines: [
    [{ text: '현직자와 함께하는 ' }, { text: '직무별 챌린지', hl: true }],
    [{ text: '3종 1회씩 ' }, { text: '무료 참여', hl: true }, { text: ' 혜택' }],
  ],
};

/** 블록 4 — 렛츠런 스터디 (시안 7-4) */
export const STUDY_BLOCK_HEAD: BenefitBlockHead = {
  lines: [
    [
      { text: '취업 준비가 혼자 힘들지 않도록 ' },
      { text: '렛츠런 스터디 참여', hl: true },
    ],
  ],
};

// 아래 BENEFIT_CARDS 는 개편 전 카드 그리드(4장 + BenefitModal) 데이터다.
// 모달 폐기 결정 전까지 남겨 둔다.

export interface BenefitPill {
  text: string;
  cls: string;
}

export interface BenefitCard {
  /** 모달 매핑 키 */
  id: string;
  /** 마스크로 단색 렌더할 아이콘 SVG 경로 */
  iconSvg: string;
  iconClass: string;
  title: string;
  pill?: BenefitPill;
  desc: string;
  tagline: string;
  /** 태그라인을 흐리게(준비 중 등) */
  taglineMuted?: boolean;
  /** 더보기 버튼 라벨 */
  more: string;
}

export const BENEFIT_CARDS: BenefitCard[] = [
  {
    id: 'challenge',
    iconSvg: '/images/membership/ic-challenge.svg',
    iconClass: 'ic-yel',
    title: '챌린지 종류별 1회 무료 참여',
    desc: '이력서·자소서·포트폴리오부터 인적성·대기업 자소서 완성 챌린지까지, 챌린지 9종을 종류별 1회씩 베이직 플랜으로 무료 참여해보세요!',
    tagline: '종류별 1회 · 베이직 플랜 무료',
    more: '참여 가능 챌린지 보기 →',
  },
  {
    id: 'guidebook',
    iconSvg: '/images/membership/ic-guidebook.svg',
    iconClass: 'ic-peach',
    title: '가이드북 6종 모두 제공',
    desc: '경험정리·이력서·자기소개서·포트폴리오·면접·인적성 가이드북을 멤버십 기간 내내 제한 없이 열람해요.',
    tagline: '시즌 내내 무제한 열람',
    more: '자세히 보기 →',
  },
  {
    id: 'study',
    iconSvg: '/images/membership/ic-study.svg',
    iconClass: 'ic-lav',
    title: '렛츠런 스터디 무료 참여',
    desc: '매주 인증하며 루틴을 잡는 렛츠런 스터디에 1개월간 무료로 참여하세요. 혼자가 아니라 함께 달립니다.',
    tagline: '1개월 무료 참여',
    more: '자세히 보기 →',
  },
  {
    id: 'vod',
    iconSvg: '/images/membership/ic-vod.svg',
    iconClass: 'ic-ice',
    title: '세미나 VOD 20종 무료',
    pill: { text: '옵션 구매자 대상', cls: 'pill-soon' },
    desc: '현직자 세미나 VOD 20종을 멤버십 기간 동안 전부 무료로 시청할 수 있어요.',
    tagline: '전 강의 무료 시청',
    more: '자세히 보기 →',
  },
];
