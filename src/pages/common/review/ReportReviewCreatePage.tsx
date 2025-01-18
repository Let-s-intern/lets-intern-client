// TODO: 질문 enum으로 관리

import { useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { josa } from 'es-hangul';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import RecommendReviewField from '@/components/common/review/section/RecommendReviewField';
import { useControlScroll } from '@/hooks/useControlScroll';
import axios from '@/utils/axios';
import GoalOrConcernsBox from '@components/common/review/GoalOrConcernsBox';
import ReviewInstruction from '@components/common/review/ReviewInstruction';
import ReviewQuestion from '@components/common/review/ReviewQuestion';
import ReviewTextarea from '@components/common/review/ReviewTextarea';
import TenScore from '@components/common/review/score/TenScore';
import BackHeader from '@components/common/ui/BackHeader';
import BaseButton from '@components/common/ui/button/BaseButton';

const ReportReviewCreatePage = () => {
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

  const reportId = params.reportId;

  const { data: reportTitle } = useQuery({
    queryKey: ['report', reportId],
    queryFn: async () => {
      const res = await axios.get(`/report/${reportId}/title`);
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
        {/* 데스크탑 전용 닫기 버튼 */}
        <img
          src="/icons/menu_close_md.svg"
          alt="close"
          className="absolute right-6 top-6 z-10 hidden h-6 w-6 cursor-pointer md:block"
          onClick={() => {
            navigate('/mypage/review');
          }}
        />

        <div className="flex w-full flex-col gap-16 bg-white px-5 pb-8 pt-2 md:relative md:h-full md:w-[40rem] md:gap-8 md:overflow-y-scroll md:px-12 md:pb-32 md:pt-14">
          {/* 만족도 평가 */}
          <section>
            <ReviewQuestion required className="mb-1">
              1. {josa(reportTitle ?? '', '은/는')} 어떠셨나요?
            </ReviewQuestion>
            <ReviewInstruction className="mb-5">
              {reportTitle}의 만족도를 0~10점 사이로 평가해주세요!
            </ReviewInstruction>
            <TenScore tenScore={satisfaction} setTenScore={setSatisfaction} />
          </section>

          {/* 추천 정도*/}
          <section>
            <ReviewQuestion required className="mb-1">
              2. {josa(reportTitle ?? '', '을/를')} 주변에 얼마나 추천하고
              싶으신가요?
            </ReviewQuestion>
            <ReviewInstruction className="mb-5">
              {reportTitle}의 만족도를 0~10점 사이로 평가해주세요!
            </ReviewInstruction>
            {/* [참고] 몇 점을 선택하냐에 따라 질문이 증식함 */}
            <RecommendReviewField
              programTitle={reportTitle}
              tenScore={tenScore}
              setTenScore={setTenScore}
              hasRecommendationExperience={hasRecommendationExperience}
              setHasRecommendationExperience={setHasRecommendationExperience}
              npsAns={npsAns}
              setNpsAns={setNpsAns}
            />
          </section>

          {/* 서류 작성 고민 */}
          <section>
            <ReviewQuestion required className="mb-5">
              3. {reportTitle} 이용 후에 서류 작성 고민이 해결되셨나요?
            </ReviewQuestion>
            <GoalOrConcernsBox className="mb-3">
              <div className="max-h-64 overflow-y-auto px-5 py-3 md:max-h-[9.5rem]">
                <span className="text-xsmall14">
                  {/* TODO: 사용자 이름 넣어야 함 */}
                  🤔 <b>김렛츠</b>님이 작성하신 서류 고민
                </span>
                <br />
                {/* TODO: 사용자가 설정한 고민이 들어가야 함 */}
                <p className="text-xsmall16 font-bold">
                  내 서류는 완벽한데 도대체 왜 떨어지는지 모르겠어요!!
                </p>
              </div>
            </GoalOrConcernsBox>
            <ReviewTextarea
              placeholder={`${reportTitle} 이용 전의 고민을 어느 정도 해결하셨는지, 그 과정에서 ${reportTitle}가 어떤 도움을 주었는지 작성해주세요.`}
            />
          </section>

          {/* 만족했던 점 */}
          <section>
            <ReviewQuestion required className="mb-5">
              4. {josa(reportTitle ?? '', '을/를')} 참여하면서 가장 만족했던
              점을 남겨주세요!
            </ReviewQuestion>
            <ReviewTextarea placeholder="가장 도움이 되었던 미션이나, 학습 콘텐츠와 같이 참여하면서 가장 만족했던 점을 자유롭게 작성해주세요." />
          </section>

          {/* 아쉬웠던 점 */}
          <section>
            <ReviewQuestion required className="mb-5">
              5. {josa(reportTitle ?? '', '을/를')} 참여하면서 가장 아쉬웠던
              점을 남겨주세요!
            </ReviewQuestion>
            <ReviewTextarea placeholder="참여하면서 아쉬웠던 점이나 추가되었으면 좋겠는 내용이 있다면 자유롭게 작성해주세요." />
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

export default ReportReviewCreatePage;
