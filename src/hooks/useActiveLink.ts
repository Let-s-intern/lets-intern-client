import { useEffect, useState } from 'react';

/**
 * 현재 URL 경로에 따라 활성화된 링크를 관리하는 훅입니다.
 *
 * 이 훅은 주어진 `pathname`을 기반으로 활성화된 링크를 설정합니다.
 * 네비게이션 바에서 현재 위치를 시각적으로 표시할 때 사용합니다.
 *
 * @param {string} pathname - 현재 URL 경로를 나타내는 문자열입니다.
 * @returns {ActiveLinks} 활성화된 링크의 이름을 반환합니다.
 *
 * 사용 예시:
 * const activeLink = useActiveLink(location.pathname);
 */

type ActiveLinks =
  | 'HOME'
  | 'ABOUT'
  | 'PROGRAM'
  | 'ADMIN'
  | 'BLOG'
  | 'REPORT'
  | 'REVIEW'
  | '';

export default function useActiveLink(pathname: string) {
  const [activeLink, setActiveLink] = useState<ActiveLinks>('');

  useEffect(() => {
    // Active 링크 설정
    if (pathname.startsWith('/about')) {
      setActiveLink('ABOUT');
    } else if (pathname.startsWith('/program')) {
      setActiveLink('PROGRAM');
    } else if (pathname.startsWith('/admin')) {
      setActiveLink('ADMIN');
    } else if (pathname.startsWith('/blog')) {
      setActiveLink('BLOG');
    } else if (pathname.startsWith('/report')) {
      setActiveLink('REPORT');
    } else if (pathname.startsWith('/review')) {
      setActiveLink('REVIEW');
    } else if (location.pathname === '/') {
      setActiveLink('HOME');
    }
  }, [pathname]);

  return activeLink;
}
