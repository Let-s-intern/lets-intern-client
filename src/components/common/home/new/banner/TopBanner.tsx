import { twMerge } from '@/lib/twMerge';
import { ILineBanner } from '@/types/Banner.interface';
import axios from '@/utils/axios';
import { NAVBAR_HEIGHT_OFFSET } from '@components/common/ui/layout/header/NextNavBar';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const TopBanner = ({
  isShow,
  setIsShow,
}: {
  isShow: boolean;
  setIsShow: (isShow: boolean) => void;
}) => {
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
    if (data) {
      setIsShow(true);
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

  return isShow ? (
    <section
      className={twMerge(
        'band_banner fixed z-20 w-screen cursor-pointer bg-neutral-0 py-3 md:px-5',
        NAVBAR_HEIGHT_OFFSET,
      )}
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
