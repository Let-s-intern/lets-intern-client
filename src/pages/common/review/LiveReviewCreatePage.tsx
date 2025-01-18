// TODO: 질문 enum으로 관리

import { useQuery } from '@tanstack/react-query';
import { josa } from 'es-hangul';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import RecommendReviewField from '@/components/common/review/section/RecommendReviewField';
import axios from '@/utils/axios';
import ReviewInstruction from '@components/common/review/ReviewInstruction';
import ReviewModal from '@components/common/review/ReviewModal';
import ReviewQuestion from '@components/common/review/ReviewQuestion';
import ReviewTextarea from '@components/common/review/ReviewTextarea';
import TenScore from '@components/common/review/score/TenScore';

const LiveReviewCreatePage = () => {
  const params = useParams();

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
    </ReviewModal>
  );
};

export default LiveReviewCreatePage;
