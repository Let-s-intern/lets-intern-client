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
 * [LC-3219-MEMBERSHIP] 멤버십 랜딩 진입 메뉴 라벨 — 시즌 종료 시 이 파일은 지우지 않고
 * 남긴다(다음 시즌 재사용). 내릴 때는 GlobalNavTopBar·NavBar 의 메뉴 블록만 제거한다.
 *
 * 문구는 "2026년 하반기 공채 멤버십". 시안 GNB 는 "출시"가 붙어 있었으나 상시 노출 메뉴라 뺐다.
 * 좌상단에 크기가 다른 반짝이 3개(✦ twinkle) + 글자 샤인 스윕을 입혀 신규/출시 메뉴를 강조한다.
 * 데스크톱 상단바(GlobalNavTopBar)와 모바일 드로어(SideNavItem) 두 곳에서 공용.
 */
function MembershipNavLabel({ className }: { className?: string }) {
  return (
    <span className={twMerge('relative inline-flex items-center', className)}>
      <Sparkle className="-left-3 -top-2.5 h-3 w-3" delay="0s" />
      <Sparkle className="-left-0.5 -top-2 h-2 w-2" delay="0.5s" />
      <Sparkle className="-top-2.5 left-1 h-1.5 w-1.5" delay="1s" />
      <span className="membership-shine">2026년 하반기 공채 멤버십</span>
    </span>
  );
}

export default MembershipNavLabel;
