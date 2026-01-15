import { useMediaQuery } from '@mui/material';
import { josa } from 'es-hangul';

import { useGetChallengeTitle } from '@/api/challenge';
import { useGetProgramReviewDetail } from '@/api/review';
import { useUserQuery } from '@/api/user';
import GoalOrConcernsBox from '@/domain/review/GoalOrConcernsBox';
import ReviewInstruction from '@/domain/review/ReviewInstruction';
import ReviewModal from '@/domain/review/ReviewModal';
import ReviewQuestion from '@/domain/review/ReviewQuestion';
import ReviewTextarea from '@/domain/review/ReviewTextarea';
import TenScore from '@/domain/review/score/TenScore';

interface DashboardReviewModalProps {
  programId: string;
  reviewId: string;
  onClose: () => void;
}

const DashboardReviewModal = ({
  programId,
  reviewId,
  onClose,
}: DashboardReviewModalProps) => {
  const isDesktop = useMediaQuery('(min-width:768px)');

  const { data: user } = useUserQuery({ enabled: true });

  const { data: programTitle } = useGetChallengeTitle(Number(programId));

  const { data: reviewData } = useGetProgramReviewDetail(
    'CHALLENGE_REVIEW',
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
    <ReviewModal readOnly onClose={onClose}>
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

      {/* 목표 달성 */}
      <section>
        <ReviewQuestion required className="mb-5">
          3. {josa(programTitle?.title ?? '', '을/를')} 참여하기 전의 목표를
          어떻게 달성하셨나요?
        </ReviewQuestion>
        {goal && (
          <GoalOrConcernsBox className="mb-3">
            <div className="max-h-64 overflow-y-auto px-5 py-3 md:max-h-[9.5rem]">
              <span className="text-xsmall14">
                {/* TODO: 사용자 이름 넣어야 함 */}
                🎯 <b>{user?.name}</b>님이 작성하신 챌린지 시작 전 목표
              </span>
              <br />
              {/* TODO: 사용자가 설정한 목표가 들어가야 함 */}
              <p className="text-xsmall16 font-bold">{goal ?? '-'}</p>
            </div>
          </GoalOrConcernsBox>
        )}
        <ReviewTextarea
          value={goalResult ?? '-'}
          readOnly
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
          value={goodPoint ?? '-'}
          readOnly
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
          value={badPoint ?? '-'}
          readOnly
          placeholder="참여하면서 아쉬웠던 점이나 추가되었으면 좋겠는 내용이 있다면 자유롭게 작성해주세요."
        />
      </section>
    </ReviewModal>
  );
};

export default DashboardReviewModal;
