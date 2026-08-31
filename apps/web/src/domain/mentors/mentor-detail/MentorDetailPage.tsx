'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import {
  mentorDetailQueryOptions,
  mentorStatsQueryOptions,
} from '@/api/mentor/mentor';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import LoadingContainer from '@/common/loading/LoadingContainer';

import type { MentorReviewItem } from '@/api/mentor/mentorSchema';

import MentorHeroSection from './MentorHeroSection';
import MentorIntroSection from './MentorIntroSection';
import MentorProgramSection from './MentorProgramSection';
import MentorReviewSection from './MentorReviewSection';

interface MentorDetailProps {
  mentorId: string;
}

const DUMMY_REVIEWS: MentorReviewItem[] = [
  {
    score: 5,
    programTitle: '자기소개서 피드백 REPORT',
    review:
      '많은 인사이트를 얻었습니다.\n제 포트폴리오에서 어떤 부분이 부족한지 정확히 짚어주셔서 개선 방향을 확실히 잡을 수 있었어요.\n진작에 받아볼걸 후회되긴 하지만, 지금이라도 멘토님에게 멘토링 받아서 다행이란 생각이 드네요. 또 칭찬과 격려도 많이 해주셔서 열심히 해볼 힘을 얻었습니다ㅋㅋㅋㅋ\n말씀 주신대로 곧 좋은 소식 들려드릴 수 있다면 정말 좋겠네요.',
    createDate: '2026-08-20T13:43:08.547Z',
  },
  {
    score: 4,
    programTitle: '자기소개서 피드백 REPORT',
    review: '친절하고 확실한 방향을 잡게 해주셨습니다.',
    createDate: '2026-08-25T09:10:00.000Z',
  },
  {
    score: 5,
    programTitle: null,
    review: '굳',
    createDate: '2026-07-30T18:00:00.000Z',
  },
];

const MentorDetailContent = ({ mentorId }: MentorDetailProps) => {
  const { data: mentor } = useSuspenseQuery(mentorDetailQueryOptions(mentorId));
  const { data: stats } = useSuspenseQuery(mentorStatsQueryOptions(mentorId));

  // TODO: 임시 더미 — 실제 후기 확인 후 mentor.reviewList / stats.averageScore 로 되돌릴 것.
  const usingDummy = mentor.reviewList.length === 0;
  const reviewList = usingDummy ? DUMMY_REVIEWS : mentor.reviewList;
  const averageScore = usingDummy
    ? DUMMY_REVIEWS.reduce((sum, r) => sum + r.score, 0) / DUMMY_REVIEWS.length
    : stats.averageScore;

  return (
    <>
      <MentorHeroSection mentor={mentor} stats={stats} />
      <MentorIntroSection mentor={mentor} />
      <MentorProgramSection
        proceedingProgramList={mentor.proceedingProgramList}
        postProgramList={mentor.postProgramList}
      />
      <MentorReviewSection
        reviewList={reviewList}
        averageScore={averageScore}
      />
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
