import { Checkbox } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';

import { useEditReviewVisible } from '@/api/challenge';
import { useUserDetailAdminQuery } from '@/api/user';
import { ReviewType } from '@/schema';
import { gradeToText } from '@/utils/convert';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import TD from '../../../ui/table/regacy/TD';

interface Props {
  type: string;
  programTitle?: string | null;
  createDate?: string | null;
  reviewList: ReviewType[];
}

const ChallengeReviewTableBody = ({
  type,
  programTitle,
  createDate,
  reviewList,
}: Props) => {
  const { mutate: editReviewVisible } = useEditReviewVisible();
  const [userId, setUserId] = useState<number | null | undefined>(undefined);

  const {
    data: userDetail,
    isLoading: userDetailIsLoading,
    isFetching: userDetailIsFetching,
  } = useUserDetailAdminQuery({
    userId: userId ?? 0,
    enabled: userId !== undefined,
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
          {/* 작성 일자 */}
          <TD>{dayjs(review.createdDate).format('YYYY.MM.DD')}</TD>
          {/* 챌린지 구분 */}
          <TD>커리어 시작</TD>
          {/* 프로그램 명 */}
          <TD>{review.programTitle ?? '프로그램 없음'}</TD>
          {/* 이름 */}
          <TD>
            <div
              className="cursor-pointer underline"
              onClick={() => setUserId(review.userId ?? null)}
            >
              {review.name ?? '-'}
            </div>
          </TD>
          {/* 만족도 점수 */}
          <TD>9</TD>
          {/* NPS 점수 */}
          <TD>{review.nps}</TD>
          {/* 목표 */}
          <TD>자소서 마스터</TD>
          {/* 목표 달성 여부 */}
          <TD>100% 달성입니다!</TD>
          {/* 좋았었던 점 */}
          <TD>렛츠커리어 짱! 돈 많이 버세요~</TD>
          {/* 아쉬웠던 점 */}
          <TD>예시를 더 많이 보여줬으면 좋겠습니다.</TD>
          {/* 노출 여부 */}
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

      {/* 이름 클릭 시 보이는 회원 정보 */}
      {userId !== undefined && (
        <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black/10">
          <div className="flex max-h-[95%] min-h-64 min-w-96 flex-col overflow-auto rounded-sm bg-white px-8 py-6">
            <h1 className="text-lg font-bold">회원정보</h1>
            {userDetailIsLoading || userDetailIsFetching ? (
              <LoadingContainer />
            ) : !userDetail ? (
              <div className="flex flex-1 items-center justify-center">
                데이터가 없습니다.
              </div>
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
                onClick={() => setUserId(undefined)}
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

export default ChallengeReviewTableBody;
