import {
  ArrowRightLeft,
  CirclePlay,
  Library,
  type LucideIcon,
  Puzzle,
  SquarePlay,
  UserRound,
} from 'lucide-react';

export interface PassBenefit {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
  /** 데스크톱 시안(1440) 좌표. 묶음 영역 왼쪽 위 기준 px */
  position: { left: number; top: number };
}

/**
 * 홈 "올인원 패스 하나면" 혜택 카드. 시안(1118 Home) 문구 그대로.
 * 시안의 "추가혜택 1·2" 는 자리표시라 LIVE 클래스·플레이북으로 채운 초안이다
 */
export const PASS_BENEFITS: PassBenefit[] = [
  {
    title: '챌린지 10종',
    description: '자소서·포폴부터 면접·인적성까지',
    icon: Puzzle,
    iconClassName: 'fill-[#FF7A00] text-[#FF7A00]',
    position: { left: 64, top: 0 },
  },
  {
    title: '가이드북 7종',
    description: '막막할 때 꺼내 보는 취준 가이드',
    icon: Library,
    iconClassName: 'text-[#2FA36B]',
    position: { left: 0, top: 138 },
  },
  {
    title: '1:1 멘토링 할인 쿠폰',
    description: '현직자 1:1 상담을 할인된 가격에',
    icon: UserRound,
    iconClassName: 'fill-[#5B5FD6] text-[#5B5FD6]',
    position: { left: 38, top: 271 },
  },
  {
    title: 'VOD 20종',
    description: '현직자가 알려주는 직무·취업 노하우',
    icon: CirclePlay,
    iconClassName: 'text-[#4A76FF]',
    position: { left: 632, top: 0 },
  },
  {
    title: 'LIVE 클래스',
    description: '현직자에게 실시간으로 묻고 배워요',
    icon: SquarePlay,
    iconClassName: 'fill-[#F04438] text-white',
    position: { left: 696, top: 138 },
  },
  {
    title: '13주 플레이북',
    description: '주차별로 따라 하는 취준 로드맵',
    icon: ArrowRightLeft,
    iconClassName: 'text-[#FF7A00]',
    position: { left: 632, top: 276 },
  },
];

/** 시안 "총 120일 이용 가능" */
export const PASS_USAGE_DAYS = 120;
