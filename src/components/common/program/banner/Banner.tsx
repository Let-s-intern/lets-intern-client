import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { IProgramBanner } from '../../../../interfaces/interface';
import axios from '../../../../utils/axios';
import { Link } from 'react-router-dom';

const Banner = () => {
  const imgRef = useRef<HTMLImageElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const [bannerList, setBannerList] = useState<IProgramBanner[]>([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [bannerWidth, setBannerWidth] = useState(window.innerWidth - 288);
  const [isPlay, setIsPlay] = useState(true);

  const getBannerList = async () => {
    try {
      const res = await axios.get(`/banner/admin?type=PROGRAM`);
      if (res.status === 200) {
        const bannerList = res.data.data.bannerList as IProgramBanner[];
        const filtered = bannerList.filter(
          (banner: IProgramBanner) => banner.isVisible,
        );
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

  useEffect(() => {
    if (!isPlay) return;
    // 배너 슬라이드
    const timer = setInterval(() => {
      const distance = imgRef.current?.offsetWidth;
      const nextIndex = (bannerIndex + 1) % bannerList.length;

      setBannerIndex(nextIndex);
      innerRef.current?.style.setProperty(
        'transform',
        `translateX(-${distance! * nextIndex}px)`,
      );
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [bannerIndex, bannerList.length, isPlay]);

  useEffect(() => {
    const resizeBanner = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 991) setBannerWidth(window.innerWidth - 288);
      else setBannerWidth(windowWidth);
    };

    window.addEventListener('resize', resizeBanner);
  }, []);

  if (isLoading || bannerList.length === 0) return <></>;

  return (
    <div
      ref={bannerRef}
      className="relative flex h-40 w-80 items-center justify-center overflow-hidden rounded-sm bg-static-0 text-static-100 md:h-56 md:w-[30rem] lg:h-80 lg:w-[40rem] xl:w-[59rem]"
    >
      <div
        ref={innerRef}
        className="flex flex-nowrap items-center transition-transform duration-300 ease-in-out"
      >
        {bannerList.map((banner) => (
          <Link
            to={banner.link}
            ref={linkRef}
            className={`w-80 md:w-[30rem] lg:w-[40rem] xl:w-[59rem]`}
          >
            <img
              key={banner.id}
              ref={imgRef}
              className="w-full object-cover brightness-50"
              src={banner.imgUrl}
              alt="배너 이미지"
            />
          </Link>
        ))}
      </div>
      <div className="absolute bottom-4 left-5 flex items-center gap-1.5 md:bottom-6 md:left-8">
        <img
          onClick={() => setIsPlay(!isPlay)}
          className="w-5"
          src="/icons/play.svg"
          alt="배너 페이지네이션 재생 아이콘"
        />
        <span className="text-0.75-medium md:text-0.875-medium">
          {bannerIndex + 1 < 10 ? `0${bannerIndex + 1}` : bannerIndex + 1} /{' '}
          {bannerList.length < 10 ? `0${bannerList.length}` : bannerList.length}
        </span>
      </div>
    </div>
  );
};

export default Banner;
