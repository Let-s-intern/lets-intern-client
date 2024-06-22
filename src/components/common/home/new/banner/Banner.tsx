import { useEffect, useState } from 'react';
import BannerPlay from './BannerPlay';
import { useQuery } from '@tanstack/react-query';

import axios from '../../../../../utils/axios';
import { IBanner } from '../../../../../interfaces/Banner.interface';

const Banner = () => {
  const bannerSidePadding = 20;

  const [bannerList, setBannerList] = useState<IBanner[]>([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [isPlay, setIsPlay] = useState(true);
  const [bannerWidth, setBannerWidth] = useState(
    window.innerWidth - bannerSidePadding * 2,
  );

  useEffect(() => {
    const handleResize = () => {
      setBannerWidth(window.innerWidth - bannerSidePadding * 2);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isPlay) {
      const interval = setInterval(() => {
        setBannerIndex((prev) => (prev + 1) % bannerList.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPlay, bannerList]);

  const clickLeft = () => {
    if (bannerIndex === 0) setBannerIndex(bannerList.length - 1);
    else setBannerIndex((prev) => prev - 1);
  };
  const clickRight = () => {
    setBannerIndex((prev) => (prev + 1) % bannerList.length);
  };

  const { isLoading } = useQuery({
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
    <section
      style={{
        paddingLeft: `${bannerSidePadding}px`,
        paddingRight: `${bannerSidePadding}px`,
      }}
    >
      <div className="relative top-[3px] flex overflow-hidden text-static-100 md:top-[13px]">
        {bannerList.map((bannner) => (
          <>
            <div>
              <img
                onClick={() => window.open(bannner.link)}
                key={bannner.id}
                className="hidden cursor-pointer rounded-sm object-cover transition-all duration-500 ease-in-out sm:block"
                style={{
                  translate: `-${bannerIndex * 100}%`,
                  width: `${bannerWidth}px`,
                }}
                src={bannner.imgUrl}
                alt="홈 배너 이미지"
              />
            </div>
            <div>
              <img
                onClick={() => window.open(bannner.link)}
                key={bannner.id}
                className="block cursor-pointer rounded-sm transition-all duration-500 ease-in-out sm:hidden"
                style={{
                  translate: `-${bannerIndex * 100}%`,
                  width: `${bannerWidth}px`,
                }}
                src={bannner.mobileImgUrl}
                alt="홈 배너 이미지"
              />
            </div>
          </>
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
