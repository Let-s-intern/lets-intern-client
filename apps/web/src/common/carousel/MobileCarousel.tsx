import React from 'react';
import 'swiper/css';
import 'swiper/css/free-mode';
import { FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface MobileCarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemWidth?: string;
  spaceBetween?: number;
  className?: string;
  containerWidth?: string;
  getItemKey?: (item: T, index: number) => string | number;
}

function MobileCarousel<T>({
  items,
  renderItem,
  itemWidth = '280px',
  spaceBetween = 16,
  className = '',
  containerWidth = '93vw',
  getItemKey = (_, index) => index,
}: MobileCarouselProps<T>) {
  return (
    <>
      {/* 모바일 스와이퍼 뷰 */}
      <div
        className={`overflow-hidden md:hidden ${className}`}
        style={{ width: containerWidth }}
      >
        <Swiper
          modules={[FreeMode]}
          slidesPerView="auto"
          spaceBetween={spaceBetween}
          freeMode={true}
          grabCursor={true}
          touchRatio={1}
          threshold={10}
          className="!overflow-visible pb-2"
        >
          {items.map((item, index) => (
            <SwiperSlide
              key={getItemKey(item, index)}
              style={{ width: itemWidth }}
            >
              {renderItem(item, index)}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 데스크톱 세로 나열 뷰 */}
      <div className="hidden md:flex md:flex-col md:gap-4">
        {items.map((item, index) => (
          <div key={getItemKey(item, index)}>{renderItem(item, index)}</div>
        ))}
      </div>
    </>
  );
}

export default MobileCarousel;
