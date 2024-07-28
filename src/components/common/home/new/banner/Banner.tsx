import { useQuery } from '@tanstack/react-query';
import { Fragment, useEffect, useState } from 'react';
import BannerPlay from './BannerPlay';

import { IBanner } from '../../../../../types/Banner.interface';
import axios from '../../../../../utils/axios';

const bannerSidePadding = 20;
const sectionStyle = {
  paddingLeft: `${bannerSidePadding}px`,
  paddingRight: `${bannerSidePadding}px`,
};

const Banner = () => {
  const [bannerList, setBannerList] = useState<IBanner[]>([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [isPlay, setIsPlay] = useState(true);
  const [bannerWidth, setBannerWidth] = useState(
    window.innerWidth - bannerSidePadding * 2,
  );
  const bannerStyle = {
    translate: `-${bannerIndex * 100}%`,
  };

  useEffect(() => {
    const handleResize = () => {
      setBannerWidth(window.innerWidth - bannerSidePadding * 2);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isPlay) return;

    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerList.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlay, bannerList]);

  const clickLeft = () => {
    if (bannerIndex === 0) setBannerIndex(bannerList.length - 1);
    else setBannerIndex((prev) => prev - 1);
  };

  const clickRight = () => {
    setBannerIndex((prev) => (prev + 1) % bannerList.length);
  };

  const clickImg = (imgLInk: string) => {
    const target = imgLInk.includes(window.location.origin)
      ? '_self'
      : '_blank';
    window.open(imgLInk, target);
  };

  useQuery({
    queryKey: ['mainBanner'],
    queryFn: async () => {
      const res = await axios.get(`/banner`, {
        params: {
          type: 'MAIN',
        },
      });
      const data = res.data;
      setBannerList(data.data.bannerList);
      return data;
    },
  });

  return (
    <section style={sectionStyle}>
      <div className="relative top-[3px] flex max-h-[25rem] overflow-hidden rounded-sm text-static-100 md:top-[13px]">
        {bannerList.map((banner) => (
          <Fragment key={banner.id}>
            <div
              key={banner.id}
              className="hidden min-w-full cursor-pointer transition-all duration-500 ease-in-out sm:block"
              style={bannerStyle}
            >
              <img
                onClick={() => clickImg(banner.link)}
                key={banner.id}
                className="main_banner h-full w-full object-cover"
                src={banner.imgUrl}
                alt="홈 배너 이미지"
              />
            </div>
            <div
              className="block min-w-full cursor-pointer transition-all duration-500 ease-in-out sm:hidden"
              style={bannerStyle}
            >
              <img
                onClick={() => window.open(banner.link)}
                key={banner.id}
                className="main_banner h-full w-full object-cover"
                src={banner.mobileImgUrl}
                alt="홈 배너 이미지"
              />
            </div>
          </Fragment>
        ))}
        <button
          onClick={clickLeft}
          className="absolute inset-y-1/2 left-0 top-[43%] z-10"
        >
          <img
            className="h-10 w-10 md:h-16 md:w-16"
            src="/icons/Caret_Circle_Left.svg"
            alt="왼쪽 슬라이드로 이동"
          />
        </button>
        <button
          onClick={clickRight}
          className="absolute inset-y-1/2 right-0 top-[43%] z-10"
        >
          <img
            className="h-10 w-10 md:h-16 md:w-16"
            src="/icons/Caret_Circle_Right.svg"
            alt="오른쪽 슬라이드로 이동"
          />
        </button>
        <BannerPlay
          isPlay={isPlay}
          setIsPlay={setIsPlay}
          bannerIndex={bannerIndex}
          length={bannerList.length}
        />
      </div>
    </section>
  );
};

export default Banner;
