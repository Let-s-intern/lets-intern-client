import { Suspense } from 'react';

import { SHOW_LIVE_MENTORING_NAV } from '@/domain/live-mentoring/constants';
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
  /*
    탭을 감추는 것만으로는 부족하다. `?catalog=mentoring` 을 주소창에 직접 치면 탭이
    없어도 멘토링 목록이 그대로 나오므로 분기도 함께 막는다.

    상세 주소(`/live-mentoring/...`)는 플래그 주석대로 열어 둔다 — 멘토가 자기
    페이지를 확인하고 알림톡 링크로 들어오는 경로다. 여기서 막는 것은 목록 진입뿐이다.
  */
  const isMentoring =
    SHOW_LIVE_MENTORING_NAV &&
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
