'use client';

import { useMemo, useState } from 'react';

import BannerSection from './section/BannerSection';
import MentorCardSection from './section/MentorCardSection';
import MentorFilterSection from './section/MentorFilterSection';

const MentorsListPage = () => {
  const [selected, setSelected] = useState<Record<string, string>>({});

  const hashTagIdList = useMemo(
    () =>
      Object.values(selected)
        .filter((value) => value !== 'all')
        .map(Number),
    [selected],
  );

  return (
    <main className="flex w-full flex-col">
      <BannerSection />

      <div className="mx-auto w-full max-w-[1120px] px-5 xl:px-0">
        <MentorFilterSection selected={selected} onChange={setSelected} />
        <MentorCardSection hashTagIdList={hashTagIdList} />
      </div>
    </main>
  );
};

export default MentorsListPage;
