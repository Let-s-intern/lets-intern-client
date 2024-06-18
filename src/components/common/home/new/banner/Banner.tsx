import { useEffect, useState } from 'react';
import BannerPlay from './BannerPlay';
import { useQuery } from '@tanstack/react-query';

import axios from '../../../../../utils/axios';
import { IBanner } from '../../../../../interfaces/Banner.interface';

const Banner = () => {
  const [bannerList, setBannerList] = useState<IBanner[]>([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [isPlay, setIsPlay] = useState(true);

  useEffect(() => {
    if (isPlay) {
      const interval = setInterval(() => {
        setBannerIndex((prev) => ((prev + 1) % bannerList.length));
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

  const {isLoading} = useQuery({
    queryKey: ['mainBanner'],
    queryFn: async () => {
      const res = await axios.get(`/banner`, {
        params: {
          type: 'MAIN'
        }
      });
      const data = res.data;
      setBannerList(data.data.bannerList);
      return data;
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <section className="relative top-[3px] flex max-h-[25rem] overflow-hidden text-static-100 md:top-[13px]">
      {bannerList.map((bannner) => (
        <img
          onClick={() => window.open(bannner.link)}
          key={bannner.id}
          className="cursor-pointer rounded-sm object-cover transition-all duration-500 ease-in-out"
          style={{ translate: `-${bannerIndex * 100}%` }}
          src={bannner.imgUrl}
          alt="홈 배너 이미지"
        />
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
    </section>
  );
};

export default Banner;
