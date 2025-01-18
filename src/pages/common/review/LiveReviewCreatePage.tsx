// TODO: 질문 enum으로 관리

import { useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { josa } from 'es-hangul';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import RecommendReviewField from '@/components/common/review/section/RecommendReviewField';
import { useControlScroll } from '@/hooks/useControlScroll';
import axios from '@/utils/axios';
import ReviewInstruction from '@components/common/review/ReviewInstruction';
import ReviewQuestion from '@components/common/review/ReviewQuestion';
import ReviewTextarea from '@components/common/review/ReviewTextarea';
import TenScore from '@components/common/review/score/TenScore';
import BackHeader from '@components/common/ui/BackHeader';
import BaseButton from '@components/common/ui/button/BaseButton';

const LiveReviewCreatePage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery('(min-width:768px)');

  const [satisfaction, setSatisfaction] = useState<number | null>(null); // 만족도
  // 추천 리뷰(RecommendReviewField)에서 사용
  const [tenScore, setTenScore] = useState<number | null>(null);
  const [hasRecommendationExperience, setHasRecommendationExperience] =
    useState<boolean | null>(null);
  const [npsAns, setNpsAns] = useState('');
  ////

  const programId = params.programId;

  const { data: programTitle } = useQuery({
    queryKey: ['program', programId],
    queryFn: async () => {
      const res = await axios.get(`/live/${programId}/title`);
      return res.data.data.title;
    },
    retry: 1,
  });

  useControlScroll(isDesktop); // 데스크탑(모달)에서는 body 스크롤 제어

  return (
    // 바탕
    <div className="mx-auto bg-neutral-0/50 md:fixed md:inset-0 md:z-50 md:flex md:flex-col md:items-center md:justify-center md:py-24">
      {/* 모바일 전용 헤더 */}
      <BackHeader to="/mypage/review" className="bg-white px-5 md:hidden">
        후기 작성
      </BackHeader>

      <main className="relative md:overflow-hidden md:rounded-ms">
        <div className="flex w-full flex-col gap-16 bg-white px-5 pb-8 pt-2 md:relative md:h-full md:w-[40rem] md:gap-8 md:overflow-y-scroll md:px-12 md:pb-32 md:pt-14">
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
          <section>
            <ReviewQuestion required className="mb-1">
              1. {josa(programTitle ?? '', '은/는')} 어떠셨나요?
            </ReviewQuestion>
            <ReviewInstruction className="mb-5">
              {programTitle}의 만족도를 0~10점 사이로 평가해주세요!
            </ReviewInstruction>
            <TenScore tenScore={satisfaction} setTenScore={setSatisfaction} />
          </section>

          {/* 추천 정도*/}
          <section>
            <ReviewQuestion required className="mb-1">
              2. {josa(programTitle ?? '', '을/를')} 주변에 얼마나 추천하고
              싶으신가요?
            </ReviewQuestion>
            <ReviewInstruction className="mb-5">
              {programTitle}의 만족도를 0~10점 사이로 평가해주세요!
            </ReviewInstruction>
            {/* [참고] 몇 점을 선택하냐에 따라 질문이 증식함 */}
            <RecommendReviewField
              programTitle={programTitle}
              tenScore={tenScore}
              setTenScore={setTenScore}
              hasRecommendationExperience={hasRecommendationExperience}
              setHasRecommendationExperience={setHasRecommendationExperience}
              npsAns={npsAns}
              setNpsAns={setNpsAns}
            />
          </section>

          {/* 참여 이유 */}
          <section>
            <ReviewQuestion required className="mb-5">
              3. {programTitle}에 참여하게 된 이유가 무엇인가요?
            </ReviewQuestion>
            <ReviewTextarea placeholder="LIVE 클래스를 통해 어떤 어려움을 해결하고 싶으셨는지, 알려주세요." />
          </section>

          {/* 어려움 */}
          <section>
            <ReviewQuestion required className="mb-5">
              4. {programTitle}에 참여 후 위에 작성해주신 어려움이 해결되셨나요?
            </ReviewQuestion>
            <ReviewTextarea placeholder="어려움을 해결하는 과정에서 LIVE 클래스가 어떤 도움을 주었는지 작성해주세요." />
          </section>

          {/* 전반적인 후기 */}
          <section>
            <ReviewQuestion required className="mb-5">
              5. 렛츠커리어에게 하고 싶은 말이나, 전반적인 후기를 남겨주세요!*
            </ReviewQuestion>
            <ReviewTextarea placeholder="참여하면서 아쉬웠던 점이나 신청을 고민할 취준생분들을 위해 추천 이유를 자유롭게 작성해주세요." />
          </section>

          {/* 모바일 버튼 */}
          <BaseButton className="md:hidden">등록하기</BaseButton>
        </div>
        {/* 데스크탑 버튼 (아래 고정) */}
        <div className="sticky inset-x-0 bottom-0 hidden bg-white px-14 pb-8 pt-6 drop-shadow-[0_-3px_6px_0_rgba(0,0,0,0.04)] md:block">
          <BaseButton className="w-full">등록하기</BaseButton>
        </div>
      </main>
    </div>
  );
};

export default LiveReviewCreatePage;
