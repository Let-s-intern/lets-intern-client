import clsx from 'clsx';
import Link from 'next/link';

import { SHOW_LIVE_MENTORING_NAV } from '@/domain/live-mentoring/constants';

/** 카탈로그 탭을 구분하는 쿼리 키/값. `?catalog=mentoring` 이면 멘토링. */
export const CATALOG_QUERY_KEY = 'catalog';
export const MENTORING_CATALOG = 'mentoring';

const TABS = [
  { key: 'program', label: '프로그램', href: '/program' },
  {
    key: 'mentoring',
    label: '멘토링',
    href: `/program?${CATALOG_QUERY_KEY}=${MENTORING_CATALOG}`,
  },
] as const;

/*
  출시 전에는 「멘토링」 탭을 감춘다. 헤더 네비는 `SHOW_LIVE_MENTORING_NAV` 로 이미
  감추고 있었는데 이 탭이 그 플래그를 보지 않아, 네비에서 지운 뒤에도 프로그램 목록
  화면으로는 그대로 들어갈 수 있었다.

  탭을 통째로 숨기지 않고 목록만 줄이는 이유는, 이 nav 가 화면의 제목 역할을 겸하기
  때문이다. `ProgramsPage` 에는 제목이 따로 없어 통째로 지우면 목록만 덩그러니 남는다.
*/
const VISIBLE_TABS = TABS.filter(
  (tab) => tab.key !== 'mentoring' || SHOW_LIVE_MENTORING_NAV,
);

interface ProgramCatalogTabsProps {
  /** 현재 선택된 탭. */
  active: 'program' | 'mentoring';
}

/**
 * 프로그램 목록 최상단의 카탈로그 전환 탭.
 *
 * 두 카탈로그는 서로 다른 엔드포인트(`/program`, `/live-mentoring`)를 쓰고 필터 축도
 * 겹치지 않아 한 목록으로 합칠 수 없다. 그래서 섞지 않고 탭으로 나눈다.
 * 새로고침·뒤로가기·링크 공유가 되도록 상태는 URL 쿼리에 둔다(따라서 `<Link>` 이동).
 */
const ProgramCatalogTabs = ({ active }: ProgramCatalogTabsProps) => (
  <nav className="mb-8 flex items-center gap-6 md:mb-16">
    {VISIBLE_TABS.map((tab) => (
      <Link
        key={tab.key}
        href={tab.href}
        className={clsx(
          'text-medium24 md:text-xlarge28 font-bold transition-colors',
          tab.key === active ? 'text-neutral-0' : 'text-neutral-70',
        )}
      >
        {tab.label}
      </Link>
    ))}
  </nav>
);

export default ProgramCatalogTabs;
