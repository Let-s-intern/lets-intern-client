'use client';

import { useEffect, useState } from 'react';

import { mentorListQueryOptions } from '@/api/mentor/mentor';
import LoadingContainer from '@/common/loading/LoadingContainer';
import MuiPagination from '@/common/pagination/MuiPagination';
import { MOBILE_MEDIA_QUERY } from '@/utils/constants';
import { useMediaQuery } from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import MentorCard from '../ui/MentorCard';

const DESKTOP_PAGE_SIZE = 12;
const MOBILE_PAGE_SIZE = 8;

interface MentorCardSectionProps {
  hashTagIdList: number[];
}

const MentorCardSection = ({ hashTagIdList }: MentorCardSectionProps) => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;

  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [hashTagIdList, pageSize]);

  const { data, isLoading, isError } = useQuery({
    ...mentorListQueryOptions({ hashTagIdList, page, size: pageSize }),
    placeholderData: keepPreviousData,
  });

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    newPage: number,
  ) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading || !data) {
    return (
      <div className="mt-10 flex min-h-[60vh] w-full items-center justify-center">
        <LoadingContainer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-xsmall14 text-neutral-40 py-16 text-center">
        멘토 목록을 불러오지 못했습니다.
      </div>
    );
  }

  const mentors = data.mentorList;
  const pageInfo = data.pageInfo;

  if (mentors.length === 0) {
    return (
      <div className="text-xsmall14 text-neutral-40 py-16 text-center">
        조건에 맞는 멘토가 없습니다.
      </div>
    );
  }

  return (
    <div className="mb-[60px] mt-10 flex flex-col gap-8">
      <section className="grid w-full grid-cols-2 gap-x-5 gap-y-5 md:grid-cols-4 md:gap-x-4">
        {mentors.map((mentor) => (
          <MentorCard key={mentor.mentorId} mentor={mentor} />
        ))}
      </section>

      {pageInfo.totalPages > 1 && (
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
