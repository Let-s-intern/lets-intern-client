import { useEditReviewVisible } from '@/api/challenge';
import {
  convertReportPriceType,
  ReportPriceType,
  useGetReportPaymentDetailQuery,
} from '@/api/report';
import { useUserDetailAdminQuery } from '@/api/user';
import { ReviewType } from '@/schema';
import { gradeToText } from '@/utils/convert';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import { Checkbox } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import TD from '../../../ui/table/regacy/TD';

interface ReviewTableBodyProps {
  type: string;
  programTitle?: string | null;
  createDate?: string | null;
  reviewList: ReviewType[];
}

const TableBody = ({
  type,
  programTitle,
  createDate,
  reviewList,
}: ReviewTableBodyProps) => {
  const { mutate: editReviewVisible } = useEditReviewVisible();
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null | undefined>(null);

  const {
    data: paymentDetail,
    isLoading: paymentDetailIsLoading,
    isFetching: paymentDetailIsFetching,
  } = useGetReportPaymentDetailQuery({
    applicationId: Number(applicationId),
    enabled: type === 'REPORT' && applicationId !== null,
  });

  const {
    data: userDetail,
    isLoading: userDetailIsLoading,
    isFetching: userDetailIsFetching,
  } = useUserDetailAdminQuery({
    userId: userId ?? 0,
    enabled: userId !== null,
  });

  const handleVisibleCheckboxClicked = (
    reviewId: number,
    isVisible: boolean,
  ) => {
    editReviewVisible({ reviewId, isVisible, type, programTitle, createDate });
  };

  return (
    <tbody>
      {reviewList.map((review) => (
        <tr key={review.id}>
          <TD>{dayjs(review.createdDate).format('YYYY.MM.DD')}</TD>
          <TD>{review.programTitle ?? '프로그램 없음'}</TD>
          {type === 'REPORT' && (
            <TD>
              <div
                className="underline"
                onClick={() => setApplicationId(review.applicationId ?? null)}
              >
                보기
              </div>
            </TD>
          )}
          <TD>{review.name ?? '-'}</TD>
          <TD>{review.nps}</TD>
          <TD>
            <p className="mx-auto w-full max-w-60 whitespace-pre-wrap break-words text-center">
              {review.npsAns}
            </p>
          </TD>
          <TD>{review.npsCheckAns ? '추천' : '비추천'}</TD>
          <TD>{review.score}</TD>
          <TD>
            <p className="mx-auto w-full max-w-60 whitespace-pre-wrap break-words text-center">
              {review.content}
            </p>
          </TD>
          <TD>
            <Checkbox
              checked={review.isVisible ?? false}
              onChange={() =>
                handleVisibleCheckboxClicked(review.id, !review.isVisible)
              }
            />
          </TD>
        </tr>
      ))}
      {applicationId !== null && (
        <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black/10">
          <div className="flex min-h-64 min-w-96 flex-col justify-center rounded-sm bg-white px-8 py-6">
            <h1 className="text-lg font-bold">결제정보</h1>
            {paymentDetailIsLoading || paymentDetailIsFetching ? (
              <LoadingContainer />
            ) : !paymentDetail ? (
              <div>데이터가 없습니다.</div>
            ) : (
              <div className="mt-5 flex w-full flex-col gap-y-3 text-xsmall14">
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">주문번호</h2>
                  <p>{paymentDetail.tossInfo?.orderId || '-'}</p>
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">결제상품</h2>
                  <p>
                    {convertReportPriceType(
                      (paymentDetail.reportApplicationInfo
                        .reportPriceType as ReportPriceType) || '-',
                    )}
                  </p>
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">옵션</h2>
                  <div>
                    {!paymentDetail.reportPaymentInfo.reportOptionInfos ||
                    paymentDetail.reportPaymentInfo.reportOptionInfos.length ===
                      0
                      ? '없음'
                      : paymentDetail.reportPaymentInfo.reportOptionInfos.map(
                          (option) => (
                            <p key={option?.title}>{option?.title}</p>
                          ),
                        )}
                  </div>
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">1:1 피드백</h2>
                  <p>
                    {paymentDetail.reportApplicationInfo.reportFeedbackStatus
                      ? 'O'
                      : 'X'}
                  </p>
                </div>
                <hr />
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">쿠폰</h2>
                  <p>-</p>
                  {/* <p>{applicationModal.application.couponTitle ?? '없음'}</p> */}
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">결제금액</h2>
                  <p>
                    {paymentDetail.reportPaymentInfo.finalPrice?.toLocaleString() ||
                      '-'}
                  </p>
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">환불여부</h2>
                  <p>
                    {paymentDetail.reportPaymentInfo.isRefunded ? 'O' : 'X'}
                  </p>
                </div>
              </div>
            )}
            <div className="mt-5 flex w-full items-center justify-end">
              <button
                onClick={() => setApplicationId(null)}
                className="text-xxsmall12 text-neutral-40"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
      {userId !== undefined && (
        <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black/10">
          <div className="flex min-h-64 min-w-96 flex-col justify-center rounded-sm bg-white px-8 py-6">
            <h1 className="text-lg font-bold">회원정보</h1>
            {userDetailIsLoading || userDetailIsFetching ? (
              <LoadingContainer />
            ) : !userDetail ? (
              <div>데이터가 없습니다.</div>
            ) : (
              <div className="mt-5 flex w-full flex-col gap-y-3 text-xsmall14">
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">학교</h2>
                  <p>{userDetail.userInfo.university ?? '-'}</p>
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">학년</h2>
                  <p>
                    {userDetail.userInfo.grade
                      ? gradeToText[userDetail.userInfo.grade]
                      : '-'}
                  </p>
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">전공</h2>
                  <div>{userDetail.userInfo.major ?? '-'}</div>
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">희망 직무</h2>
                  <p>{userDetail.userInfo.wishJob ?? '-'}</p>
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">희망 기업</h2>
                  <p>{userDetail.userInfo.wishCompany ?? '-'}</p>
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">참여 프로그램</h2>
                  <div className="flex flex-col gap-y-1">
                    {userDetail.applicationInfo.length < 1 ? (
                      <div>신청 내역이 없습니다.</div>
                    ) : (
                      userDetail.applicationInfo.map((applicationInfo, idx) => (
                        <div
                          key={
                            userDetail.userInfo.id +
                            applicationInfo.programId +
                            idx
                          }
                        >
                          {applicationInfo.programTitle}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="mt-5 flex w-full items-center justify-end">
              <button
                onClick={() => setApplicationId(null)}
                className="text-xxsmall12 text-neutral-40"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </tbody>
  );
};

export default TableBody;
