'use client';

import HybridLink from '@/common/HybridLink';
import { useEffect, useRef, useState } from 'react';

import { useGetUserProgramBannerListQuery } from '@/api/program';

const Banner = () => {
  const imgRef = useRef<HTMLImageElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const [bannerIndex, setBannerIndex] = useState(0);
  const [isPlay, setIsPlay] = useState(true);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 420,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 350);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const { data, isLoading } = useGetUserProgramBannerListQuery();

  useEffect(() => {
    if (!isPlay) return;
    // 배너 슬라이드 애니메이션
    const timer = setInterval(() => {
      if (!data) return;

      const distance = imgRef.current?.offsetWidth;
      const nextIndex = (bannerIndex + 1) % data.bannerList.length;

      setBannerIndex(nextIndex);
      innerRef.current?.style.setProperty(
        'transform',
        `translateX(-${distance! * nextIndex}px)`,
      );
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [bannerIndex, data, isPlay]);

  if (isLoading || !data || data.bannerList.length === 0) return null;

  return (
    <div className="relative flex h-40 w-full max-w-[59rem] items-center overflow-hidden rounded-sm bg-static-0 text-static-100 md:h-44 lg:h-56 xl:h-72">
      <div
        ref={innerRef}
        className="flex flex-nowrap items-center transition-transform duration-300 ease-in-out"
      >
        {data.bannerList.map((banner) => (
          <HybridLink
            href={banner.link}
            key={banner.id}
            className="program_banner w-full shrink-0"
            target={
              banner.link.includes(window.location.origin) ? '_self' : '_blank'
            }
          >
            <img
              ref={imgRef}
              className="w-full shrink-0 object-cover"
              src={isMobile ? banner.mobileImgUrl : banner.imgUrl}
              alt="배너 이미지"
            />
          </HybridLink>
        ))}
      </div>
      <div className="absolute bottom-4 left-5 flex items-center gap-1.5 md:bottom-6 md:left-8">
        <img
          onClick={() => setIsPlay(!isPlay)}
          className="w-5 cursor-pointer"
          src="/icons/play.svg"
          alt="배너 페이지네이션 재생 아이콘"
        />
        <span className="text-0.75-medium md:text-0.875-medium">
          {bannerIndex + 1 < 10 ? `0${bannerIndex + 1}` : bannerIndex + 1} /{' '}
          {data.bannerList.length < 10
            ? `0${data.bannerList.length}`
            : data.bannerList.length}
        </span>
      </div>
    </div>
  );
};

export default Banner;
