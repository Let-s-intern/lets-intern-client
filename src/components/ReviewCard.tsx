'use client';

import { ReportType } from '@/api/report';
import { GetReview, QuestionType, ReviewType } from '@/api/review';
import Bubble from '@/assets/graphic/bubble.svg?react';
import Heart from '@/assets/graphic/heart.svg?react';
import Lightbulb from '@/assets/graphic/lightbulb.svg?react';
import Pen from '@/assets/graphic/pen.svg?react';
import PinBlue from '@/assets/graphic/pin_blue.svg?react';
import PinRed from '@/assets/graphic/pin_red.svg?react';
import Trophy from '@/assets/graphic/trophy.svg?react';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { ProgramTypeUpperCase } from '@/schema';
import { questionTypeToText } from '@/utils/convert';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import ExpandableParagraph from './ExpandableParagraph';
import ReviewBadge from './ReviewBadge';

function reviewTypeToProgramType(reviewType: ReviewType): ProgramTypeUpperCase {
  switch (reviewType) {
    case 'CHALLENGE_REVIEW':
    case 'MISSION_REVIEW':
      return 'CHALLENGE';
    case 'LIVE_REVIEW':
      return 'LIVE';
    case 'VOD_REVIEW':
      return 'VOD';
    case 'REPORT_REVIEW':
      return 'REPORT';
  }
}

export const getTitle = (review: GetReview) => {
  switch (review.reviewInfo.type) {
    case 'CHALLENGE_REVIEW':
    case 'LIVE_REVIEW':
    case 'VOD_REVIEW':
      return review.reviewInfo.programTitle;
    case 'REPORT_REVIEW':
      // TODO: 서류 진단 제목이 이 필드가 맞는지 체크 필요.
      return review.reviewInfo.programTitle;
    case 'MISSION_REVIEW':
      return review.reviewInfo.missionTitle;
  }
};

const questionIcon = (questionType: QuestionType | null) => {
  switch (questionType) {
    case 'WORRY':
      return <PinBlue width={18} height={18} />;
    case 'WORRY_RESULT':
      return <Lightbulb width={18} height={18} />;
    case 'GOAL':
      return <PinRed width={18} height={18} />;
    case 'GOAL_RESULT':
      return <Trophy width={18} height={18} />;
    case 'GOOD_POINT':
      return <Heart width={18} height={18} />;
    case 'BAD_POINT':
      return <Pen width={18} height={18} />;
    default:
      return <Bubble width={18} height={18} />;
  }
};

const questionPriority = (questionType: QuestionType | null) => {
  switch (questionType) {
    case 'GOAL':
      return 1;
    case 'GOAL_RESULT':
      return 2;
    case 'WORRY':
      return 3;
    case 'WORRY_RESULT':
      return 4;
    case 'GOOD_POINT':
      return 5;
    case 'BAD_POINT':
      return 6;
    default:
      return 7;
  }
};

const getThumbnail = (
  reportType: ReportType | null,
  programThumbnail: string | null,
) => {
  switch (reportType) {
    case 'RESUME':
      return '/images/report/thumbnail_resume.png';
    case 'PERSONAL_STATEMENT':
      return '/images/report/thumbnail_personal.png';
    case 'PORTFOLIO':
      return '/images/report/thumbnail_portfolio.png';
    default:
      return programThumbnail ?? '';
  }
};

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
        'flex flex-col gap-4 rounded-sm border border-neutral-80 p-4 sm:flex-row sm:gap-[50px]',
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
            'truncate text-xsmall16 font-bold text-neutral-0',
            gap === 'normal' ? 'mb-2' : gap === 'large' ? 'mb-3' : '',
          )}
        >
          {review.reviewInfo.programTitle}
        </h3>
        {review.reviewInfo.type === 'MISSION_REVIEW' ? (
          <>
            <div className="mb-3 flex items-center gap-2 text-xxsmall12 font-medium">
              <span className="whitespace-pre text-neutral-20">
                {review.reviewInfo.missionTh}회차
              </span>
              <span className="text-neutral-70">|</span>
              <p
                className={twMerge(
                  'font-medium text-neutral-20',
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
            'mt-auto flex items-center gap-2 text-xsmall14 md:flex-col md:items-start',
            gap === 'normal' ? 'mb-2' : gap === 'large' ? 'mb-3' : '',
          )}
        >
          <span className="whitespace-pre font-medium text-neutral-20">
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

const ReviewItemBlock = (props: {
  answer?: string | null;
  questionType?: QuestionType | null;
  lineClamp?: 1 | 2 | 3 | 4 | 5;
  /** 이게 있을 경우 우선함. */
  questionText?: string;
  expandable?: boolean;
  icon?: ReactNode;
  gap?: 'normal' | 'large';
}) => {
  const questionText =
    props.questionText ||
    (props.questionType ? questionTypeToText[props.questionType] : '');

  return (
    <div>
      <div className="flex w-fit items-center gap-1">
        {/* {props.icon && props.icon} */}
        <span className="text-xsmall14 font-semibold text-neutral-10">
          {questionText}
        </span>
      </div>
      {props.expandable ? (
        <ExpandableParagraph
          content={props.answer ?? ''}
          lineClamp={props.lineClamp}
          className={twMerge('text-xsmall14 font-normal text-neutral-20')}
        />
      ) : (
        <p
          className={twMerge(
            'text-xsmall14 font-normal text-neutral-20',
            props.lineClamp === 1
              ? 'line-clamp-1'
              : props.lineClamp === 2
                ? 'line-clamp-2'
                : props.lineClamp === 3
                  ? 'line-clamp-3'
                  : props.lineClamp === 4
                    ? 'line-clamp-4'
                    : props.lineClamp === 5
                      ? 'line-clamp-5'
                      : null,
          )}
        >
          {props.answer}
        </p>
      )}
    </div>
  );
};

export default ReviewCard;
