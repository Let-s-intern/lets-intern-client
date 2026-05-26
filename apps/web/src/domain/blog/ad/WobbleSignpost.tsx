import { twMerge } from '@/lib/twMerge';
import Image from 'next/image';

interface WobbleSignpostProps {
  src: string;
  alt: string;
  /** 위치/크기 제어용 클래스 (사용처에서 absolute 배치 등) */
  className?: string;
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
}: WobbleSignpostProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 40vw, 200px"
      className={twMerge(
        'group-hover:animate-wobble origin-bottom object-contain motion-reduce:animate-none',
        className,
      )}
    />
  );
}
