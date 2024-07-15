import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { IBanner } from '../../../../types/interface';
import axios from '../../../../utils/axios';

const Banner = () => {
  const imgRef = useRef<HTMLImageElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const [bannerList, setBannerList] = useState<IBanner[]>([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [isPlay, setIsPlay] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 350);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 350);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getBannerList = async () => {
    try {
      const res = await axios.get(`/banner?type=PROGRAM`);
      if (res.status === 200) {
        const bannerList = res.data.data.bannerList as IBanner[];
        const filtered = bannerList.filter((banner: IBanner) => banner.isValid);
        setBannerList(filtered);
        return res.data;
      }
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
    // 배너 슬라이드 애니메이션
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

  if (isLoading || bannerList.length === 0) return <></>;

  return (
    <div className="relative flex h-40 w-full max-w-[59rem] items-center overflow-hidden rounded-sm bg-static-0 text-static-100 md:h-44 lg:h-56 xl:h-72">
      <div
        ref={innerRef}
        className="flex flex-nowrap items-center transition-transform duration-300 ease-in-out"
      >
        {bannerList.map((banner) => (
          <Link
            to={banner.link}
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
          </Link>
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
          {bannerList.length < 10 ? `0${bannerList.length}` : bannerList.length}
        </span>
      </div>
    </div>
  );
};

export default Banner;
