'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { mentorDetailQueryOptions } from '@/api/mentor/mentor';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import LoadingContainer from '@/common/loading/LoadingContainer';

import MentorHeroSection from './MentorHeroSection';
import MentorIntroSection from './MentorIntroSection';
import MentorProgramSection from './MentorProgramSection';
import MentorReviewSection from './MentorReviewSection';

interface MentorDetailProps {
  mentorId: string;
}

const MentorDetailContent = ({ mentorId }: MentorDetailProps) => {
  const { data: mentor } = useSuspenseQuery(mentorDetailQueryOptions(mentorId));
  return (
    <>
      <MentorHeroSection mentor={mentor} />
      <MentorIntroSection mentor={mentor} />
      <MentorProgramSection
        proceedingProgramList={mentor.proceedingProgramList}
        postProgramList={mentor.postProgramList}
      />
      <MentorReviewSection reviewList={mentor.reviewList} />
    </>
  );
};

const MentorDetailPage = ({ mentorId }: MentorDetailProps) => {
  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-20 px-5 py-10 md:mb-14 md:px-0">
      <AsyncBoundary
        pendingFallback={
          <div className="flex min-h-[80vh] w-full items-center justify-center">
            <LoadingContainer />
          </div>
        }
      >
        <MentorDetailContent mentorId={mentorId} />
      </AsyncBoundary>
    </main>
  );
};

export default MentorDetailPage;
