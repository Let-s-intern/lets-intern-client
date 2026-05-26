import { twMerge } from '@/lib/twMerge';
import Image from 'next/image';

interface WobbleSignpostProps {
  src: string;
  alt: string;
  /** 위치/크기 제어용 클래스 (사용처에서 absolute 배치 등) */
  className?: string;
  /**
   * 지정 시 푯말 하단(기둥 끝)으로 갈수록 투명해지는 페이드(mask)를 적용한다.
   * 값(%)은 "이 지점부터 아래로 페이드 시작" — 100이면 사실상 페이드 없음.
   * 예: 55 → 위에서 55% 지점까지는 불투명, 그 아래로 100%(맨 아래)에서 완전 투명.
   */
  maskFadeStart?: number;
}

/**
 * 푯말 이미지 + 호버 흔들림 (스크롤 팝업·사이드 패널 공유).
 *
 * 흔들림은 부모의 `group` 호버에서 트리거된다 (`group-hover:animate-wobble`).
 * 기둥(하단)을 축으로 흔들리도록 `origin-bottom`을 적용하며,
 * `prefers-reduced-motion` 환경에서는 `motion-reduce:animate-none`으로 정지한다.
 *
 * 사용처는 이 컴포넌트를 `group relative` 컨테이너 안에 배치하고,
 * className으로 위치/크기를 제어한다.
 */
export default function WobbleSignpost({
  src,
  alt,
  className,
  maskFadeStart,
}: WobbleSignpostProps) {
  // 하단 페이드: maskFadeStart 지정 시에만 mask-image 그라데이션 적용 (webkit prefix 포함)
  const maskStyle =
    maskFadeStart === undefined
      ? undefined
      : {
          maskImage: `linear-gradient(to bottom, #000 ${maskFadeStart}%, transparent 100%)`,
          WebkitMaskImage: `linear-gradient(to bottom, #000 ${maskFadeStart}%, transparent 100%)`,
        };

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 40vw, 200px"
      style={maskStyle}
      className={twMerge(
        'group-hover:animate-wobble origin-bottom object-contain motion-reduce:animate-none',
        className,
      )}
    />
  );
}
