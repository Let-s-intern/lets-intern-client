import { memo, useEffect, useState } from 'react';
import HybridLink from '../HybridLink';

type Menu = {
  name: string;
  img: string;
  activeImg: string;
  href: string;
};

const MenuLink = memo(
  function Menu({
    menu,
    active,
    onClick,
  }: {
    menu: Menu;
    active: boolean;
    onClick?: () => void;
  }) {
    return (
      <HybridLink
        key={menu.name}
        className="flex flex-1 flex-col items-center pb-2.5 pt-1.5"
        href={menu.href}
        onClick={onClick}
      >
        <img
          className="h-6 w-auto"
          src={`/mobile-nav/${active ? menu.activeImg : menu.img}`}
          alt={menu.name}
        />
        <span className="block h-4 text-[0.688rem] font-medium text-neutral-40">
          {menu.name}
        </span>
      </HybridLink>
    );
  },
  (oldProps, newProps) => oldProps.active === newProps.active,
);

interface Props {
  pathname?: string;
}

type Active = '블로그' | '후기' | '홈' | '프로그램' | '마이페이지';

function BottomNavBar({ pathname = '' }: Props) {
  // 모바일 네비게이션 바 숨김 조건
  const hidden =
    pathname.startsWith('/report') ||
    pathname.startsWith('/program/') ||
    pathname === '/about' ||
    pathname.startsWith('/payment');

  const menuInfo: Menu[] = [
    {
      name: '블로그',
      img: 'blog.svg',
      activeImg: 'blog-active.svg',
      href: '/blog/list',
    },
    {
      name: '후기',
      img: 'review.svg',
      activeImg: 'review-active.svg',
      href: '/review',
    },
    {
      name: '홈',
      img: 'home.svg',
      activeImg: 'home-active.svg',
      href: '/',
    },
    {
      name: '프로그램',
      img: 'program.svg',
      activeImg: 'program-active.svg',
      href: '/program',
    },
    {
      name: '마이페이지',
      img: 'mypage.svg',
      activeImg: 'mypage-active.svg',
      href: '/mypage/application',
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
    else if (pathname.startsWith('/review')) setActive('후기');
    else if (pathname.startsWith('/mypage')) setActive('마이페이지');
  }, [pathname]);

  if (hidden) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center border-t border-neutral-80 bg-white md:hidden">
      {menuInfo.map((item) => (
        <MenuLink
          menu={item}
          key={item.name}
          active={item.name === active}
          onClick={() => setActive(item.name as Active)}
        />
      ))}
    </nav>
  );
}

export default BottomNavBar;
