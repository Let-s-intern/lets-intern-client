// 혜택 상세(#benefit-detail) 탭 메타. 탭별 데이터 소스가 다르다: 챌린지=membership CHALLENGE_ITEMS
// 재사용(목록 응답에 challengeType 없어 fetch 불가), 가이드북·라이브=GET /program?type= fetch, VOD=상세 링크 하드코딩·멘토링=쿠폰.

import type { PassProgramType } from '../types';

export type BenefitTabKey =
  | 'challenge'
  | 'guidebook'
  | 'live'
  | 'vod'
  | 'mentoring';

export interface BenefitDetailTab {
  key: BenefitTabKey;
  label: string;
  unit: string;
  titlePrefix: string;
  description: string;
  staticCount?: number;
  hideBadgeCount?: boolean;
  image?: string;
  imageMobile?: string;
  ctaLabel?: string;
  ctaHref?: string;
  programType?: PassProgramType;
}

export interface BenefitDetailCard {
  key: string;
  title: string;
  thumbnail: string | null;
  href?: string;
  ctaLabel?: string;
}

export const BENEFIT_TABS: BenefitDetailTab[] = [
  {
    key: 'challenge',
    label: '챌린지',
    unit: '종',
    titlePrefix: '취업 준비 필수 챌린지',
    description:
      '혼자 취업 준비하기 힘든 분들을 위해 렛츠커리어와 함께 해요!\n패스 기간동안 자유롭게 베이직 플랜으로 1번씩 참여 가능해요. 플랜 업그레이드를 원한다면, 차액만 결제하면 돼요.',
    programType: 'CHALLENGE',
  },
  {
    key: 'guidebook',
    label: '가이드북',
    unit: '종',
    titlePrefix: '취업 준비 핵심 가이드북',
    description:
      '경험 정리부터 서류와 면접까지! 패스 기간동안 자유롭게 이용할 수 있어요.\n지금 준비하는 단계에 맞는 가이드북으로, 나만의 속도에 맞춰 준비해보세요.',
    programType: 'GUIDEBOOK',
  },
  {
    key: 'live',
    label: 'LIVE 클래스',
    unit: '개',
    titlePrefix: '현직자 LIVE 클래스',
    description:
      '현직자가 실시간으로 전하는 LIVE 클래스예요.\n패스 이용 기간 동안 열리는 세션에 자유롭게 참여해 보세요.',
    programType: 'LIVE',
  },
  {
    key: 'vod',
    label: 'VOD',
    unit: '종',
    titlePrefix: '취준 꿀팁! VOD {n} 열람 가능',
    description:
      '현직자의 취업 준비 노하우를 영상으로 만나보세요.\n내게 필요한 주제를 골라 원하는 시간에 시청할 수 있어요.',
    staticCount: 20,
    programType: 'VOD',
  },
  {
    key: 'mentoring',
    label: '멘토링 쿠폰',
    unit: '장',
    titlePrefix: '현직자에게 직접 묻는 1:1 커피챗 · 멘토링 할인 쿠폰 월',
    description:
      '직무 고민부터 준비한 서류까지, 혼자 판단하기 어려운 부분을 현직자 멘토와 이야기해 보세요.\n패스 이용 기간 동안 매월 1장씩 발급되며, 쿠폰 1장당 멘토링 또는 커피챗 1회에 사용할 수 있어요.',
    staticCount: 1,
    hideBadgeCount: true,
    image: '/images/all-in-one-pass-benefit-coupon.png',
    imageMobile: '/images/all-in-one-pass-benefit-coupon-mobile.png',
    ctaLabel: '렛츠커리어 멘토 살펴보기',
    ctaHref: '/program?catalog=mentoring',
  },
];
