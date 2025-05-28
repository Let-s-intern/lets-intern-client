'use client';

import { ReactNode, useState } from 'react';
import HybridLink from '../HybridLink';

const Menu = ({
  isNextRouter,
  children,
}: {
  isNextRouter: boolean;
  children?: ReactNode;
}) => {
  return <HybridLink isNextRouter={isNextRouter}>{children}</HybridLink>;
};

const menuInfo = [
  {
    name: '블로그',
    img: 'blog.svg',
    activeImg: 'blog-active.svg',
  },
  {
    name: '후기',
    img: 'review.svg',
    activeImg: 'review-active.svg',
  },
  {
    name: '홈',
    img: 'home.svg',
    activeImg: 'home-active.svg',
  },
  {
    name: '프로그램',
    img: 'program.svg',
    activeImg: 'program-active.svg',
  },
  {
    name: '마이페이지',
    img: 'mypage.svg',
    activeImg: 'mypage-active.svg',
  },
];

interface Props {
  isNextRouter: boolean;
}

type Active = '블로그' | '후기' | '홈' | '프로그램' | '마이페이지';

function BottomNavBar({ isNextRouter }: Props) {
  const [active, setActive] = useState<null | Active>(null);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center border-t border-neutral-80 bg-white md:hidden">
      {menuInfo.map((item) => (
        <HybridLink
          className="flex flex-1 flex-col items-center pb-[7px] pt-[5px]"
          key={item.name}
          isNextRouter={isNextRouter}
        >
          <img
            className="h-6 w-auto"
            src={`/mobile-nav/${item.img}`}
            alt={item.name}
          />
          <span className="text-xxsmall10 font-medium text-neutral-40">
            {item.name}
          </span>
        </HybridLink>
      ))}
    </nav>
  );
}

export default BottomNavBar;
