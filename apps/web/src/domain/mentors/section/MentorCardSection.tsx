'use client';

import { useEffect, useState } from 'react';

import { mentorListQueryOptions } from '@/api/mentor/mentor';
import Logo from '@/assets/logo/logo_gray.svg?react';
import OutlinedButton from '@/common/button/OutlinedButton';
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
  onResetFilters: () => void;
}

const MentorCardSection = ({
  hashTagIdList,
  onResetFilters,
}: MentorCardSectionProps) => {
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
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-8 py-20">
        <div className="flex w-full flex-col items-center gap-6">
          <Logo width={34} height={34} />
          <div className="text-neutral-20 text-xsmall16 flex flex-col items-center gap-1 text-center">
            <p>선택한 조건에 맞는 멘토가 없어요.</p>
            <p>관심 직무나 취업 고민을 변경해 보세요!</p>
          </div>
        </div>
        <OutlinedButton onClick={onResetFilters} size="sm">
          다른 멘토 둘러보기
        </OutlinedButton>
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
