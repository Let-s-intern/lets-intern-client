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
   * true면 컴포넌트 mount 시(=페이지 첫 진입) 자동으로 잠깐 흔들린 뒤,
   * 이후에는 호버 시에만 흔들린다. false면 호버 흔들림만 동작한다.
   */
  autoWobble?: boolean;
}

// 인트로 자동 흔들림 지속 시간(ms)
// preset.js의 wobble-intro(0.5s × 3회 = 1.5s)가 끝난 직후 클래스를 제거하도록 약간의 여유를 둔다.
const INTRO_DURATION_MS = 1600;

/**
 * 푯말 이미지 + 흔들림 애니메이션 (스크롤 팝업·사이드 패널 공유).
 *
 * - `autoWobble`이면 mount 직후 일정 시간(INTRO_DURATION_MS) 동안 자동으로 흔들리고(인트로),
 *   인트로가 끝나면 부모의 `group` 호버에서만 흔들린다(`group-hover:animate-wobble`).
 *   인트로 중에는 호버 클래스를 적용하지 않아 두 애니메이션이 충돌하지 않는다.
 * - 기둥(하단)을 축으로 흔들리도록 `origin-bottom`을 적용하며,
 *   `prefers-reduced-motion` 환경에서는 `motion-reduce:animate-none`으로 정지한다.
 *
 * 사용처는 이 컴포넌트를 `group relative` 컨테이너 안에 배치하고,
 * 컨테이너가 크기/비율(aspectRatio)을 담당한다 (`fill`).
 */
export default function WobbleSignpost({
  src,
  alt,
  className,
  autoWobble = false,
}: WobbleSignpostProps) {
  // mount 직후 인트로 흔들림 ON → INTRO_DURATION_MS 후 OFF(이후엔 호버 흔들림만)
  const [intro, setIntro] = useState(autoWobble);

  useEffect(() => {
    if (!autoWobble) return;
    const timer = setTimeout(() => setIntro(false), INTRO_DURATION_MS);
    return () => clearTimeout(timer);
  }, [autoWobble]);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 40vw, 200px"
      className={twMerge(
        'origin-bottom object-contain motion-reduce:animate-none',
        // 인트로 중엔 자동 흔들림, 끝난 뒤엔 호버 흔들림 (충돌 방지 위해 분기)
        intro ? 'animate-wobble-intro' : 'group-hover:animate-wobble',
        className,
      )}
    />
  );
}
