import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { ILineBanner } from '../../../../../types/Banner.interface';
import axios from '../../../../../utils/axios';

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

  useEffect(() => {
    data && setIsShow(true);
  }, [data]);

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

  return isShow ? (
    <section
      className="band_banner fixed top-[3.75rem] z-30 w-screen cursor-pointer bg-neutral-0 py-3 md:top-[4.375rem] md:px-5 lg:top-[4.75rem]"
      style={{
        backgroundColor: data?.colorCode,
        color: data?.textColorCode,
      }}
      onClick={clickBanner}
    >
      <div className="relative">
        <div className="flex flex-col items-center justify-center gap-1 text-center md:flex-row">
          <span className="text-1-semibold">{data?.title}</span>
          <span className="text-0.875-medium">{data?.contents}</span>
        </div>
        <img
          onClick={closeBanner}
          className="absolute right-0 top-0 h-6 w-6"
          src="/icons/Close_MD.svg"
          alt="상단띠배너 닫기"
        />
      </div>
    </section>
  ) : (
    <></>
  );
};

export default TopBanner;
