'use client';

import { twMerge } from '@/lib/twMerge';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface WobbleSignpostProps {
  src: string;
  alt: string;
  /** 위치/크기 제어용 클래스 (사용처에서 absolute 배치 등) */
  className?: string;
  /**
   * true면 컴포넌트 mount 시(=페이지 첫 진입) 자동으로 흔들린 뒤,
   * 이후에는 호버 시에만 흔들린다. false면 호버 흔들림만 동작한다.
   */
  autoWobble?: boolean;
  /** 자동 흔들림 횟수 (기본 3). 데이터(introWobble.count)로 조정. */
  introCount?: number;
  /** 자동 흔들림 1회 속도(ms, 기본 500). 작을수록 빠름. 데이터(introWobble.durationMs)로 조정. */
  introDurationMs?: number;
}

/**
 * 푯말 이미지 + 흔들림 애니메이션.
 *
 * - `autoWobble`이면 mount 직후(클라이언트) `introCount`회 × `introDurationMs`ms 동안
 *   자동으로 흔들리고, 끝나면 부모 `group` 호버에서만 흔들린다.
 *   인트로는 `wobble` keyframe을 inline `animation`으로 돌려 횟수·속도를 데이터로 조정한다.
 * - 인트로는 SSR 깜빡임/하이드레이션 불일치를 막기 위해 클라이언트 effect에서만 시작하고,
 *   `prefers-reduced-motion` 환경에서는 아예 시작하지 않는다(호버도 `motion-reduce:animate-none`).
 * - 기둥(하단)을 축으로 흔들리도록 `origin-bottom` 적용. 컨테이너가 크기/비율을 담당한다(`fill`).
 */
export default function WobbleSignpost({
  src,
  alt,
  className,
  autoWobble = false,
  introCount = 3,
  introDurationMs = 500,
}: WobbleSignpostProps) {
  const [introActive, setIntroActive] = useState(false);

  useEffect(() => {
    if (!autoWobble) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    setIntroActive(true);
    const timer = setTimeout(
      () => setIntroActive(false),
      introCount * introDurationMs + 100,
    );
    return () => clearTimeout(timer);
  }, [autoWobble, introCount, introDurationMs]);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 40vw, 200px"
      style={
        introActive
          ? { animation: `wobble ${introDurationMs}ms ease-in-out ${introCount}` }
          : undefined
      }
      className={twMerge(
        'origin-bottom object-contain motion-reduce:animate-none',
        // 인트로 중엔 inline 애니메이션, 끝난 뒤엔 호버 흔들림 (충돌 방지)
        introActive ? '' : 'group-hover:animate-wobble',
        className,
      )}
    />
  );
}
