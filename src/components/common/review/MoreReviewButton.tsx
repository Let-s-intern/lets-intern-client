import { useGetTotalReview } from '@/api/challenge';
import ArrowCircle from '@/assets/icons/arrow-circle.svg?react';
import Close from '@/assets/icons/close.svg?react';
import StarIcon from '@/assets/icons/star.svg?react';
import { Modal } from '@mui/material';
import { useState } from 'react';
import { maskingName } from '../program/program-detail/review/ProgramDetailReviewItem';

interface MoreReviewButtonProps {
  title: string;
  thumbnail: string;
  deadline: string;
  startDate: string;
  endDate: string;
  type: 'CHALLENGE' | 'LIVE' | 'VOD' | 'REPORT';
  mainColor: string;
  subColor: string;
}

const MoreReviewButton = ({
  mainColor,
  subColor,
  ...props
}: MoreReviewButtonProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { data, isLoading: reviewIsLoading } = useGetTotalReview({
    type: props.type,
  });

  const reviews = data?.reviewList?.filter((review) => review.isVisible);

  return (
    <>
      <div
        className="flex w-full items-center justify-center px-5 md:px-0"
        onClick={handleOpen}
      >
        <div
          className="relative mt-12 flex w-full cursor-pointer items-center justify-center gap-x-2 rounded-sm px-5 py-4 text-white md:mx-0 md:mt-20 md:w-fit"
          style={{ backgroundColor: mainColor }}
        >
          <span className="text-xsmall16 font-semibold md:text-medium22">
            더 다양한 후기 보러가기
          </span>
          <ArrowCircle className="h-6 w-6" />
          <div
            className="absolute bottom-[calc(100%-7px)] rounded-xs px-2.5 py-1.5 text-xxsmall12 font-medium md:text-xsmall14"
            style={{ backgroundColor: subColor }}
          >
            자세한 수강생들의 후기가 궁금하다면?
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex items-center justify-center px-8 py-12 outline-none focus:outline-none"
      >
        <div
          className="relative flex max-h-[80%] w-full max-w-3xl flex-col gap-y-5 overflow-hidden rounded-lg bg-white p-4 outline-none focus:outline-none md:p-14"
          onClick={(e) => e.stopPropagation()}
        >
          <Close
            className="absolute right-4 top-4 h-6 w-6 cursor-pointer md:right-14 md:top-14 md:h-7 md:w-7"
            onClick={handleClose}
          />
          <div className="flex h-full w-full flex-col gap-y-5 overflow-hidden">
            <div className="flex items-center gap-x-2 text-xsmall16 font-semibold">
              후기{' '}
              <span className="text-xsmall14 font-medium text-primary">
                {reviews?.length ?? 0}개
              </span>
            </div>
            <div className="flex w-full flex-1 overflow-auto">
              <div className="flex h-full min-h-20 w-full flex-col gap-y-3 overflow-auto">
                {reviewIsLoading ? (
                  <div className="m-auto">로딩 중...</div>
                ) : !reviews || reviews.length === 0 ? (
                  <div className="m-auto">후기가 없습니다.</div>
                ) : (
                  reviews.map((review, index) => (
                    <div
                      key={index}
                      className="flex w-full flex-col gap-y-2 rounded-[10px] bg-neutral-95 px-4 py-5"
                    >
                      <p className="flex items-center gap-x-2 text-xsmall14 font-semibold">
                        {review.programTitle ?? '프로그램 없음'}
                        <span className="text-primary">
                          {maskingName(review.name ?? '-')}
                        </span>
                      </p>
                      <p className="w-full whitespace-pre-wrap break-words text-xsmall14 font-medium">
                        {review.content}
                      </p>
                      <div className={`flex w-fit items-center`}>
                        {/* review.score만큼 별, 그리고 5-score만큼 빈 별 */}
                        {Array(review.score)
                          .fill(0)
                          .map((_, index) => (
                            <StarIcon
                              key={index}
                              width={18}
                              height={18}
                              className="text-primary"
                            />
                          ))}
                        {Array(5 - review.score)
                          .fill(0)
                          .map((_, index) => (
                            <StarIcon
                              key={index}
                              width={18}
                              height={18}
                              className="text-neutral-75"
                            />
                          ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MoreReviewButton;
