// TODO: 질문 enum으로 관리

import { useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { josa } from 'es-hangul';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import axios from '@/utils/axios';
import GoalOrConcernsBox from '@components/common/review/GoalOrConcernsBox';
import ReviewInstruction from '@components/common/review/ReviewInstruction';
import ReviewModal from '@components/common/review/ReviewModal';
import ReviewQuestion from '@components/common/review/ReviewQuestion';
import ReviewTextarea from '@components/common/review/ReviewTextarea';
import TenScore from '@components/common/review/score/TenScore';

const ReportReviewCreatePage = () => {
  const params = useParams();
  const isDesktop = useMediaQuery('(min-width:768px)');

  const [score, setScore] = useState<number | null>(null);
  const [npsScore, setNpsScore] = useState<number | null>(null);
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

  return (
    <ReviewModal>
      {/* 만족도 평가 */}
      <section>
        <ReviewQuestion required className="mb-1">
          1. {josa(reportTitle ?? '', '은/는')} 어떠셨나요?
        </ReviewQuestion>
        <ReviewInstruction className="mb-5">
          {reportTitle}의 만족도를 0~10점 사이로 평가해주세요!
        </ReviewInstruction>
        <TenScore tenScore={score} setTenScore={setScore} />
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
        <TenScore tenScore={npsScore} setTenScore={setNpsScore} />
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
          placeholder={`${reportTitle} 이용 전의 고민을 어느 정도 해결하셨는지, ${isDesktop ? '\n' : ''}그 과정에서 ${reportTitle}가 어떤 도움을 주었는지 작성해주세요.`}
        />
      </section>

      {/* 만족했던 점 */}
      <section>
        <ReviewQuestion required className="mb-5">
          4. {josa(reportTitle ?? '', '을/를')} 참여하면서 가장 만족했던 점을
          남겨주세요!
        </ReviewQuestion>
        <ReviewTextarea
          placeholder={`${reportTitle}에서 가장 도움이 되었던 내용이나 ${isDesktop ? '\n' : ''}이용하면서 가장 만족했던 점을 자유롭게 작성해주세요.`}
        />
      </section>

      {/* 아쉬웠던 점 */}
      <section>
        <ReviewQuestion required className="mb-5">
          5. {josa(reportTitle ?? '', '을/를')} 참여하면서 가장 아쉬웠던 점을
          남겨주세요!
        </ReviewQuestion>
        <ReviewTextarea
          placeholder={`참여하면서 아쉬웠던 점이나 추가되었으면 좋겠는 내용이 있다면 ${isDesktop ? '\n' : ''}자유롭게 작성해주세요.`}
        />
      </section>
    </ReviewModal>
  );
};

export default ReportReviewCreatePage;
