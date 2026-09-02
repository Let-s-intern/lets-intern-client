import { Suspense } from 'react';

import LiveMentoringListPage from '@/domain/live-mentoring/list/LiveMentoringListPage';
import ProgramCatalogTabs, {
  CATALOG_QUERY_KEY,
  MENTORING_CATALOG,
} from '@/domain/program/section/ProgramCatalogTabs';
import ProgramsPage from '@/domain/program/ProgramsPage';
import type { Metadata } from 'next';

const title = '프로그램 목록 | 렛츠커리어';
const description = '렛츠커리어의 프로그램 목록 페이지입니다.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/program',
  },
  openGraph: {
    type: 'website',
    title,
    url: '/program',
    description,
    siteName: '렛츠커리어',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
};

const ProgramPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const isMentoring =
    (await searchParams)[CATALOG_QUERY_KEY] === MENTORING_CATALOG;

  return (
    <div className="mw-1180 mx-auto w-full pb-[120px] pt-8 md:px-0 md:pt-12">
      <ProgramCatalogTabs active={isMentoring ? 'mentoring' : 'program'} />
      <Suspense fallback={null}>
        {isMentoring ? <LiveMentoringListPage /> : <ProgramsPage />}
      </Suspense>
    </div>
  );
};

export default ProgramPage;
