'use client';

// TODO: 질문 enum으로 관리

import { josa } from 'es-hangul';
import { Suspense, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

import { useGetLiveTitle } from '@/api/program';
import { usePostReviewMutation } from '@/api/review';
import ReviewInstruction from '@components/common/review/ReviewInstruction';
import ReviewModal from '@components/common/review/ReviewModal';
import ReviewQuestion from '@components/common/review/ReviewQuestion';
import ReviewTextarea from '@components/common/review/ReviewTextarea';
import TenScore from '@components/common/review/score/TenScore';

const LiveReviewCreatePageContent = () => {
  const router = useRouter();
  const params = useParams<{ programId: string }>();
  const programId = params.programId;
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('application');

  const { data: programTitle } = useGetLiveTitle(Number(programId));

  const { mutateAsync: tryPostReview, isPending: postReviewwIsPending } =
    usePostReviewMutation({
      successCallback: () => {
        alert('리뷰 작성이 완료되었습니다.');
        router.replace('/mypage/review');
      },
      errorCallback: (error) => {
        console.error('error', error);
      },
    });

  const [score, setScore] = useState<number | null>(null); // 만족도
  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [goodPoint, setGoodPoint] = useState<string>('');
  const [badPoint, setBadPoint] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [goalResult, setGoalResult] = useState<string>('');

  const isDisabled =
    !score || !npsScore || !goodPoint || !badPoint || !goal || !goalResult;

  const onClickSubmit = async () => {
    if (postReviewwIsPending) return;

    if (isDisabled) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    try {
      await tryPostReview({
        applicationId: applicationId ?? '',
        reviewForm: {
          type: 'LIVE_REVIEW',
          score,
          npsScore,
          reviewItemList: [
            {
              questionType: 'GOOD_POINT',
              answer: goodPoint,
            },
            {
              questionType: 'BAD_POINT',
              answer: badPoint,
            },
            { questionType: 'GOAL', answer: goal },
            { questionType: 'GOAL_RESULT', answer: goalResult },
          ],
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ReviewModal
      onSubmit={onClickSubmit}
      disabled={postReviewwIsPending || isDisabled}
    >
      {/* 만족도 평가 */}
      <section>
        <ReviewQuestion required className="mb-1">
          1. {josa(programTitle?.title ?? '', '은/는')} 어떠셨나요?
        </ReviewQuestion>
        <ReviewInstruction className="mb-5">
          {programTitle?.title}의 만족도를 0~10점 사이로 평가해주세요!
        </ReviewInstruction>
        <TenScore tenScore={score} setTenScore={setScore} />
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
        <TenScore tenScore={npsScore} setTenScore={setNpsScore} />
      </section>

      {/* 참여 이유 */}
      <section>
        <ReviewQuestion required className="mb-5">
          3. {programTitle?.title}에 참여하게 된 이유가 무엇인가요?
        </ReviewQuestion>
        <ReviewTextarea
          placeholder="LIVE 클래스를 통해 어떤 어려움을 해결하고 싶으셨는지, 알려주세요."
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
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
          value={goalResult}
          onChange={(e) => setGoalResult(e.target.value)}
        />
      </section>
      {/* 만족했던 점 */}
      <section>
        <ReviewQuestion required className="mb-5">
          5. {josa(programTitle?.title ?? '', '을/를')} 참여하면서 가장 만족했던
          점을 남겨주세요!
        </ReviewQuestion>
        <ReviewTextarea
          value={goodPoint}
          onChange={(e) => setGoodPoint(e.target.value)}
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
          value={badPoint}
          onChange={(e) => setBadPoint(e.target.value)}
          placeholder="참여하면서 아쉬웠던 점이나 추가되었으면 좋겠는 내용이 있다면 자유롭게 작성해주세요."
        />
      </section>
    </ReviewModal>
  );
};

const LiveReviewCreatePage = () => (
  <Suspense fallback={null}>
    <LiveReviewCreatePageContent />
  </Suspense>
);

export default LiveReviewCreatePage;
