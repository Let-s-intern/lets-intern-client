'use client';

import { useMediaQuery } from '@mui/material';
import { josa } from 'es-hangul';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

import {
  useGetChallengeGoal,
  useGetChallengeTitle,
} from '@/api/challenge/challenge';
import { usePostReviewMutation } from '@/api/review/review';
import { useUserQuery } from '@/api/user/user';
import GoalOrConcernsBox from '@/domain/review/GoalOrConcernsBox';
import ReviewInstruction from '@/domain/review/ReviewInstruction';
import ReviewModal from '@/domain/review/ReviewModal';
import ReviewQuestion from '@/domain/review/ReviewQuestion';
import ReviewTextarea from '@/domain/review/ReviewTextarea';
import TenScore from '@/domain/review/score/TenScore';

const ChallengeReviewCreatePageContent = () => {
  const params = useParams<{ programId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width:768px)');
  const programId = params.programId;
  const applicationId = searchParams.get('application');

  const { data: user } = useUserQuery({ enabled: true });

  const { data: challengeGoal } = useGetChallengeGoal(programId);

  const { data: programTitle } = useGetChallengeTitle(Number(programId));

  const { mutateAsync: tryPostReview, isPending: postReviewwIsPending } =
    usePostReviewMutation({
      challengeId: Number(programId),
      successCallback: () => {
        alert('리뷰 작성이 완료되었습니다.');
        router.replace('/mypage/review');
      },
      errorCallback: (error) => {
        console.error('error', error);
      },
    });

  const isFeedbackApplied = challengeGoal?.isFeedbackApplied ?? false;

  const [score, setScore] = useState<number | null>(null); // 만족도
  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [goodPoint, setGoodPoint] = useState<string>('');
  const [badPoint, setBadPoint] = useState<string>('');
  const [goalResult, setGoalResult] = useState<string>('');
  const [feedbackMentorNickname, setFeedbackMentorNickname] =
    useState<string>('');
  const [feedbackGoodPoint, setFeedbackGoodPoint] = useState<string>('');
  const [feedbackBadPoint, setFeedbackBadPoint] = useState<string>('');

  const isDisabled =
    !score ||
    !npsScore ||
    !goodPoint ||
    !badPoint ||
    !goalResult ||
    (isFeedbackApplied &&
      (!feedbackMentorNickname || !feedbackGoodPoint || !feedbackBadPoint));

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
          type: 'CHALLENGE_REVIEW',
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
            {
              questionType: 'GOAL_RESULT',
              answer: goalResult,
            },
            ...(isFeedbackApplied
              ? [
                  {
                    questionType: 'FEEDBACK_MENTOR_NICKNAME' as const,
                    answer: feedbackMentorNickname,
                  },
                  {
                    questionType: 'FEEDBACK_GOOD_POINT' as const,
                    answer: feedbackGoodPoint,
                  },
                  {
                    questionType: 'FEEDBACK_BAD_POINT' as const,
                    answer: feedbackBadPoint,
                  },
                ]
              : []),
          ],
        },
      });
    } catch (error) {
      console.error(error);
      alert('리뷰 작성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <ReviewModal
      disabled={postReviewwIsPending || isDisabled}
      onSubmit={onClickSubmit}
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

      {/* 목표 달성 */}
      <section>
        <ReviewQuestion required className="mb-5">
          3. {josa(programTitle?.title ?? '', '을/를')} 참여하기 전의 목표를
          어떻게 달성하셨나요?
        </ReviewQuestion>
        {challengeGoal?.goal && (
          <GoalOrConcernsBox className="mb-3">
            <div className="max-h-64 overflow-y-auto px-5 py-3 md:max-h-[9.5rem]">
              <span className="text-xsmall14">
                {/* TODO: 사용자 이름 넣어야 함 */}
                🎯 <b>{user?.name}</b>님이 작성하신 챌린지 시작 전 목표
              </span>
              <br />
              {/* TODO: 사용자가 설정한 목표가 들어가야 함 */}
              <p className="text-xsmall16 font-bold">
                {challengeGoal?.goal ?? '-'}
              </p>
            </div>
          </GoalOrConcernsBox>
        )}
        <ReviewTextarea
          value={goalResult}
          onChange={(e) => setGoalResult(e.target.value)}
          placeholder={`챌린지 참여 전의 목표를 어느 정도 달성하셨는지, ${isDesktop ? '\n' : ''}그 과정에서 챌린지가 어떤 도움을 주었는지 작성해주세요.`}
        />
      </section>

      {/* 만족했던 점 */}
      <section>
        <ReviewQuestion required className="mb-5">
          4. {josa(programTitle?.title ?? '', '을/를')} 참여하면서 가장 만족했던
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
          5. {josa(programTitle?.title ?? '', '을/를')} 참여하면서 가장 아쉬웠던
          점을 남겨주세요!
        </ReviewQuestion>
        <ReviewTextarea
          value={badPoint}
          onChange={(e) => setBadPoint(e.target.value)}
          placeholder="참여하면서 아쉬웠던 점이나 추가되었으면 좋겠는 내용이 있다면 자유롭게 작성해주세요."
        />
      </section>

      {isFeedbackApplied && (
        <>
          {/* 피드백 멘토 닉네임 */}
          <section>
            <ReviewQuestion required className="mb-5">
              6. {josa(programTitle?.title ?? '', '을/를')} 진행해 주신 멘토님의
              닉네임을 작성해 주세요!
            </ReviewQuestion>
            <ReviewTextarea
              value={feedbackMentorNickname}
              onChange={(e) => setFeedbackMentorNickname(e.target.value)}
            />
          </section>

          {/* 피드백 만족했던 점 */}
          <section>
            <ReviewQuestion required className="mb-5">
              7. 1:1 피드백에서 가장 도움이 되었거나 유익했던 점, 멘토님께
              감사한 점 등을 남겨주세요!
            </ReviewQuestion>
            <ReviewTextarea
              value={feedbackGoodPoint}
              onChange={(e) => setFeedbackGoodPoint(e.target.value)}
            />
          </section>

          {/* 피드백 아쉬웠던 점 */}
          <section>
            <ReviewQuestion required className="mb-5">
              8. 1:1 피드백에서 개선이 필요하다고 생각하는 점을 남겨주세요!
            </ReviewQuestion>
            <ReviewTextarea
              value={feedbackBadPoint}
              onChange={(e) => setFeedbackBadPoint(e.target.value)}
            />
          </section>
        </>
      )}
    </ReviewModal>
  );
};

const ChallengeReviewCreatePage = () => {
  return (
    <Suspense fallback={null}>
      <ChallengeReviewCreatePageContent />
    </Suspense>
  );
};

export default ChallengeReviewCreatePage;
