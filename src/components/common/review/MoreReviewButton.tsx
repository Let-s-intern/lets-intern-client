import { useGetTotalReview } from '@/api/challenge';
import ArrowCircle from '@/assets/icons/arrow-circle.svg?react';
import Close from '@/assets/icons/close.svg?react';
import StarIcon from '@/assets/icons/star.svg?react';
import { Modal } from '@mui/material';
import { useState } from 'react';

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

  const { data: reviews, isLoading: reviewIsLoading } = useGetTotalReview(
    props.type,
  );

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
        className="flex items-center justify-center px-8 py-12"
      >
        <div
          className="relative flex max-h-[80%] w-full max-w-3xl flex-col gap-y-5 overflow-hidden rounded-lg bg-white px-4 py-12 md:p-14"
          onClick={(e) => e.stopPropagation()}
        >
          <Close
            className="absolute right-4 top-4 h-6 w-6 cursor-pointer md:right-14 md:top-14 md:h-7 md:w-7"
            onClick={handleClose}
          />
          <div className="flex w-full gap-x-4 overflow-auto scrollbar-hide">
            <img
              src={props.thumbnail}
              alt="챌린지 썸네일"
              className="h-[96px] w-auto"
            />
            <div className="flex grow flex-col gap-y-2 text-xxsmall12 font-medium">
              <span className="w-full break-words text-xsmall16 font-semibold">
                {props.title}
              </span>
              <div className="flex gap-x-4">
                <span className="w-12 text-neutral-30">진행 기간</span>
                <span className="whitespace-pre-wrap text-primary-dark md:whitespace-normal">{`${props.startDate}\n-\n${props.endDate}`}</span>
              </div>
              <div className="flex gap-x-4">
                <span className="w-12 text-neutral-30">모집 마감</span>
                <span className="whitespace-pre-wrap text-primary-dark md:whitespace-normal">{`${props.deadline}`}</span>
              </div>
              <div className="flex gap-x-4">
                <span className="w-12 text-neutral-30">OT 일자</span>
                <span className="whitespace-pre-wrap text-primary-dark md:whitespace-normal">{`${props.startDate}`}</span>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-y-2">
            <div className="flex items-center gap-x-2 text-xsmall16 font-semibold">
              후기{' '}
              <span className="text-xsmall14 font-medium text-primary">
                {reviews?.length ?? 0}개
              </span>
            </div>
            <div className="flex min-h-52 flex-col gap-y-3 overflow-y-auto">
              {reviewIsLoading ? (
                <div className="m-auto">로딩 중...</div>
              ) : !reviews || reviews.length === 0 ? (
                <div className="m-auto">후기가 없습니다.</div>
              ) : (
                reviews.map((review, index) => (
                  <div
                    key={index}
                    className="flex w-full flex-col gap-y-2 bg-neutral-95 px-4 py-5"
                  >
                    <p className="text-xsmall14 font-semibold">{`${review.id} ${review.id}`}</p>
                    <p className="w-full text-xsmall14 font-medium">
                      {review.content}
                    </p>

                    <div className={`flex w-fit items-center px-2 py-1.5`}>
                      {Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <StarIcon
                            key={index}
                            className={`h-4 w-4`}
                            style={{ color: mainColor }}
                          />
                        ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MoreReviewButton;
