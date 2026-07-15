import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * 배너 위 반짝임(✦) 하나. 위치·크기·색·글로우·속도·애니메이션 종류를 개별 지정해
 * 단조롭지 않게(제각각 크기/색/타이밍) 반짝이도록 한다.
 */
type Spark = {
  left: number; // %
  top: number; // %
  size: number; // px
  color: string;
  glow: string;
  dur: number; // s
  delay: number; // s
  pop?: boolean; // true면 더 크게 튀는 pop 애니메이션
};

/**
 * 흰색 + 연블루만 사용(골드 제외). 글자를 가리지 않도록 배너의 빈 영역에만 배치한다:
 * 왼쪽 배경 여백 / 헤드라인 위 / 헤드라인–티켓 사이 세로 통로 / 티켓 위·오른쪽 shine 영역.
 * pop=true 는 얇은 4방향 광선(✨ 글린트), 나머지는 작은 4각 반짝이(✦). 크기 작게·속도 느리게.
 */
const SPARKLES: Spark[] = [
  // 왼쪽 배경 여백
  {
    left: 6,
    top: 23,
    size: 11,
    color: '#ffffff',
    glow: 'rgba(255,255,255,.95)',
    dur: 3.6,
    delay: 0.0,
  },
  {
    left: 4,
    top: 50,
    size: 9,
    color: '#c9d1ff',
    glow: 'rgba(150,165,255,.9)',
    dur: 4.4,
    delay: 1.4,
  },
  {
    left: 12,
    top: 62,
    size: 20,
    color: '#ffffff',
    glow: 'rgba(255,255,255,1)',
    dur: 3.8,
    delay: 0.7,
    pop: true,
  },
  {
    left: 15,
    top: 35,
    size: 10,
    color: '#ffffff',
    glow: 'rgba(255,255,255,.95)',
    dur: 4.1,
    delay: 2.3,
  },
  // 헤드라인 위 여백
  {
    left: 26,
    top: 10,
    size: 9,
    color: '#c9d1ff',
    glow: 'rgba(150,165,255,.9)',
    dur: 4.2,
    delay: 1.8,
  },
  {
    left: 46,
    top: 9,
    size: 11,
    color: '#ffffff',
    glow: 'rgba(255,255,255,.95)',
    dur: 3.5,
    delay: 2.7,
  },
  // 헤드라인–티켓 사이 세로 통로 (글자 없는 여백)
  {
    left: 62,
    top: 21,
    size: 22,
    color: '#ffffff',
    glow: 'rgba(255,255,255,1)',
    dur: 3.6,
    delay: 0.4,
    pop: true,
  },
  {
    left: 61,
    top: 45,
    size: 10,
    color: '#c9d1ff',
    glow: 'rgba(150,165,255,.95)',
    dur: 4.5,
    delay: 1.2,
  },
  {
    left: 63,
    top: 64,
    size: 12,
    color: '#ffffff',
    glow: 'rgba(255,255,255,.95)',
    dur: 3.9,
    delay: 2.4,
  },
  // 티켓 위쪽 여백
  {
    left: 70,
    top: 9,
    size: 10,
    color: '#ffffff',
    glow: 'rgba(255,255,255,.95)',
    dur: 4.3,
    delay: 2.9,
  },
  {
    left: 84,
    top: 11,
    size: 20,
    color: '#ffffff',
    glow: 'rgba(255,255,255,1)',
    dur: 3.7,
    delay: 1.0,
    pop: true,
  },
  // 티켓 오른쪽 shine 영역
  {
    left: 97,
    top: 39,
    size: 22,
    color: '#ffffff',
    glow: 'rgba(255,255,255,1)',
    dur: 3.5,
    delay: 1.6,
    pop: true,
  },
  {
    left: 96,
    top: 59,
    size: 10,
    color: '#c9d1ff',
    glow: 'rgba(150,165,255,.9)',
    dur: 4.4,
    delay: 0.8,
  },
];

