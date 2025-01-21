'use client';

import { GetReview, QuestionType } from '@/api/review';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { questionTypeToText } from '@/utils/convert';
import ExpandableParagraph from './ExpandableParagraph';
import ReviewBadge from './ReviewBadge';
import ReviewCardContainer from './ReviewCardContainer';

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

const ReviewCard = ({
  review,
  missionTitleClamp = 1,
  reviewItemLineClamp = 3,
  expandable = false,
  showThumbnail = false,
  showGoodAndBadPoint = false,
}: {
  review: GetReview;
  missionTitleClamp?: 1 | 2;
  reviewItemLineClamp?: 1 | 2 | 3 | 4;
  expandable?: boolean;
  showThumbnail?: boolean;
  showGoodAndBadPoint?: boolean;
}) => {
  return (
    <ReviewCardContainer>
      <div className="flex flex-col max-w-full mr-auto">
        <div className="mb-2">
          <ReviewBadge reviewType={review.reviewInfo.type} />
        </div>
        <h3 className="mb-2 font-bold truncate text-xsmall16 text-neutral-0">
          {review.reviewInfo.programTitle}
        </h3>
        {review.reviewInfo.type === 'MISSION_REVIEW' ? (
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
        ) : null}
        <div className="mb-4 space-y-2.5 ">
          {review.reviewItemList?.map((reviewItem, index) => (
            <ReviewItemBlock
              key={index}
              {...reviewItem}
              lineClamp={reviewItemLineClamp}
              expandable={expandable}
            />
          ))}
          {showGoodAndBadPoint && review.reviewInfo.goodPoint ? (
            <ReviewItemBlock
              lineClamp={reviewItemLineClamp}
              expandable={expandable}
              questionText="좋았던 점"
              answer={review.reviewInfo.goodPoint}
            />
          ) : null}

          {showGoodAndBadPoint && review.reviewInfo.badPoint ? (
            <ReviewItemBlock
              lineClamp={reviewItemLineClamp}
              expandable={expandable}
              questionText="아쉬웠던 점"
              answer={review.reviewInfo.badPoint}
            />
          ) : null}
        </div>

        <div className="flex items-center gap-2 mt-auto mb-2 text-xxsmall12">
          <span className="whitespace-pre text-neutral-20">
            {review.reviewInfo.name?.[0]}**
          </span>
          <span className="text-neutral-70">|</span>
          <span className="text-neutral-20 ">
            희망직무 {review.reviewInfo.wishJob} · 희망산업{' '}
            {review.reviewInfo.wishCompany}
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
          className="block object-cover w-[120px] h-[90px] sm:w-[180px] sm:h-[135px] rounded-sm sm:mt-10"
        />
      ) : null}
    </ReviewCardContainer>
  );
};

const ReviewItemBlock = (props: {
  answer?: string | null;
  questionType?: QuestionType | null;
  lineClamp?: 1 | 2 | 3 | 4;
  /** 이게 있을 경우 우선함. */
  questionText?: string;
  expandable?: boolean;
}) => {
  const questionText =
    props.questionText ||
    (props.questionType ? questionTypeToText[props.questionType] : '');

  return (
    <div>
      <h4 className="mb-1 font-semibold text-xxsmall12 text-neutral-10">
        {questionText}
      </h4>
      {props.expandable ? (
        <ExpandableParagraph
          content={props.answer ?? ''}
          lineClamp={props.lineClamp}
          className={twMerge('text-xxsmall12 font-normal text-neutral-10')}
        />
      ) : (
        <p className={twMerge('text-xxsmall12 font-normal text-neutral-10')}>
          {props.answer}
        </p>
      )}
    </div>
  );
};

export default ReviewCard;
