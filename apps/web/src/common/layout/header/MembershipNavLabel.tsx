import { twMerge } from '@/lib/twMerge';

/** 4각 반짝이(✦) 아이콘. 위치/크기는 className, 깜빡임 타이밍은 delay로 분산. */
function Sparkle({ className, delay }: { className: string; delay: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      style={{ animationDelay: delay }}
      className={twMerge('membership-sparkle absolute', className)}
    >
      <path
        d="M12 0c0 6.6-5.4 12-12 12 6.6 0 12 5.4 12 12 0-6.6 5.4-12 12-12-6.6 0-12-5.4-12-12Z"
        fill="#4D55F5"
      />
    </svg>
  );
}

/**
 * "2026 하반기 멤버십 출시" 네비 메뉴 라벨.
 * 좌상단에 크기가 다른 반짝이 3개(✦ twinkle) + 글자 샤인 스윕을 입혀 신규/출시 메뉴를 강조한다.
 * 데스크톱 상단바(GlobalNavTopBar)와 모바일 드로어(SideNavItem) 두 곳에서 공용.
 */
function MembershipNavLabel({ className }: { className?: string }) {
  return (
    <span className={twMerge('relative inline-flex items-center', className)}>
      <Sparkle className="-left-3 -top-2.5 h-3 w-3" delay="0s" />
      <Sparkle className="-left-0.5 -top-2 h-2 w-2" delay="0.5s" />
      <Sparkle className="-top-2.5 left-1 h-1.5 w-1.5" delay="1s" />
      <span className="membership-shine">2026 하반기 멤버십 출시</span>
    </span>
  );
}

export default MembershipNavLabel;
