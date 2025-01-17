import { useQuery } from '@tanstack/react-query';
import { josa } from 'es-hangul';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import RecommendReviewSection from '@/components/common/review/section/RecommendReviewSection';
import axios from '@/utils/axios';
import TenScore from '@components/common/review/score/TenScore';
import BaseButton from '@components/common/ui/button/BaseButton';

const ChallengeReviewCreatePage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const [tenScore, setTenScore] = useState<number | null>(null);
  const [hasRecommendationExperience, setHasRecommendationExperience] =
    useState<boolean | null>(null);
  const [npsAns, setNpsAns] = useState('');

  const programId = params.programId;

  const { data: programTitle } = useQuery({
    queryKey: ['program', programId],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${programId}/title`);
      return res.data.data.title;
    },
    retry: 1,
  });

  return (
    <div className="mx-auto bg-neutral-0/50 md:fixed md:inset-0 md:z-50 md:flex md:flex-col md:items-center md:justify-center">
      <main className="relative md:overflow-hidden md:rounded-xl">
        <div className="flex w-full flex-col gap-16 bg-white px-5 md:max-h-[45rem] md:w-[40rem] md:overflow-y-scroll md:rounded-xl md:px-14 md:pb-6 md:pt-12">
          {/* 데스크탑 전용 닫기 버튼 */}
          <img
            src="/icons/menu_close_md.svg"
            alt="close"
            className="absolute right-6 top-6 hidden cursor-pointer md:block"
            onClick={() => {
              navigate(-1);
            }}
          />

          {/* 만족도 평가 */}
          <div>
            <h1 className="text-lg font-semibold">
              {josa(programTitle ?? '', '은/는')} 어떠셨나요?
              <span className="ml-1 text-requirement">*</span>
            </h1>
            <p>{programTitle}의 만족도를 0~10점 사이로 평가해주세요!</p>
            <TenScore tenScore={satisfaction} setTenScore={setSatisfaction} />
          </div>

          {/* 추천 */}
          <RecommendReviewSection
            programTitle={programTitle}
            tenScore={tenScore}
            setTenScore={setTenScore}
            hasRecommendationExperience={hasRecommendationExperience}
            setHasRecommendationExperience={setHasRecommendationExperience}
            npsAns={npsAns}
            setNpsAns={setNpsAns}
          />

          <BaseButton>등록하기</BaseButton>
        </div>
      </main>
    </div>
  );
};

export default ChallengeReviewCreatePage;
