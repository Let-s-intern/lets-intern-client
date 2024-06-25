import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import axios from '../../../../../utils/axios';
import { ILineBanner } from '../../../../../interfaces/Banner.interface';

const TopBanner = () => {
  const [isShow, setIsShow] = useState(false);

  const { isLoading, data } = useQuery<ILineBanner>({
    queryKey: ['LineBanner'],
    queryFn: async () => {
      const res = await axios.get(`/banner`, {
        params: {
          type: 'LINE',
        },
      });
      return res.data.data.bannerList[0];
    },
  });

  useEffect(() => {
    console.log('topbanner: ', data);
    data && setIsShow(true);
  }, [data]);

  return isShow ? (
    <section
      className="band_banner bg-neutral-0 py-3 md:px-5"
      style={{
        backgroundColor: data?.colorCode,
        color: data?.textColorCode,
      }}
      onClick={() => window.open(data?.link, '_blank')}
    >
      <div className="relative">
        <div className="flex flex-col items-center justify-center gap-1 text-center md:flex-row">
          <span className="text-1-semibold">{data?.title}</span>
          <span className="text-0.875-medium">{data?.contents}</span>
        </div>
        <img
          onClick={() => setIsShow(false)}
          className="absolute right-0 top-0 h-6 w-6 cursor-pointer"
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
