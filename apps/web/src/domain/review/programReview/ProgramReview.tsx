'use client';

import { useState } from 'react';
import ProgramReviewContentSection from './ProgramReviewContentSection';
import ProgramReviewFilterSection from './ProgramReviewFilterSection';

function ProgramReview() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <ProgramReviewFilterSection onChangeFilter={() => setCurrentPage(1)} />
      <ProgramReviewContentSection
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}

export default ProgramReview;
