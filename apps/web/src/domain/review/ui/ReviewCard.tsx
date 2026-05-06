'use client';

import { GetReview } from '@/api/review/review';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import ReviewBadge from './ReviewBadge';
import ReviewItemBlock from './ReviewItemBlock';
import {
  getThumbnail,
  questionIcon,
  questionPriority,
  reviewTypeToProgramType,
} from './reviewCardHelpers';

const ReviewCard = ({
  review,
  missionTitleClamp = 1,
  reviewItemLineClamp = 3,
  expandable = false,
  showThumbnail = false,
  thumbnailLink,
  reviewItemNums,
  href,
  className,
  gap = 'normal',
}: {
  review: GetReview;
  missionTitleClamp?: 1 | 2;
  reviewItemLineClamp?: 1 | 2 | 3 | 4 | 5;
  expandable?: boolean;
  showThumbnail?: boolean;
  thumbnailLink?: string;
  reviewItemNums?: number;
  href?: string;
  className?: string;
  gap?: 'normal' | 'large';
}) => {
  const router = useRouter();
  const reviewItems = review.reviewItemList
    ?.sort(
      (a, b) =>
        questionPriority(a.questionType ?? null) -
        questionPriority(b.questionType ?? null),
    )
    .slice(0, reviewItemNums);
  return (
    <div
      className={twMerge(
        'border-neutral-80 flex flex-col gap-4 rounded-sm border p-4 sm:flex-row sm:gap-[50px]',
        href && 'cursor-pointer',
        className,
      )}
      data-review-type={review.reviewInfo.type}
      data-program-name={review.reviewInfo.programTitle}
      data-program-type={
        review.reviewInfo.type
          ? reviewTypeToProgramType(review.reviewInfo.type)
          : undefined
      }
      onClick={() => {
        if (href) {
          router.push(href);
        }
      }}
    >
      <div className="mr-auto flex max-w-full flex-col">
        <div
          className={twMerge(
            gap === 'normal' ? 'mb-2' : gap === 'large' ? 'mb-3' : '',
          )}
        >
          <ReviewBadge type={review.reviewInfo.type ?? 'CHALLENGE_REVIEW'} />
        </div>
        <h3
          className={twMerge(
            'text-xsmall16 text-neutral-0 truncate font-bold',
            gap === 'normal' ? 'mb-2' : gap === 'large' ? 'mb-3' : '',
          )}
        >
          {review.reviewInfo.programTitle}
        </h3>
        {review.reviewInfo.type === 'MISSION_REVIEW' ? (
          <>
            <div className="text-xxsmall12 mb-3 flex items-center gap-2 font-medium">
              <span className="text-neutral-20 whitespace-pre">
                {review.reviewInfo.missionTh}회차
              </span>
              <span className="text-neutral-70">|</span>
              <p
                className={twMerge(
                  'text-neutral-20 font-medium',
                  missionTitleClamp === 1
                    ? 'line-clamp-1'
                    : missionTitleClamp === 2
                      ? 'line-clamp-2'
                      : null,
                )}
              >
                {review.reviewInfo.missionTitle}
              </p>
            </div>
            <div className="flex-1">
              <ReviewItemBlock
                questionText="미션 수행 후기"
                questionType={null}
                answer={review.reviewInfo.attendanceReview}
                lineClamp={expandable ? reviewItemLineClamp : 5}
                icon={questionIcon(null)}
                expandable={expandable}
              />
            </div>
          </>
        ) : null}
        <div
          className={twMerge(
            'mb-[22px]',
            gap === 'normal' ? 'space-y-2' : gap === 'large' ? 'space-y-3' : '',
          )}
        >
          {reviewItems?.map((reviewItem, index) => (
            <ReviewItemBlock
              key={index}
              {...reviewItem}
              lineClamp={reviewItemLineClamp}
              icon={questionIcon(reviewItem.questionType ?? null)}
              expandable={expandable}
            />
          ))}
        </div>

        <div
          className={twMerge(
            'text-xsmall14 mt-auto flex items-center gap-2 md:flex-col md:items-start',
            gap === 'normal' ? 'mb-2' : gap === 'large' ? 'mb-3' : '',
          )}
        >
          <span className="text-neutral-20 whitespace-pre font-medium">
            {review.reviewInfo.name ? `${review.reviewInfo.name[0]}**` : '익명'}
          </span>
          <span className="text-neutral-70 md:hidden">|</span>
          <span className="text-neutral-20">
            희망직무{' '}
            <span className="font-medium">{review.reviewInfo.wishJob}</span> ·
            희망기업{' '}
            <span className="font-medium">{review.reviewInfo.wishCompany}</span>
          </span>
        </div>
        <div className="text-xxsmall12 text-neutral-40">
          {review.reviewInfo.createDate
            ? dayjs(review.reviewInfo.createDate).format(YYYY_MM_DD)
            : ''}{' '}
          작성
        </div>
      </div>
      {showThumbnail &&
      (review.reviewInfo.programThumbnail || review.reviewInfo.reportType) ? (
        <img
          src={getThumbnail(
            review.reviewInfo.reportType ?? null,
            review.reviewInfo.programThumbnail ?? null,
          )}
          alt={review.reviewInfo.programTitle ?? ''}
          className={clsx(
            'review_thumbnail block aspect-[4/3] max-w-[150px] self-start rounded-sm object-cover sm:mt-10 sm:max-w-[200px]',
            {
              'cursor-pointer': !!thumbnailLink,
            },
          )}
          onClick={() => {
            if (thumbnailLink) {
              router.push(thumbnailLink);
            }
          }}
        />
      ) : null}
    </div>
  );
};

export default ReviewCard;
