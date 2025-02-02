'use client';

import { GetReview, QuestionType } from '@/api/review';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { questionTypeToText } from '@/utils/convert';
import ExpandableParagraph from './ExpandableParagraph';
import ReviewBadge from './ReviewBadge';

import Bubble from '@/assets/graphic/bubble.svg?react';
import Heart from '@/assets/graphic/heart.svg?react';
import Lightbulb from '@/assets/graphic/lightbulb.svg?react';
import Pen from '@/assets/graphic/pen.svg?react';
import PinBlue from '@/assets/graphic/pin_blue.svg?react';
import PinRed from '@/assets/graphic/pin_red.svg?react';
import Trophy from '@/assets/graphic/trophy.svg?react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

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

const ReviewCard = ({
  review,
  missionTitleClamp = 1,
  reviewItemLineClamp = 3,
  expandable = false,
  showThumbnail = false,
  thumbnailLink,
  reviewItemNums,
  href,
}: {
  review: GetReview;
  missionTitleClamp?: 1 | 2;
  reviewItemLineClamp?: 1 | 2 | 3 | 4;
  expandable?: boolean;
  showThumbnail?: boolean;
  thumbnailLink?: string;
  reviewItemNums?: number;
  href?: string;
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
      className={clsx(
        'flex flex-col gap-4 p-4 border rounded-sm sm:flex-row border-neutral-80 sm:gap-10',
        { 'cursor-pointer': !!href },
      )}
      onClick={() => {
        if (href) {
          router.push(href);
        }
      }}
    >
      <div className="flex flex-col max-w-full mr-auto">
        <div className="mb-2">
          <ReviewBadge type={review.reviewInfo.type ?? 'CHALLENGE_REVIEW'} />
        </div>
        <h3 className="mb-2 font-bold truncate text-xsmall16 text-neutral-0">
          {review.reviewInfo.programTitle}
        </h3>
        {review.reviewInfo.type === 'MISSION_REVIEW' ? (
          <>
            <div className="flex items-center gap-2 mb-3 text-xxsmall12">
              <span className="whitespace-pre text-neutral-20">
                {review.reviewInfo.missionTh}회차
              </span>
              <span className="text-neutral-70">|</span>
              <p
                className={twMerge(
                  ' font-medium text-neutral-20',
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
            <ReviewItemBlock
              questionText="미션 수행 후기"
              questionType={null}
              answer={review.reviewInfo.attendanceReview}
              lineClamp={reviewItemLineClamp}
              icon={questionIcon(null)}
              expandable={expandable}
            />
          </>
        ) : null}
        <div className="mb-4 space-y-2.5 ">
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

        <div className="flex items-center gap-2 mt-auto mb-2 text-xxsmall12">
          <span className="font-medium whitespace-pre text-neutral-20">
            {review.reviewInfo.name?.[0]}**
          </span>
          <span className="text-neutral-70">|</span>
          <span className="text-neutral-20 ">
            희망직무{' '}
            <span className="font-medium">{review.reviewInfo.wishJob}</span> ·
            희망산업{' '}
            <span className="font-medium">{review.reviewInfo.wishCompany}</span>
          </span>
        </div>
        <div className="text-neutral-40 text-xxsmall12">
          {review.reviewInfo.createDate
            ? dayjs(review.reviewInfo.createDate).format(YYYY_MM_DD)
            : ''}{' '}
          작성
        </div>
      </div>
      {showThumbnail && review.reviewInfo.programThumbnail ? (
        <img
          src={review.reviewInfo.programThumbnail ?? ''}
          alt={review.reviewInfo.programTitle ?? ''}
          className={clsx(
            'block object-cover w-[120px] h-[90px] sm:w-[180px] sm:h-[135px] rounded-sm sm:mt-10',
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
  lineClamp?: 1 | 2 | 3 | 4;
  /** 이게 있을 경우 우선함. */
  questionText?: string;
  expandable?: boolean;
  icon?: ReactNode;
}) => {
  const questionText =
    props.questionText ||
    (props.questionType ? questionTypeToText[props.questionType] : '');

  return (
    <div>
      <div className="flex w-fit mb-0.5 items-center gap-1">
        {props.icon && props.icon}
        <span className="font-semibold text-xxsmall12 text-neutral-10">
          {questionText}
        </span>
      </div>
      {props.expandable ? (
        <ExpandableParagraph
          content={props.answer ?? ''}
          lineClamp={props.lineClamp}
          className={twMerge('text-xsmall14 font-normal text-neutral-10')}
        />
      ) : (
        <p className={twMerge('text-xsmall14 font-normal text-neutral-10')}>
          {props.answer}
        </p>
      )}
    </div>
  );
};

export default ReviewCard;
