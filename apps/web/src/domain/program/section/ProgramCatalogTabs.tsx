import clsx from 'clsx';
import Link from 'next/link';

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
    {TABS.map((tab) => (
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
