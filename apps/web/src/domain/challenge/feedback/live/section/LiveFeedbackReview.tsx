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
          오늘 정리한 내용
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
          오늘 멘토링, 뭘 가져가시나요?
        </h2>
        <div className="flex flex-col gap-2">
          <p className="text-xxsmall12 text-neutral-40">
            멘토님께 남기는 후기가 아니에요. 오늘 알게 된 것과 다음에 고칠 것을
            스스로 정리하는 칸이에요.
          </p>
          <StarRating value={stars} onChange={setStars} />
          {!canSubmit && (
            <p className="text-xxsmall12 text-system-error">
              별점과 내용을 채우면 저장할 수 있어요.
            </p>
          )}
          <div className="flex flex-col gap-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, MAX_LENGTH))}
              placeholder="예) 내 이력서에서 성과가 숫자로 안 보인다는 걸 알았다. 다음 수정 때 프로젝트마다 지표를 한 줄씩 붙이자."
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
            정리 완료
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
      오늘 멘토링 정리하기
    </button>
  );
};

export default LiveFeedbackReview;
