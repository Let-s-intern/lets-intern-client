import { useEffect, useState } from 'react';
import BannerPlay from './BannerPlay';

const bannerList = [
  {
    id: 0,
    title: '배너타이틀',
    link: 'https://www.naver.com/',
    imgUrl:
      'https://www.applovin.com/wp-content/uploads/2022/07/1440x810_MAX_FB_Banner_ads-1440x810-1.jpg',
  },
  {
    id: 1,
    title: '배너타이틀',
    link: 'https://www.naver.com/',
    imgUrl:
      'https://milkad.co.kr/boardForder/marketing4/CK_ti375a38706082843.jpg',
  },
  {
    id: 2,
    title: '배너타이틀',
    link: 'https://www.naver.com/',
    imgUrl:
      'https://png.pngtree.com/png-clipart/20220424/original/pngtree-tasty-food-hamburger-fast-food-sale-web-banner-ad-png-image_7555326.png',
  },
];

const Banner = () => {
  const [bannerIndex, setBannerIndex] = useState(0);
  const [isPlay, setIsPlay] = useState(true);

  useEffect(() => {
    if (isPlay) {
      const interval = setInterval(() => {
        setBannerIndex((prev) => (prev + 1) % bannerList.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPlay]);

  const clickLeft = () => {
    if (bannerIndex === 0) setBannerIndex(bannerList.length - 1);
    else setBannerIndex((prev) => prev - 1);
  };
  const clickRight = () => {
    setBannerIndex((prev) => (prev + 1) % bannerList.length);
  };

  return (
    <section className="relative top-[3px] flex overflow-hidden text-static-100 md:top-[13px]">
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
      <button onClick={clickLeft} className="absolute inset-y-1/2 left-0 z-20">
        <img
          className="h-10 w-10 md:h-16 md:w-16"
          src="/icons/Caret_Circle_Left.svg"
          alt="왼쪽 슬라이드로 이동"
        />
      </button>
      <button
        onClick={clickRight}
        className="absolute inset-y-1/2 right-0 z-20"
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
