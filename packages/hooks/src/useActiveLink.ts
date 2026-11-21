import { useMemo } from 'react';

/**
 * 현재 URL 경로에 따라 활성화된 링크를 알려주는 훅입니다.
 *
 * 네비게이션 바에서 현재 위치를 시각적으로 표시할 때 사용합니다.
 *
 * 경로에서 바로 계산해서 돌려준다. 예전에는 effect 안에서 상태로 저장해서
 * ① 첫 그림 뒤에야 색이 들어왔고 ② 어느 항목에도 안 맞는 경로로 가면 이전 페이지의 값이 그대로 남았다
 * (렛츠커리어 멘토를 눌러도 색이 안 바뀌거나, 엉뚱한 메뉴가 계속 켜져 있었다).
 *
 * @param {string} pathname - 현재 URL 경로를 나타내는 문자열입니다.
 * @param {object} options.mentoringCatalog - `/program?catalog=mentoring` 인지.
 *   쿼리는 경로에 없어서 호출하는 쪽이 알려준다. 이때는 프로그램이 아니라 'MENTORING_CATALOG' 를 돌려준다.
 *   대기업 멘토관('BIGFIRM')·1:1 LIVE 멘토링('MENTORING_CATALOG')은 데스크톱에서는 "렛츠커리어 멘토"
 *   드롭다운 안의 항목이고 모바일에서는 별도 탭이라, 어느 메뉴를 켤지는 호출하는 쪽이 정한다
 * @returns {ActiveLinks} 활성화된 링크의 이름을 반환합니다. 맞는 항목이 없으면 ''.
 *
 * 사용 예시:
 * const activeLink = useActiveLink(pathname);
 */

export type ActiveLinks =
  | 'HOME'
  | 'ABOUT'
  | 'LIBRARY'
  | 'PROGRAM'
  | 'SEMINAR'
  | 'ADMIN'
  | 'BLOG'
  | 'REPORT'
  | 'REVIEW'
  | 'MENTORS'
  | 'BIGFIRM'
  | 'MENTORING_CATALOG'
  | 'PASS_CERTIFICATION'
  | '';

interface Options {
  /** `/program?catalog=mentoring` (1:1 LIVE 멘토링 목록) 인지 */
  mentoringCatalog?: boolean;
}

export const getActiveLink = (
  pathname: string,
  { mentoringCatalog = false }: Options = {},
): ActiveLinks => {
  if (pathname === '/') return 'HOME';
  if (pathname.startsWith('/about')) return 'ABOUT';
  if (pathname.startsWith('/seminar')) return 'SEMINAR';
  if (pathname.startsWith('/program')) {
    return mentoringCatalog ? 'MENTORING_CATALOG' : 'PROGRAM';
  }
  // 카테고리 랜딩은 "프로그램 카테고리" 메뉴 아래에 있다
  if (pathname.startsWith('/category')) return 'PROGRAM';
  if (pathname.startsWith('/library')) return 'LIBRARY';
  if (pathname.startsWith('/admin')) return 'ADMIN';
  if (pathname.startsWith('/blog')) return 'BLOG';
  if (pathname.startsWith('/report')) return 'REPORT';
  if (pathname.startsWith('/review')) return 'REVIEW';
  if (pathname.startsWith('/mentors')) return 'MENTORS';
  if (pathname.startsWith('/bigfirm')) return 'BIGFIRM';
  if (pathname.startsWith('/pass-certification')) return 'PASS_CERTIFICATION';
  return '';
};

export default function useActiveLink(
  pathname: string,
  { mentoringCatalog = false }: Options = {},
) {
  return useMemo(
    () => getActiveLink(pathname, { mentoringCatalog }),
    [pathname, mentoringCatalog],
  );
}
