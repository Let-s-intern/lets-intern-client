'use client';

import { useRef, useState } from 'react';

import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import { MOBILE_MEDIA_QUERY } from '@/utils/constants';
import { useMediaQuery } from '@mui/material';

import BannerSection from './section/BannerSection';
import MentorCardSection from './section/MentorCardSection';
import MentorFilterSection from './section/MentorFilterSection';

const MentorsListPage = () => {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  const cardSectionRef = useRef<HTMLDivElement>(null);

  const hashTagIdList = Object.values(selected)
    .filter((value) => value !== 'all')
    .map(Number);

  const handleFilterChange = (next: Record<string, string>) => {
    setSelected(next);
    if (isMobile) {
      cardSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <main className="flex w-full flex-col">
      <BannerSection />
      <div className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-[1120px] px-5 sm:min-h-[calc(100vh-6rem)] xl:px-0">
        <MentorFilterSection
          selected={selected}
          onChange={handleFilterChange}
        />
        <div ref={cardSectionRef} className="scroll-mt-[140px] md:scroll-mt-0">
          <AsyncBoundary pendingFallback={null}>
            <MentorCardSection
              hashTagIdList={hashTagIdList}
              onResetFilters={() => setSelected({})}
            />
          </AsyncBoundary>
        </div>
      </div>
    </main>
  );
};

export default MentorsListPage;
