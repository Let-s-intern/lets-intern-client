'use client';

import { josa } from 'es-hangul';
import { useParams, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { useGetLiveTitle } from '@/api/program';
import { useGetProgramReviewDetail } from '@/api/review';
import ReviewInstruction from '@/domain/review/ReviewInstruction';
import ReviewModal from '@/domain/review/ReviewModal';
import ReviewQuestion from '@/domain/review/ReviewQuestion';
import ReviewTextarea from '@/domain/review/ReviewTextarea';
import TenScore from '@/domain/review/score/TenScore';

const LiveReviewPageContent = () => {
  const params = useParams<{ programId: string }>();
  const searchParams = useSearchParams();
  const programId = params.programId;
  const reviewId = searchParams.get('reviewId');

  const { data: programTitle } = useGetLiveTitle(Number(programId));

  const { data: reviewData } = useGetProgramReviewDetail(
    'LIVE_REVIEW',
    Number(reviewId),
  );
  const review = reviewData?.reviewInfo;
  const goal = review?.reviewItemList?.find(
    (r) => r.questionType === 'GOAL',
  )?.answer;
  const goalResult = review?.reviewItemList?.find(
    (r) => r.questionType === 'GOAL_RESULT',
  )?.answer;
  const goodPoint = review?.reviewItemList?.find(
    (r) => r.questionType === 'GOOD_POINT',
  )?.answer;
  const badPoint = review?.reviewItemList?.find(
    (r) => r.questionType === 'BAD_POINT',
  )?.answer;

  return (
    <ReviewModal readOnly>
      {/* 만족도 평가 */}
      <section>
        <ReviewQuestion required className="mb-1">
          1. {josa(programTitle?.title ?? '', '은/는')} 어떠셨나요?
        </ReviewQuestion>
        <ReviewInstruction className="mb-5">
          {programTitle?.title}의 만족도를 0~10점 사이로 평가해주세요!
        </ReviewInstruction>
        <TenScore tenScore={review?.reviewInfo.score ?? 0} />
      </section>

      {/* 추천 정도*/}
      <section>
        <ReviewQuestion required className="mb-1">
          2. {josa(programTitle?.title ?? '', '을/를')} 주변에 얼마나 추천하고
          싶으신가요?
        </ReviewQuestion>
        <ReviewInstruction className="mb-5">
          {programTitle?.title}의 만족도를 0~10점 사이로 평가해주세요!
        </ReviewInstruction>
        <TenScore tenScore={review?.reviewInfo.npsScore ?? 0} />
      </section>

      {/* 참여 이유 */}
      <section>
        <ReviewQuestion required className="mb-5">
          3. {programTitle?.title}에 참여하게 된 이유가 무엇인가요?
        </ReviewQuestion>
        <ReviewTextarea
          placeholder="LIVE 클래스를 통해 어떤 어려움을 해결하고 싶으셨는지, 알려주세요."
          value={goal ?? ''}
          readOnly
        />
      </section>

      {/* 어려움 */}
      <section>
        <ReviewQuestion required className="mb-5">
          4. {programTitle?.title}에 참여 후 위에 작성해주신 어려움이
          해결되셨나요?
        </ReviewQuestion>
        <ReviewTextarea
          placeholder="어려움을 해결하는 과정에서 LIVE 클래스가 어떤 도움을 주었는지 작성해주세요."
          value={goalResult ?? ''}
          readOnly
        />
      </section>
      {/* 만족했던 점 */}
      <section>
        <ReviewQuestion required className="mb-5">
          5. {josa(programTitle?.title ?? '', '을/를')} 참여하면서 가장 만족했던
          점을 남겨주세요!
        </ReviewQuestion>
        <ReviewTextarea
          value={goodPoint ?? ''}
          readOnly
          placeholder="가장 도움이 되었던 미션이나 학습 콘텐츠와 같이 참여하면서 가장 만족했던 점을 자유롭게 작성해주세요."
        />
      </section>

      {/* 아쉬웠던 점 */}
      <section>
        <ReviewQuestion required className="mb-5">
          6. {josa(programTitle?.title ?? '', '을/를')} 참여하면서 가장 아쉬웠던
          점을 남겨주세요!
        </ReviewQuestion>
        <ReviewTextarea
          value={badPoint ?? ''}
          readOnly
          placeholder="참여하면서 아쉬웠던 점이나 추가되었으면 좋겠는 내용이 있다면 자유롭게 작성해주세요."
        />
      </section>
    </ReviewModal>
  );
};

const LiveReviewPage = () => (
  <Suspense fallback={null}>
    <LiveReviewPageContent />
  </Suspense>
);

export default LiveReviewPage;
