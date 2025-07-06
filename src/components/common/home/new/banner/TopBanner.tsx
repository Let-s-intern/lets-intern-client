'use client';

import useScrollDirection from '@/hooks/useScrollDirection';
import { twMerge } from '@/lib/twMerge';
import { ILineBanner } from '@/types/Banner.interface';
import axios from '@/utils/axios';
import { FULL_NAVBAR_HEIGHT_OFFSET } from '@components/common/ui/layout/header/NextNavBar';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const TopBanner = () => {
  const [isShow, setIsShow] = useState(false);

  const { data } = useQuery<ILineBanner>({
    queryKey: ['LineBanner'],
    queryFn: async () => {
      const res = await axios.get(`/banner`, {
        params: {
          type: 'LINE',
        },
      });
      if (res.data.data.bannerList.length === 0) return null;
      return res.data.data.bannerList[0];
    },
  });

  const scrollDirection = useScrollDirection();

  useEffect(() => {
    if (data) {
      setIsShow(true);
    } else {
      setIsShow(false);
    }
  }, [data, setIsShow]);

  const clickBanner = () => {
    const target = data?.link.includes(window.location.origin)
      ? '_self'
      : '_blank';
    window.open(data?.link, target);
  };

  const closeBanner = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsShow(false);
  };

  const bannerStyle = {
    backgroundColor: data?.colorCode,
    color: data?.textColorCode,
  };

  if (!isShow) return null;

  return (
    <>
      <section
        className={twMerge(
          'band_banner fixed z-20 w-screen cursor-pointer bg-neutral-0 py-3 duration-300 md:px-5',
          FULL_NAVBAR_HEIGHT_OFFSET,
          scrollDirection === 'DOWN' ? '-translate-y-full' : 'translate-y-0',
        )}
        style={bannerStyle}
        onClick={clickBanner}
      >
        <div className="flex items-center justify-between px-2">
          <div aria-hidden="true" className="h-6 w-6" />
          <div className="flex flex-col items-center justify-center gap-1 text-center text-[13px] font-medium leading-[140%] md:flex-row md:text-small18">
            <span>{data?.title}</span>
            <span>{data?.contents}</span>
          </div>
          <button type="button" onClick={closeBanner}>
            <img
              className="h-6 w-6"
              src="/icons/Close_MD.svg"
              alt="상단띠배너 닫기"
            />
          </button>
        </div>
      </section>
      <div className="h-20 w-full md:h-14" />
    </>
  );
};

export default TopBanner;
