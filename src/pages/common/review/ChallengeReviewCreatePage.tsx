// TODO: 질문 enum으로 관리

import { useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { josa } from 'es-hangul';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import RecommendReviewField from '@/components/common/review/section/RecommendReviewField';
import axios from '@/utils/axios';
import GoalOrConcernsBox from '@components/common/review/GoalOrConcernsBox';
import ReviewInstruction from '@components/common/review/ReviewInstruction';
import ReviewModal from '@components/common/review/ReviewModal';
import ReviewQuestion from '@components/common/review/ReviewQuestion';
import ReviewTextarea from '@components/common/review/ReviewTextarea';
import TenScore from '@components/common/review/score/TenScore';

const ChallengeReviewCreatePage = () => {
  const params = useParams();
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
      const res = await axios.get(`/challenge/${programId}/title`);
      return res.data.data.title;
    },
    retry: 1,
  });

  return (
    <ReviewModal>
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

      {/* 목표 달성 */}
      <section>
        <ReviewQuestion required className="mb-5">
          3. {josa(programTitle ?? '', '을/를')} 참여하기 전의 목표를 어떻게
          달성하셨나요?
        </ReviewQuestion>
        <GoalOrConcernsBox className="mb-3">
          <div className="max-h-64 overflow-y-auto px-5 py-3 md:max-h-[9.5rem]">
            <span className="text-xsmall14">
              {/* TODO: 사용자 이름 넣어야 함 */}
              🎯 <b>김렛츠</b>님이 작성하신 챌린지 시작 전 목표
            </span>
            <br />
            {/* TODO: 사용자가 설정한 목표가 들어가야 함 */}
            <p className="text-xsmall16 font-bold">
              “이번에는 꼭 서류 합격률 50%가 넘는 이력서를 만들어보자!”
            </p>
          </div>
        </GoalOrConcernsBox>
        <ReviewTextarea
          placeholder={`챌린지 참여 전의 목표를 어느 정도 달성하셨는지, ${isDesktop ? '\n' : ''}그 과정에서 챌린지가 어떤 도움을 주었는지 작성해주세요.`}
        />
      </section>

      {/* 만족했던 점 */}
      <section>
        <ReviewQuestion required className="mb-5">
          4. {josa(programTitle ?? '', '을/를')} 참여하면서 가장 만족했던 점을
          남겨주세요!
        </ReviewQuestion>
        <ReviewTextarea placeholder="가장 도움이 되었던 미션이나 학습 콘텐츠와 같이 참여하면서 가장 만족했던 점을 자유롭게 작성해주세요." />
      </section>

      {/* 아쉬웠던 점 */}
      <section>
        <ReviewQuestion required className="mb-5">
          5. {josa(programTitle ?? '', '을/를')} 참여하면서 가장 아쉬웠던 점을
          남겨주세요!
        </ReviewQuestion>
        <ReviewTextarea placeholder="참여하면서 아쉬웠던 점이나 추가되었으면 좋겠는 내용이 있다면 자유롭게 작성해주세요." />
      </section>
    </ReviewModal>
  );
};

export default ChallengeReviewCreatePage;
