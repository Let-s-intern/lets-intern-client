'use client';

// TODO: 질문 enum으로 관리

import { useMediaQuery } from '@mui/material';
import { josa } from 'es-hangul';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

import { useGetReportMessage, useGetReportTitle } from '@/api/report';
import { usePostReviewMutation } from '@/api/review/review';
import { useUserQuery } from '@/api/user/user';
import GoalOrConcernsBox from '@/domain/review/form/GoalOrConcernsBox';
import ReviewInstruction from '@/domain/review/form/ReviewInstruction';
import ReviewModal from '@/domain/review/modal/ReviewModal';
import ReviewQuestion from '@/domain/review/form/ReviewQuestion';
import ReviewTextarea from '@/domain/review/form/ReviewTextarea';
import TenScore from '@/domain/review/score/TenScore';

const ReportReviewCreatePageContent = () => {
  const router = useRouter();
  const params = useParams<{ reportId: string }>();
  const isDesktop = useMediaQuery('(min-width:768px)');
  const reportId = params.reportId;
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('application');

  const { data: user } = useUserQuery({ enabled: true });

  const { data: reportMessage } = useGetReportMessage(Number(applicationId));

  const { data: programTitle } = useGetReportTitle(Number(reportId));

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

  const [score, setScore] = useState<number | null>(null);
  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [goodPoint, setGoodPoint] = useState<string>('');
  const [badPoint, setBadPoint] = useState<string>('');
  const [worryResult, setWorryResult] = useState<string>('');

  const isDisabled =
    !score || !npsScore || !goodPoint || !badPoint || !worryResult;

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
          type: 'REPORT_REVIEW',
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
              questionType: 'WORRY_RESULT',
              answer: worryResult,
            },
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

      {/* 서류 작성 고민 */}
      <section>
        <ReviewQuestion required className="mb-5">
          3. {programTitle?.title} 이용 후에 서류 작성 고민이 해결되셨나요?
        </ReviewQuestion>
        {reportMessage?.message && (
          <GoalOrConcernsBox className="mb-3">
            <div className="max-h-64 overflow-y-auto px-5 py-3 md:max-h-[9.5rem]">
              <span className="text-xsmall14">
                {/* TODO: 사용자 이름 넣어야 함 */}
                🤔 <b>{user?.name}</b>님이 작성하신 서류 고민
              </span>
              <br />
              {/* TODO: 사용자가 설정한 고민이 들어가야 함 */}
              <p className="text-xsmall16 font-bold">
                {reportMessage?.message ?? '-'}
              </p>
            </div>
          </GoalOrConcernsBox>
        )}
        <ReviewTextarea
          placeholder={`${programTitle?.title} 이용 전의 고민을 어느 정도 해결하셨는지, ${isDesktop ? '\n' : ''}그 과정에서 ${programTitle?.title}가 어떤 도움을 주었는지 작성해주세요.`}
          value={worryResult}
          onChange={(e) => setWorryResult(e.target.value)}
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
          value={goodPoint}
          onChange={(e) => setGoodPoint(e.target.value)}
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
          value={badPoint}
          onChange={(e) => setBadPoint(e.target.value)}
        />
      </section>
    </ReviewModal>
  );
};

const ReportReviewCreatePage = () => (
  <Suspense fallback={null}>
    <ReportReviewCreatePageContent />
  </Suspense>
);

export default ReportReviewCreatePage;
