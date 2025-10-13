'use client';

// TODO: 질문 enum으로 관리

import { useMediaQuery } from '@mui/material';
import { josa } from 'es-hangul';
import { useParams, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { useGetReportTitle } from '@/api/report';
import { useGetProgramReviewDetail } from '@/api/review';
import { useUserQuery } from '@/api/user';
import GoalOrConcernsBox from '@components/common/review/GoalOrConcernsBox';
import ReviewInstruction from '@components/common/review/ReviewInstruction';
import ReviewModal from '@components/common/review/ReviewModal';
import ReviewQuestion from '@components/common/review/ReviewQuestion';
import ReviewTextarea from '@components/common/review/ReviewTextarea';
import TenScore from '@components/common/review/score/TenScore';

const ReportReviewPageContent = () => {
  const params = useParams<{ reportId: string }>();
  const isDesktop = useMediaQuery('(min-width:768px)');
  const reportId = params.reportId;
  const searchParams = useSearchParams();
  const reviewId = searchParams.get('reviewId');

  const { data: user } = useUserQuery({ enabled: true });

  const { data: programTitle } = useGetReportTitle(Number(reportId));

  const { data: reviewData } = useGetProgramReviewDetail(
    'REPORT_REVIEW',
    Number(reviewId),
  );
  const review = reviewData?.reviewInfo;
  const worry = review?.reviewItemList?.find(
    (r) => r.questionType === 'WORRY',
  )?.answer;
  const worryResult = review?.reviewItemList?.find(
    (r) => r.questionType === 'WORRY_RESULT',
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

      {/* 서류 작성 고민 */}
      <section>
        <ReviewQuestion required className="mb-5">
          3. {programTitle?.title} 이용 후에 서류 작성 고민이 해결되셨나요?
        </ReviewQuestion>
        {worry && (
          <GoalOrConcernsBox className="mb-3">
            <div className="max-h-64 overflow-y-auto px-5 py-3 md:max-h-[9.5rem]">
              <span className="text-xsmall14">
                {/* TODO: 사용자 이름 넣어야 함 */}
                🤔 <b>{user?.name}</b>님이 작성하신 서류 고민
              </span>
              <br />
              {/* TODO: 사용자가 설정한 고민이 들어가야 함 */}
              <p className="text-xsmall16 font-bold">{worry ?? '-'}</p>
            </div>
          </GoalOrConcernsBox>
        )}
        <ReviewTextarea
          placeholder={`${programTitle?.title} 이용 전의 고민을 어느 정도 해결하셨는지, ${isDesktop ? '\n' : ''}그 과정에서 ${programTitle?.title}가 어떤 도움을 주었는지 작성해주세요.`}
          value={worryResult ?? '-'}
          readOnly
        />
      </section>

      {/* 만족했던 점 */}
      <section>
        <ReviewQuestion required className="mb-5">
          4. {josa(programTitle?.title ?? '', '을/를')} 이용하면서 가장 만족했던
          점을 남겨주세요!
        </ReviewQuestion>
        <ReviewTextarea
          placeholder={`${programTitle?.title}에서 가장 도움이 되었던 내용이나 ${isDesktop ? '\n' : ''}이용하면서 가장 만족했던 점을 자유롭게 작성해주세요.`}
          value={goodPoint ?? '-'}
          readOnly
        />
      </section>

      {/* 아쉬웠던 점 */}
      <section>
        <ReviewQuestion required className="mb-5">
          5. {josa(programTitle?.title ?? '', '을/를')} 이용하면서 가장 아쉬웠던
          점을 남겨주세요!
        </ReviewQuestion>
        <ReviewTextarea
          placeholder={`이용하면서 아쉬웠던 점이나 추가되었으면 좋겠는 내용이 있다면 ${isDesktop ? '\n' : ''}자유롭게 작성해주세요.`}
          value={badPoint ?? '-'}
          readOnly
        />
      </section>
    </ReviewModal>
  );
};

const ReportReviewPage = () => {
  return (
    <Suspense fallback={null}>
      <ReportReviewPageContent />
    </Suspense>
  );
};

export default ReportReviewPage;
