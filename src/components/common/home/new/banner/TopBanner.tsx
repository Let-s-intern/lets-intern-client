import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import axios from '../../../../../utils/axios';
import { ILineBanner } from '../../../../../interfaces/Banner.interface';

const TopBanner = () => {
  const [isShow, setIsShow] = useState(true);
  const [lineBanner, setLineBanner] = useState<ILineBanner>();

  const {isLoading} = useQuery({
    queryKey: ['LineBanner'],
    queryFn: async () => {
      const res = await axios.get(`/banner`, {
        params: {
          type: 'LINE'
        }
      });
      const data = res.data;
      setLineBanner(data.data.bannerList[0]);
      return data;
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return isShow ? (
    <section className="mt-3 bg-neutral-0 px-5 py-3">
      <div className="relative">
        <div className="flex flex-col items-center justify-center gap-1 text-center text-static-100 md:flex-row">
          <span className="text-1-semibold">{lineBanner?.title}</span>
          <span className="text-0.875-medium">
            {lineBanner?.contents}
          </span>
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
