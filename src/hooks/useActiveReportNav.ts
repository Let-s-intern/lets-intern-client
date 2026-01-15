import { SubNavItemProps } from '@/common/layout/header/SubNavItem';
import { useEffect, useState } from 'react';
import useActiveReports from './useActiveReports';

/**
 * 활성화된 서류 진단 메뉴를 관리하는 훅입니다.
 *
 * @returns {SubNavItemProps[]} 활성화된 서류 진단 메뉴의 리스트를 반환합니다.
 *
 * 사용 예시:
 * const reportNavItems = useActiveReportNav();
 */

export default function useActiveReportNav() {
  const [reportNavList, setReportNavList] = useState<SubNavItemProps[]>([]);
  const { hasActiveResume, hasActivePortfolio, hasActivePersonalStatement } =
    useActiveReports();

  useEffect(() => {
    /* 활성화된 서류 진단만 서브 메뉴로 설정 */
    const reportNavList: SubNavItemProps[] = [
      {
        children: '이력서 진단 받기',
        href: '/report/landing/resume',
      },
      {
        children: '자기소개서 진단 받기',
        href: '/report/landing/personal-statement',
      },
      {
        children: '포트폴리오 진단 받기',
        href: '/report/landing/portfolio',
      },
      {
        children: 'MY 진단서 보기',
        href: '/report/management',
      },
    ];

    const navList: SubNavItemProps[] = [];

    if (hasActiveResume) {
      navList.push(reportNavList[0]);
    }
    if (hasActivePersonalStatement) {
      navList.push(reportNavList[1]);
    }
    if (hasActivePortfolio) {
      navList.push(reportNavList[2]);
    }
    navList.push(reportNavList[3]);
    setReportNavList(navList);
  }, [hasActiveResume, hasActivePortfolio, hasActivePersonalStatement]);

  return reportNavList;
}
