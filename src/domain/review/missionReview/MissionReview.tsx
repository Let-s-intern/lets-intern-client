'use client';

import { useState } from 'react';
import MissionReviewContentSection from './MissionReviewContentSection';
import MissionReviewFilterSection from './MissionReviewFilterSection';

const MissionReview = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <MissionReviewFilterSection onChangeFilter={() => setCurrentPage(1)} />
      <MissionReviewContentSection
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default MissionReview;
