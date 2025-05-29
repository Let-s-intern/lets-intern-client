'use client';

import { useEffect, useState } from 'react';
import HybridLink from '../HybridLink';

interface Props {
  isNextRouter: boolean;
  pathname?: string;
}

type Active = '블로그' | '후기' | '홈' | '프로그램' | '마이페이지';

function BottomNavBar({ isNextRouter, pathname = '' }: Props) {
  const menuInfo = [
    {
      name: '블로그',
      img: 'blog.svg',
      activeImg: 'blog-active.svg',
      href: '/blog/list',
      force: !isNextRouter,
    },
    {
      name: '후기',
      img: 'review.svg',
      activeImg: 'review-active.svg',
      href: '/review',
      force: !isNextRouter,
    },
    {
      name: '홈',
      img: 'home.svg',
      activeImg: 'home-active.svg',
      href: '/',
      force: !isNextRouter,
    },
    {
      name: '프로그램',
      img: 'program.svg',
      activeImg: 'program-active.svg',
      href: '/program',
      force: isNextRouter,
    },
    {
      name: '마이페이지',
      img: 'mypage.svg',
      activeImg: 'mypage-active.svg',
      href: '/mypage/application',
      force: isNextRouter,
    },
  ];

  const [active, setActive] = useState<null | Active>(null);

  useEffect(() => {
    if (!pathname) {
      setActive(null);
      return;
    }

    if (pathname === '/') setActive('홈');
    else if (pathname === '/program') setActive('프로그램');
    else if (pathname.startsWith('/blog')) setActive('블로그');
    else if (pathname === '/review') setActive('후기');
    else if (pathname.startsWith('/mypage')) setActive('마이페이지');
    else setActive(null);
  }, [pathname]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center border-t border-neutral-80 bg-white md:hidden">
      {menuInfo.map((item) => (
        <HybridLink
          key={item.name}
          className="flex flex-1 flex-col items-center pb-[7px] pt-[5px]"
          isNextRouter={isNextRouter}
          href={item.href}
          force={item.force}
        >
          <img
            className="h-6 w-auto"
            src={`/mobile-nav/${active === item.name ? item.activeImg : item.img}`}
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
