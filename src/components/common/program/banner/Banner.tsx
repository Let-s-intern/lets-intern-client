import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { IBanner } from '../../../../interfaces/interface';
import axios from '../../../../utils/axios';
import BannerPlay from '../../ui/button/BannerPlay';

const Banner = () => {
  const [bannerList, setBannerList] = useState<IBanner[]>([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [isPlay, setIsPlay] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 350);
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

  const getBannerList = async () => {
    try {
      const res = await axios.get(`/banner?type=PROGRAM`);
      if (res.status === 200) {
        const bannerList = res.data.data.bannerList as IBanner[];
        // console.log('bannerList', bannerList);
        const filtered = bannerList.filter((banner: IBanner) => banner.isValid);
        setBannerList(filtered);
        return res.data;
      }
      throw new Error(`${res.status} ${res.statusText}`);
    } catch (error) {
      console.error(error);
    }
  };
  const { isLoading } = useQuery({
    queryKey: ['banner', 'admin', 'PROGRAM'],
    queryFn: getBannerList,
  });

  if (isLoading || bannerList.length === 0) return <></>;

  return (
    <section className="relative flex max-h-[25rem] w-full items-center overflow-hidden rounded-sm bg-static-0 text-static-100 md:top-[13px]">
      {bannerList.map((bannner) => (
        <img
          onClick={() => window.open(bannner.link)}
          key={bannner.id}
          className="w-full shrink-0 grow-0 cursor-pointer rounded-sm object-cover transition-all duration-500 ease-in-out"
          style={{ translate: `-${bannerIndex * 100}%` }}
          src={isMobile ? bannner.mobileImgUrl : bannner.imgUrl}
          alt="홈 배너 이미지"
        />
      ))}
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
