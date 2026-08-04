'use client';

import { useEffect, useState } from 'react';

import { useMentorListQuery } from '@/api/mentor/mentor';
import MuiPagination from '@/common/pagination/MuiPagination';

import MentorCard from '../ui/MentorCard';

const PAGE_SIZE = 12;

interface MentorCardSectionProps {
  hashTagIdList: number[];
}

const MentorCardSection = ({ hashTagIdList }: MentorCardSectionProps) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [hashTagIdList]);

  const { data, isLoading } = useMentorListQuery({
    hashTagIdList,
    page,
    size: PAGE_SIZE,
  });
  const mentors = data?.mentorList ?? [];
  const pageInfo = data?.pageInfo;

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    newPage: number,
  ) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="text-xsmall14 text-neutral-40 py-16 text-center">
        불러오는 중...
      </div>
    );
  }

  if (mentors.length === 0) {
    return (
      <div className="text-xsmall14 text-neutral-40 py-16 text-center">
        조건에 맞는 멘토가 없습니다.
      </div>
    );
  }

  return (
    <div className="mb-[60px] mt-10 flex flex-col gap-8">
      <section className="grid w-full grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4">
        {mentors.map((mentor) => (
          <MentorCard key={mentor.mentorId} mentor={mentor} />
        ))}
      </section>

      {pageInfo && pageInfo.totalPages > 1 && (
        <MuiPagination
          page={page}
          pageInfo={pageInfo}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default MentorCardSection;
