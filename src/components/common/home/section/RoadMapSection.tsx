import Bag from '@/assets/graphic/bag.svg?react';
import Folder from '@/assets/graphic/folder.svg?react';
import QnA from '@/assets/graphic/qna.svg?react';
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
    subTitle: '합격으로 가는 가장 빠른 길',
    icon: (
      <Folder className="absolute -right-1.5 bottom-0 h-[50px] w-[70px] md:-bottom-3 md:-right-2.5 md:h-[109px] md:w-[160px]" />
    ),
    href: '/program',
    theme: 'GREEN',
  },
  {
    title: '대기업 로드맵',
    subTitle: '필요한 전략을 한눈에 정리',
    icon: (
      <Bag className="absolute -right-1.5 bottom-0 h-[50px] w-[70px] md:-bottom-3 md:-right-4 md:h-[109px] md:w-[160px]" />
    ),
    href: '/program',
    theme: 'PURPLE',
  },
  {
    title: '1:1 상담 받기',
    subTitle: '맞춤 취준 로드맵을 원한다면,',
    icon: (
      <QnA className="absolute -right-1.5 bottom-0 h-[50px] w-[70px] md:-bottom-3 md:-right-2.5 md:h-[109px] md:w-[160px]" />
    ),
    href: '/program',
    theme: 'PINK',
  },
];

const RoadMapSection = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      <section className="mt-10 flex w-full max-w-[1160px] flex-col gap-y-6 md:mt-16">
        <div className="px-5 xl:px-0">
          <MoreHeader isBig>합격으로 가는 취업 로드맵</MoreHeader>
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
    sub: 'text-secondary bg-secondary/15',
    main: 'bg-[#E3FBF1] border-[#97DEC1]',
  },
  PURPLE: {
    sub: 'text-primary bg-primary/15',
    main: 'bg-primary-10 border-[#BFC2F3]',
  },
  PINK: {
    sub: 'text-tertiary bg-tertiary/15',
    main: 'bg-[#F8EAFF] border-[#EBCBFC]',
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
        'relative flex h-[100px] w-fit shrink-0 flex-col justify-start gap-y-1 overflow-hidden rounded-xs border px-4 py-5 text-neutral-0 md:h-32 md:w-full md:px-6',
        COLOR_THEME[theme].main,
      )}
    >
      {icon}
      <span
        className={clsx(
          'z-10 w-fit rounded-xxs px-1.5 py-1 text-xxsmall12 font-semibold md:text-xsmall14',
          COLOR_THEME[theme].sub,
        )}
      >
        {subTitle}
      </span>
      <span className="z-10 text-xsmall14 font-semibold text-neutral-0 md:text-small20 md:font-bold">
        {title}
      </span>
    </Link>
  );
};
