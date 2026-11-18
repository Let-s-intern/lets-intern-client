import {
  BookOpen,
  CirclePlay,
  type LucideIcon,
  Puzzle,
  Repeat,
  UserRound,
  Video,
} from 'lucide-react';

export interface PassBenefit {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
}

/**
 * 홈 "올인원 패스 하나면" 혜택 카드. 시안(1118 Home) 문구 그대로.
 * 시안의 "추가혜택 1·2" 는 자리표시라 LIVE 클래스·플레이북으로 채운 초안이다
 */
export const PASS_BENEFITS_LEFT: PassBenefit[] = [
  {
    title: '챌린지 10종',
    description: '자소서·포폴부터 면접·인적성까지',
    icon: Puzzle,
    iconClassName: 'text-[#FF8A00]',
  },
  {
    title: '가이드북 7종',
    description: '막막할 때 꺼내 보는 취준 가이드',
    icon: BookOpen,
    iconClassName: 'text-[#2FA36B]',
  },
  {
    title: '1:1 멘토링 할인 쿠폰',
    description: '현직자 1:1 상담을 할인된 가격에',
    icon: UserRound,
    iconClassName: 'text-primary',
  },
];

export const PASS_BENEFITS_RIGHT: PassBenefit[] = [
  {
    title: 'VOD 20종',
    description: '현직자가 알려주는 직무·취업 노하우',
    icon: CirclePlay,
    iconClassName: 'text-[#3D7BFF]',
  },
  {
    title: 'LIVE 클래스',
    description: '현직자에게 실시간으로 묻고 배워요',
    icon: Video,
    iconClassName: 'text-system-error',
  },
  {
    title: '13주 플레이북',
    description: '주차별로 따라 하는 취준 로드맵',
    icon: Repeat,
    iconClassName: 'text-[#FF8A00]',
  },
];

/** 시안 "총 120일 이용 가능" */
export const PASS_USAGE_DAYS = 120;
