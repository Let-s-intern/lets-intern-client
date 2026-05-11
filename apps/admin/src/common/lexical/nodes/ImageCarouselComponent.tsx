import { useEffect, useRef } from 'react';
import type { CarouselImage } from './ImageCarouselNode';

export default function ImageCarouselComponent({
  images,
  width = 0,
  maxWidth = 950,
}: {
  images: CarouselImage[];
  width?: number;
  maxWidth?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY + e.deltaX;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  if (!images.length) return null;

  return (
    <div
      className="my-4"
      style={{
        width: width === 0 ? '100%' : width,
        maxWidth,
      }}
    >
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-3"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className="flex-none overflow-hidden rounded-lg"
            style={{ width: 360, height: 260, scrollSnapAlign: 'start' }}
          >
            <picture className="h-full w-full">
              {img.webpDesktop && (
                <source
                  media="(min-width: 768px)"
                  srcSet={img.webpDesktop}
                  type="image/webp"
                />
              )}
              {img.jpegDesktop && (
                <source
                  media="(min-width: 768px)"
                  srcSet={img.jpegDesktop}
                  type="image/jpeg"
                />
              )}
              {img.webpMobile && (
                <source srcSet={img.webpMobile} type="image/webp" />
              )}
              {img.jpegMobile && (
                <source srcSet={img.jpegMobile} type="image/jpeg" />
              )}
              <img
                src={img.src}
                alt={img.altText}
                className="h-full w-full object-cover"
              />
            </picture>
          </div>
        ))}
      </div>
    </div>
  );
}
