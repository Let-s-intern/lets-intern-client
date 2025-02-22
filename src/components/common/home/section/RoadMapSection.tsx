import Bag from '@/assets/graphic/bag.svg?react';
import Folder from '@/assets/graphic/folder.svg?react';
import QnA from '@/assets/graphic/qna.svg?react';
import MoreHeader from '@components/common/ui/MoreHeader';
import clsx from 'clsx';
import Link from 'next/link';
import { ReactNode } from 'react';

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
  return (
    <div className="flex w-full flex-col gap-y-6">
      <div className="px-5">
        <MoreHeader
          title="합격으로 가는 취업 로드맵"
          titleClass="md:text-large26 md:font-bold"
        />
      </div>
      <div className="flex w-fit gap-x-2.5 overflow-auto px-5 scrollbar-hide md:w-full">
        {ROADMAP_ITEMS.map((item, index) => (
          <RoadMapItem key={index} {...item} />
        ))}
      </div>
    </div>
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
        'relative flex h-[100px] shrink-0 flex-col justify-start gap-y-1 overflow-hidden rounded-xs border px-4 py-5 text-neutral-0 md:h-32 md:w-1/3 md:px-6',
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
