'use client';

import ModalOverlay from '@/common/ModalOverlay';
import ModalPortal from '@/common/ModalPortal';
import { useControlScroll } from '@/hooks/useControlScroll';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { CarouselImage } from './ImageCarouselNode';

function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: CarouselImage[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const swiperRef = useRef<SwiperType | null>(null);
  useControlScroll(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <ModalOverlay onClose={onClose} className="bg-black/70" />

        {/* 페이지 인디케이터 — 화면 상단 고정 */}
        <div className="absolute top-6 z-10 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => swiperRef.current?.slideTo(i)}
              aria-label={`이미지 ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                i === index ? 'bg-primary' : 'bg-neutral-70'
              }`}
            />
          ))}
        </div>

        {/* 이전 버튼 */}
        {index > 0 && (
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-14 z-10 hidden hover:opacity-90 md:block"
          >
            <img
              src="/icons/Chevron_Left.svg"
              alt="<"
              className="h-6 w-6 md:h-12 md:w-12"
            />
          </button>
        )}

        <div className="z-10 w-[90vw] md:w-[60vw]">
          <Swiper
            modules={[Keyboard]}
            keyboard={{ enabled: true }}
            initialSlide={initialIndex}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => setIndex(swiper.activeIndex)}
            className="h-[50vh]"
          >
            {images.map((img, i) => (
              <SwiperSlide key={i} className="flex items-center justify-center">
                <picture className="block h-full w-full">
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
                    className="h-full w-full object-contain"
                  />
                </picture>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 다음 버튼 */}
        {index < images.length - 1 && (
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-14 z-10 hidden hover:opacity-80 md:block"
          >
            <img
              src="/icons/Chevron_Right.svg"
              alt=">"
              className="h-6 w-6 md:h-12 md:w-12"
            />
          </button>
        )}
      </div>
    </ModalPortal>
  );
}

export default function ImageCarouselViewer({
  images,
  containerWidth,
}: {
  images: CarouselImage[];
  containerWidth: string | number;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  return (
    <>
      <div className="my-4 overflow-x-auto" style={{ width: containerWidth }}>
        <div
          className="flex gap-2 pb-1 md:gap-3"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              className="flex-none cursor-pointer overflow-hidden"
              style={{ scrollSnapAlign: 'start' }}
              onClick={() => setLightboxIndex(idx)}
            >
              <picture>
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
                  className="h-40 w-auto md:h-[260px]"
                  draggable={false}
                />
              </picture>
            </div>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}
