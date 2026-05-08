'use client';

import { useState } from 'react';

interface Review {
  stars: number;
  content: string;
}

const MAX_LENGTH = 300;

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
        >
          <img
            src={
              active >= star
                ? '/icons/star-yellow.svg'
                : '/icons/star-unfill.svg'
            }
            alt={`별 ${star}개`}
            className="size-7"
          />
        </button>
      ))}
    </div>
  );
}

const LiveFeedbackReview = () => {
  const [isReviewing, setIsReviewing] = useState(false);
  const [stars, setStars] = useState(0);
  const [content, setContent] = useState('');
  const [review, setReview] = useState<Review | null>(null);

  const canSubmit = stars > 0 && content.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setReview({ stars, content });
    setIsReviewing(false);
  };

  if (review) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-xsmall16 text-neutral-0 font-semibold md:-ml-4">
          LIVE 피드백 회고하기
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <span className="text-xsmall14 text-neutral-0 mr-2 font-semibold">
              만족도
            </span>
            <div className="mr-1 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <img
                  key={star}
                  src={
                    review.stars >= star
                      ? '/icons/star-yellow.svg'
                      : '/icons/star-unfill.svg'
                  }
                  alt=""
                  className="size-5"
                />
              ))}
            </div>
            <span className="text-neutral-40 text-[10px]">
              ({review.stars}.0)
            </span>
          </div>
          <p className="text-xxsmall12 text-neutral-30 break-words">
            {review.content}
          </p>
        </div>
      </div>
    );
  }

  if (isReviewing) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-xsmall16 text-neutral-0 font-semibold md:-ml-4">
          LIVE 피드백 회고하기
        </h3>
        <div className="flex flex-col gap-2">
          <StarRating value={stars} onChange={setStars} />
          {!canSubmit && (
            <p className="text-xxsmall12 text-system-error">
              별점과 회고 내용을 입력하면 저장할 수 있어요.
            </p>
          )}
          <div className="flex flex-col gap-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, MAX_LENGTH))}
              placeholder="오늘 받은 피드백 중 기억에 남는 점, 미션에서 보완하고 싶은 부분, 다음에 적용해볼 내용을 자유롭게 적어보세요."
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
            disabled={!canSubmit}
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
      className="bg-primary text-xsmall14 flex-1 whitespace-nowrap rounded-sm py-3 font-semibold text-white"
    >
      LIVE 피드백 회고하기
    </button>
  );
};

export default LiveFeedbackReview;
