import Roadmap1 from '@/assets/graphic/home/roadmap/1.svg?react';
import Roadmap2 from '@/assets/graphic/home/roadmap/2.svg?react';
import Roadmap3 from '@/assets/graphic/home/roadmap/3.svg?react';
import MoreHeader from '@components/common/ui/MoreHeader';
import { useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

const ROADMAP_ITEMS: {
  title: string;
  subTitle: string;
  icon: ReactNode;
  href: string;
  theme: 'GREEN' | 'PURPLE' | 'PINK';
}[] = [
  {
    title: '일반 채용 로드맵',
    subTitle: '합격에 더 가까이',
    icon: (
      <Roadmap1 className="absolute bottom-0 right-0 h-[61px] w-[58px] md:right-5 md:h-[129px] md:w-[110px]" />
    ),
    href: '/program',
    theme: 'GREEN',
  },
  {
    title: '대기업 로드맵',
    subTitle: '준비 전략을 한눈에',
    icon: (
      <Roadmap2 className="absolute bottom-0 right-1 h-[61px] w-[58px] md:right-5 md:h-[129px] md:w-[110px]" />
    ),
    href: '/program',
    theme: 'PURPLE',
  },
  {
    title: '1:1 상담 받기',
    subTitle: '맞춤형 로드맵을 원한다면',
    icon: (
      <Roadmap3 className="absolute bottom-0 right-1 h-[61px] w-[52px] md:right-5 md:h-[129px] md:w-[110px]" />
    ),
    href: '/program',
    theme: 'PINK',
  },
];

const RoadMapSection = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      <section className="mt-10 flex w-full max-w-[1120px] flex-col gap-y-6 md:mt-16">
        <div className="px-5 xl:px-0">
          <MoreHeader isBig gaText="합격으로 가는 취업 로드맵">
            합격으로 가는 취업 로드맵
          </MoreHeader>
        </div>
        <div className="w-full md:px-5 xl:px-0">
          <Swiper
            className={clsx('w-full', isMobile && 'slide-per-auto')}
            slidesPerView={'auto'}
            spaceBetween={10}
            slidesOffsetBefore={20}
            slidesOffsetAfter={20}
            breakpoints={{
              768: {
                slidesPerView: 3,
                spaceBetween: 16,
                slidesOffsetBefore: 0,
                slidesOffsetAfter: 0,
              },
            }}
          >
            {ROADMAP_ITEMS.map((item, index) => (
              <SwiperSlide key={index}>
                <RoadMapItem {...item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default RoadMapSection;

const COLOR_THEME: {
  [key: string]: {
    sub: string;
    main: string;
  };
} = {
  GREEN: {
    sub: 'text-secondary',
    main: 'bg-[#E3FBF1]',
  },
  PURPLE: {
    sub: 'text-primary',
    main: 'bg-primary-10',
  },
  PINK: {
    sub: 'text-tertiary',
    main: 'bg-[#F8EAFF]',
  },
};

const RoadMapItem = ({
  title,
  subTitle,
  icon,
  href,
  theme,
}: {
  title: string;
  subTitle: string;
  icon: ReactNode;
  href: string;
  theme: 'GREEN' | 'PURPLE' | 'PINK';
}) => {
  return (
    <Link
      href={href}
      className={clsx(
        'roadmap_card relative flex h-[100px] w-[154px] shrink-0 flex-col justify-start gap-y-1 overflow-hidden rounded-xs px-4 py-5 text-neutral-0 md:h-32 md:w-full md:px-6',
        COLOR_THEME[theme].main,
      )}
      data-url={href}
      data-text={title}
    >
      {icon}
      <span
        className={clsx(
          'z-10 text-xxsmall12 font-semibold md:text-xsmall14 md:font-medium',
          COLOR_THEME[theme].sub,
        )}
      >
        {subTitle}
      </span>
      <span className="z-10 text-xsmall16 font-semibold text-neutral-0 md:text-small20">
        {title}
      </span>
    </Link>
  );
};
