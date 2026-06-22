// 혜택 섹션 카드 데이터(핵심 5종). 카드 그리드의 노출 문구를 관리한다.
// 모달 상세 본문은 표현(JSX)이 풍부해 BenefitModal.tsx 에 id 로 매핑한다.
//
// 제휴 3종(산타토익·뷰인터·슈퍼인턴)은 전용 "멤버 전용 제휴 서비스 혜택" 섹션
// (partners.ts / PartnerBenefitsSection)으로 이동. 헤드라인 "혜택 8가지" = 그리드 5 + 제휴 3.

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
    title: '챌린지 최대 30% 할인',
    desc: '이력서·자소서·포트폴리오 완성 챌린지를 멤버 전용가로. 대기업 챌린지 최대 30%, 그 외 최대 20% 할인.',
    tagline: '최대 30% 멤버 전용가',
    more: '할인 챌린지 보기 →',
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
    desc: '매주 인증하며 루틴을 잡는 렛츠런 스터디에 3개월간 무료로 참여하세요. 혼자가 아니라 함께 달립니다.',
    tagline: '3개월 자유 참여',
    more: '자세히 보기 →',
  },
  {
    id: 'vod',
    iconSvg: '/images/membership/ic-vod.svg',
    iconClass: 'ic-ice',
    title: '세미나 VOD 20종 무료',
    pill: { text: 'NEW', cls: 'pill-new' },
    desc: '현직자 세미나 VOD 라이브러리를 멤버십 기간 동안 전부 무료로 시청할 수 있어요.',
    tagline: '전 강의 무료 시청',
    more: '자세히 보기 →',
  },
  {
    id: 'mentoring',
    iconSvg: '/images/membership/ic-mentoring.svg',
    iconClass: 'ic-blue',
    title: '1:1 현직자 멘토링 제공',
    pill: { text: '프리미엄', cls: 'pill-coral' },
    desc: '지원 직무 현직자에게 서류·면접을 3개월간 월 1회, 총 3회 1:1로 피드백 받아요.',
    tagline: '총 3회 1:1 멘토링',
    more: '자세히 보기 →',
  },
];
