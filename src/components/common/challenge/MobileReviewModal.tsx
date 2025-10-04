import { useGetChallengeGoal, useGetChallengeTitle } from '@/api/challenge';
import { usePostReviewMutation } from '@/api/review';
import { useUserQuery } from '@/api/user';
import { useControlScroll } from '@/hooks/useControlScroll';
import ModalPortal from '@components/ui/ModalPortal';
import { josa } from 'es-hangul';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import GoalOrConcernsBox from '../review/GoalOrConcernsBox';
import ReviewInstruction from '../review/ReviewInstruction';
import ReviewQuestion from '../review/ReviewQuestion';
import ReviewTextarea from '../review/ReviewTextarea';
import TenScore from '../review/score/TenScore';
import BaseButton from '../ui/button/BaseButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function MobileReviewModal({ isOpen, onClose }: Props) {
  const params = useParams<{ programId: string; applicationId: string }>();

  const { data: user } = useUserQuery({ enabled: true });
  const { data: challengeGoal } = useGetChallengeGoal(params.programId);
  const { data: programTitle } = useGetChallengeTitle(Number(params.programId));

  const { mutateAsync: tryPostReview, isPending: postReviewIsPending } =
    usePostReviewMutation({
      challengeId: Number(params.programId),
      successCallback: () => {
        onClose();
      },
      errorCallback: (error) => {
        console.error('error', error);
      },
    });

  const [score, setScore] = useState<number | null>(null); // 만족도
  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [goodPoint, setGoodPoint] = useState<string>('');
  const [badPoint, setBadPoint] = useState<string>('');
  const [goalResult, setGoalResult] = useState<string>('');

  useControlScroll(isOpen); // body 스크롤 막기

  const isDisabled =
    !score || !npsScore || !goodPoint || !badPoint || !goalResult;

  const handleSubmit = async () => {
    if (postReviewIsPending) return;

    if (isDisabled) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    try {
      await tryPostReview({
        applicationId: params.applicationId ?? '',
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
          ],
        },
      });
    } catch (error) {
      console.error(error);
      alert('리뷰 작성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div
        className="fixed inset-x-0 top-0 z-50 flex h-screen flex-col gap-2 gap-8 overflow-auto bg-white px-5 py-12"
        role="dialog"
        aria-modal="true"
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
            placeholder={`챌린지 참여 전의 목표를 어느 정도 달성하셨는지, 그 과정에서 챌린지가 어떤 도움을 주었는지 작성해주세요.`}
          />
        </section>

        {/* 만족했던 점 */}
        <section>
          <ReviewQuestion required className="mb-5">
            4. {josa(programTitle?.title ?? '', '을/를')} 참여하면서 가장
            만족했던 점을 남겨주세요!
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
            5. {josa(programTitle?.title ?? '', '을/를')} 참여하면서 가장
            아쉬웠던 점을 남겨주세요!
          </ReviewQuestion>
          <ReviewTextarea
            value={badPoint}
            onChange={(e) => setBadPoint(e.target.value)}
            placeholder="참여하면서 아쉬웠던 점이나 추가되었으면 좋겠는 내용이 있다면 자유롭게 작성해주세요."
          />
        </section>

        <div className="flex flex-col gap-4">
          <BaseButton
            className="w-full text-small18 font-medium"
            onClick={handleSubmit}
            disabled={isDisabled}
          >
            제출하기
          </BaseButton>
          <button
            type="button"
            className="cursor-pointer text-small18 font-medium text-neutral-50 hover:underline"
            onClick={() => {
              if (onClose) {
                onClose();
                alert('미션 제출이 완료되었습니다.');
              }
            }}
          >
            다음에 할게요
          </button>
        </div>
      </div>
    </ModalPortal>
  );
}

export default MobileReviewModal;
