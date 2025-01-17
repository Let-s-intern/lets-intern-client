import { useQuery } from '@tanstack/react-query';
import { josa } from 'es-hangul';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import RecommendReviewField from '@/components/common/review/section/RecommendReviewField';
import axios from '@/utils/axios';
import ReviewQuestion from '@components/common/review/ReviewQuestion';
import TenScore from '@components/common/review/score/TenScore';
import BackHeader from '@components/common/ui/BackHeader';
import BaseButton from '@components/common/ui/button/BaseButton';
import TextArea from '@components/common/ui/input/TextArea';

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
      {/* 모바일 전용 헤더 */}
      <BackHeader to="/mypage/review" className="bg-white px-5">
        후기 작성
      </BackHeader>
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
          <section>
            <ReviewQuestion required>
              {josa(programTitle ?? '', '은/는')} 어떠셨나요?
            </ReviewQuestion>
            <p>{programTitle}의 만족도를 0~10점 사이로 평가해주세요!</p>
            <TenScore tenScore={satisfaction} setTenScore={setSatisfaction} />
          </section>

          {/* 추천 */}
          <section>
            <ReviewQuestion required>
              {josa(programTitle ?? '', '을/를')} 주변에 얼마나 추천하고
              싶으신가요?
            </ReviewQuestion>
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
            <ReviewQuestion required>
              {josa(programTitle ?? '', '을/를')} 참여하기 전의 목표를 어떻게
              달성하셨나요?
            </ReviewQuestion>
            <div>
              <span>oo님이 작성하신 챌린지 시작 전 목표 🎯</span>
              <br />
              {/* TODO: 사용자가 설정한 목표가 들어가야 함 */}
              <p>“이번에는 꼭 서류 합격률 50%가 넘는 이력서를 만들어보자!”</p>
            </div>
            <TextArea
              rows={3}
              placeholder="챌린지 참여 전의 목표를 어느 정도 달성하셨는지, 그 과정에서 챌린지가 어떤 도움을 주었는지 작성해주세요."
            />
          </section>

          {/* 만족했던 점 */}
          <section>
            <ReviewQuestion required>
              {josa(programTitle ?? '', '을/를')} 참여하면서 가장 만족했던 점을
              남겨주세요!
            </ReviewQuestion>
            <TextArea
              rows={3}
              placeholder="가장 도움이 되었던 미션이나, 학습 콘텐츠와 같이 참여하면서 가장 만족했던 점을 자유롭게 작성해주세요."
            />
          </section>

          {/* 아쉬웠던 점 */}
          <section>
            <ReviewQuestion required>
              {josa(programTitle ?? '', '을/를')} 참여하면서 가장 아쉬웠던 점을
              남겨주세요!
            </ReviewQuestion>
            <TextArea
              rows={3}
              placeholder="참여하면서 아쉬웠던 점이나 추가되었으면 좋겠는 내용이 있다면 자유롭게 작성해주세요."
            />
          </section>

          <BaseButton>등록하기</BaseButton>
        </div>
      </main>
    </div>
  );
};

export default ChallengeReviewCreatePage;
