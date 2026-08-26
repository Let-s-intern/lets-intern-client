'use client';

import { useState } from 'react';

import {
  useFeedbackDetailQuery,
  usePatchFeedbackReview,
} from '@/api/feedback/feedback';
import {
  REVIEW_MAX_LENGTH as MAX_LENGTH,
  StarRating,
} from '@/domain/live-feedback/ui/LiveFeedbackReviewModal';

function StarDisplay({ score }: { score: number }) {
  return (
    <div className="flex items-center">
      <span className="text-xsmall14 text-neutral-0 mr-2 font-semibold">
        만족도
      </span>
      <div className="mr-1 flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <img
            key={star}
            src={
              score >= star
                ? '/icons/star-yellow.svg'
                : '/icons/star-unfill.svg'
            }
            alt=""
            className="size-5"
          />
        ))}
      </div>
      <span className="text-neutral-40 text-[10px]">({score}.0)</span>
    </div>
  );
}

interface Props {
  feedbackId: number;
}

const LiveFeedbackReview = ({ feedbackId }: Props) => {
  const [isReviewing, setIsReviewing] = useState(false);
  const [stars, setStars] = useState(0);
  const [content, setContent] = useState('');

  const { data } = useFeedbackDetailQuery(feedbackId);
  const { mutate: patchReview, isPending } = usePatchFeedbackReview(feedbackId);

  const existingScore = data?.feedbackInfo.score ?? null;
  const existingReview = data?.feedbackInfo.review ?? null;

  const canSubmit = stars > 0 && content.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    patchReview({ score: stars, review: content });
  };

  if (existingScore !== null && existingReview !== null) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-xsmall16 text-neutral-0 font-semibold md:-ml-4">
          내가 작성한 후기
        </h3>
        <div className="flex flex-col gap-2">
          <StarDisplay score={existingScore} />
          <p className="text-xxsmall12 text-neutral-30 break-words">
            {existingReview}
          </p>
        </div>
      </div>
    );
  }

  if (isReviewing) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-xsmall16 text-neutral-0 font-semibold md:-ml-4">
          오늘 멘토링, 무엇을 얻으셨나요?
        </h2>
        <div className="flex flex-col gap-2">
          <p className="text-xxsmall12 text-neutral-40">
            대화에서 새로 알게 된 것을 지금 정리해두면, 다음 준비가 훨씬
            빨라져요.
          </p>
          <StarRating value={stars} onChange={setStars} />
          {!canSubmit && (
            <p className="text-xxsmall12 text-system-error">
              별점과 내용을 채우면 저장할 수 있어요.
            </p>
          )}
          <h3 className="text-xsmall14 text-neutral-0 font-semibold">
            멘토링을 통해 새롭게 알게 된 점을 작성해주세요
          </h3>
          <div className="flex flex-col gap-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, MAX_LENGTH))}
              placeholder="예) 혼자 볼 때는 이력서가 왜 안 통하는지 몰랐는데, 성과가 숫자로 안 보인다는 점을 짚어주셨어요. 프로젝트마다 지표를 한 줄씩 붙이는 방법까지 알려주셔서 바로 고칠 수 있었어요."
              className="text-xsmall14 text-neutral-0 border-neutral-80 rounded-xxs font-regular placeholder:text-neutral-70 h-[144px] w-full resize-none border p-3 outline-none"
            />
            <p className="text-xxsmall12 text-right">
              <span className="text-neutral-9">{content.length}</span>
              <span className="text-neutral-45">/{MAX_LENGTH}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isPending}
            className="bg-primary text-xsmall14 w-full rounded-sm py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            작성 완료
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsReviewing(true)}
      className="bg-primary text-xsmall16 flex-1 whitespace-nowrap rounded-sm py-4 font-semibold text-white"
    >
      멘토링 후기 작성하기
    </button>
  );
};

export default LiveFeedbackReview;
