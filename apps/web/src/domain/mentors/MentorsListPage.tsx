'use client';

import { useState } from 'react';

import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';

import BannerSection from './section/BannerSection';
import MentorCardSection from './section/MentorCardSection';
import MentorFilterSection from './section/MentorFilterSection';

const MentorsListPage = () => {
  const [selected, setSelected] = useState<Record<string, string>>({});

  const hashTagIdList = Object.values(selected)
    .filter((value) => value !== 'all')
    .map(Number);

  return (
    <main className="flex w-full flex-col">
      <BannerSection />
      <div className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-[1120px] px-5 sm:min-h-[calc(100vh-6rem)] xl:px-0">
        <MentorFilterSection selected={selected} onChange={setSelected} />
        <AsyncBoundary pendingFallback={null}>
          <MentorCardSection
            hashTagIdList={hashTagIdList}
            onResetFilters={() => setSelected({})}
          />
        </AsyncBoundary>
      </div>
    </main>
  );
};

export default MentorsListPage;
