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
 * 올인원패스 진입 메뉴 라벨. 문구는 useMembershipNavEntry 가 정한다 — 판매 중인 패스가
 * 있으면 그 패스 제목, 없으면 "올인원패스". 랜딩·결제 시트와 같은 이름으로 맞춰,
 * 사용자가 메뉴에서 본 것과 결제창에서 본 것을 같은 상품으로 인지하게 한다.
 * 좌상단에 크기가 다른 반짝이 3개(✦ twinkle) + 글자 샤인 스윕을 입혀 신규/출시 메뉴를 강조한다.
 * 데스크톱 상단바(GlobalNavTopBar)와 모바일 드로어(SideNavItem) 두 곳에서 공용.
 */
function MembershipNavLabel({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <span className={twMerge('relative inline-flex items-center', className)}>
      <Sparkle className="-left-3 -top-2.5 h-3 w-3" delay="0s" />
      <Sparkle className="-left-0.5 -top-2 h-2 w-2" delay="0.5s" />
      <Sparkle className="-top-2.5 left-1 h-1.5 w-1.5" delay="1s" />
      <span className="membership-shine">{title}</span>
    </span>
  );
}

export default MembershipNavLabel;
