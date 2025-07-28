import { useChallengeQuery } from '@/api/program';
import RecommendedProgramSwiper from './RecommendedProgramSwiper';

import { ChallengeContent } from '@/types/interface';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

function RecommendedProgramSection() {
  const params = useParams();
  const { data: challenge, isLoading } = useChallengeQuery(params.programId);

  const descJson = useMemo<ChallengeContent | null>(() => {
    if (!challenge?.desc) return null;
    try {
      return JSON.parse(challenge.desc);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [challenge?.desc]);

  const programs = descJson?.operationRecommendProgram?.list ?? [];

  if (isLoading || programs.length === 0) return null;

  return (
    <section className="mb-10 bg-primary-5 pb-12 pt-10 md:mb-16">
      <h2 className="mx-auto mb-5 max-w-[1120px] px-5 text-xsmall16 font-semibold md:px-0 md:text-small18">
        함께 들으면 더 좋아요. <br className="md:hidden" />
        참가자들이 선택한 프로그램만 모았어요.
      </h2>
      <RecommendedProgramSwiper programs={programs} />
    </section>
  );
}

export default RecommendedProgramSection;
