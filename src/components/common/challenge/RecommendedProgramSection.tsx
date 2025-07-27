import { useChallengeQuery } from '@/api/program';
import RecommendedProgramSwiper from './RecommendedProgramSwiper';

import { ChallengeContent } from '@/types/interface';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import BaseButton from '../ui/button/BaseButton';

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
    <section className="mb-10 flex flex-col gap-5 bg-primary-5 pb-12 pt-10 md:mb-16">
      <div className="flex w-full max-w-[1120px] items-center justify-between px-5 md:mx-auto md:px-0">
        <h2 className="text-xsmall16 font-semibold md:text-small18">
          함께 들으면 더 좋아요. <br className="md:hidden" />
          참가자들이 선택한 프로그램만 모았어요.
        </h2>
        <button
          type="button"
          className="hidden text-xsmall14 font-medium text-neutral-45 md:block"
        >
          더보기
        </button>
      </div>
      <RecommendedProgramSwiper programs={programs} />
      <div className="px-5">
        <BaseButton
          variant="outlined"
          className="w-full rounded-xxs border bg-transparent md:hidden"
        >
          프로그램 더보기
        </BaseButton>
      </div>
    </section>
  );
}

export default RecommendedProgramSection;