/** 큰 글린트: 얇은 4방향 광선 + 밝은 코어(✨). 작은 별: 통통한 4각 반짝이(✦). */
const Sparkle = ({ s }: { s: Spark }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 100 100"
    className={`promo-banner-sparkle${s.pop ? 'is-pop' : ''} pointer-events-none absolute`}
    style={
      {
        left: `${s.left}%`,
        top: `${s.top}%`,
        width: `${s.size}px`,
        height: `${s.size}px`,
        animationDuration: `${s.dur}s`,
        animationDelay: `${s.delay}s`,
        '--pb-glow': s.glow,
      } as CSSProperties
    }
  >
    {s.pop ? (
      <>
        <path
          d="M50 2C53 38 62 47 98 50C62 53 53 62 50 98C47 62 38 53 2 50C38 47 47 38 50 2Z"
          fill={s.color}
        />
        <circle cx="50" cy="50" r="7" fill={s.color} />
      </>
    ) : (
      <path
        d="M50 0c0 27.6-22.4 50-50 50 27.6 0 50 22.4 50 50 0-27.6 22.4-50 50-50-27.6 0-50-22.4-50-50Z"
        fill={s.color}
      />
    )}
  </svg>
);

/**
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │ [PROMO-BANNER] 하반기 멤버십 프로모션 배너 (한시적)                      │
 * │                                                                         │
 * │ 프로모션 종료 시 삭제 방법 — `grep -rn "\[PROMO-BANNER\]"` 로 전부 찾기: │
 * │   1. 이 파일(MembershipPromoBanner.tsx) 삭제                             │
 * │   2. TopBanner.tsx 의 import 와 <MembershipPromoBanner /> 렌더 줄 제거   │
 * │   3. public/images/home-membership-banner.png 삭제                      │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * TopBanner(상단 띠 배너) 안에서 밴드 바로 아래에 렌더되며, 클릭 시 /membership 으로 이동한다.
 * 음수 마진(-mt)으로 고정 밴드 아래에 살짝 겹쳐 올려, 밴드가 이미지 상단(배경 영역)을 덮게 한다.
 * → 스페이서와 실제 밴드 높이 차이로 생기던 흰 틈을 브레이크포인트 무관하게 제거.
 */
const MembershipPromoBanner = () => {
  return (
    <Link
      href="/membership"
      className="relative hidden w-full overflow-hidden md:-mt-2 md:block"
      aria-label="2026 하반기 멤버십 - 공채 준비 올인원 패스 안내"
    >
      <Image
        src="/images/home-membership-banner.png"
        alt="저 공채 준비 올인원 패스인데요, 챌린지 1개 가격에 모든걸 드려요. 공채 준비 올인원 패스 169,900원, 정가 대비 82% 이상 혜택. 혜택 자세히 보기"
        width={5788}
        height={1930}
        className="h-auto w-full"
        sizes="100vw"
        priority
      />
      {/* [PROMO-BANNER] 이미지 위 별 반짝임(twinkle) 애니메이션 — 크기·색·속도 제각각 */}
      {SPARKLES.map((s, i) => (
        <Sparkle key={i} s={s} />
      ))}
      <style>{`
        @keyframes promoTwinkle {
          0%, 100% { transform: translate(-50%, -50%) scale(0.5) rotate(0deg); opacity: 0; }
          50%      { transform: translate(-50%, -50%) scale(1) rotate(25deg); opacity: 1; }
        }
        @keyframes promoPop {
          0%, 100% { transform: translate(-50%, -50%) scale(0.2) rotate(-20deg); opacity: 0; }
          40%      { transform: translate(-50%, -50%) scale(1.3) rotate(15deg); opacity: 1; }
          58%      { transform: translate(-50%, -50%) scale(0.95) rotate(22deg); opacity: 0.9; }
        }
        .promo-banner-sparkle {
          transform: translate(-50%, -50%);
          filter: drop-shadow(0 0 11px var(--pb-glow)) drop-shadow(0 0 4px var(--pb-glow));
          animation-name: promoTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-fill-mode: backwards;
        }
        .promo-banner-sparkle.is-pop { animation-name: promoPop; }
        @media (prefers-reduced-motion: reduce) {
          .promo-banner-sparkle { animation: none; opacity: 1; }
        }
      `}</style>
    </Link>
  );
};

export default MembershipPromoBanner;
