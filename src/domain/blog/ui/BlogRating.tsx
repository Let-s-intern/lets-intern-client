'use client';

import { usePostBlogRatingMutation } from '@/api/blog/blog';
import { useState } from 'react';

interface BlogRatingProps {
  blogId: number;
}

const BlogRating = ({ blogId }: BlogRatingProps) => {
  const [starRating, setStarRating] = useState<number | null>(null);
  const [formValue, setFormValue] = useState<string>('');
  const [isPostedRating, setIsPostedRating] = useState<boolean>(false);

  const { mutate: postRating } = usePostBlogRatingMutation({
    successCallback: () => {
      setIsPostedRating(true);
      alert('소중한 의견 감사합니다.');
    },
  });

  const handlePostRating = async () => {
    if (!starRating || !formValue) return;

    postRating({
      blogId: blogId.toString(),
      title: formValue,
      score: starRating,
    });
  };

  return (
    <div className="flex w-full flex-col gap-y-4">
      <div className="flex w-full flex-col items-center justify-center gap-y-3 rounded-md border-2 border-neutral-80 px-10 py-8">
        <h3 className="text-xsmall16 font-bold text-black">
          블로그 글은 어떠셨나요?
        </h3>
        <div className="blog_star flex items-center justify-center gap-x-2">
          <img
            className="h-6 w-6 cursor-pointer"
            src={`/icons/star-${!starRating ? 'null' : starRating >= 1 ? 'fill' : 'unfill'}.svg`}
            alt="star"
            onClick={() => setStarRating(1)}
          />
          <img
            className="h-6 w-6 cursor-pointer"
            src={`/icons/star-${!starRating ? 'null' : starRating >= 2 ? 'fill' : 'unfill'}.svg`}
            alt="star"
            onClick={() => setStarRating(2)}
          />
          <img
            className="h-6 w-6 cursor-pointer"
            src={`/icons/star-${!starRating ? 'null' : starRating >= 3 ? 'fill' : 'unfill'}.svg`}
            alt="star"
            onClick={() => setStarRating(3)}
          />
          <img
            className="h-6 w-6 cursor-pointer"
            src={`/icons/star-${!starRating ? 'null' : starRating >= 4 ? 'fill' : 'unfill'}.svg`}
            alt="star"
            onClick={() => setStarRating(4)}
          />
          <img
            className="h-6 w-6 cursor-pointer"
            src={`/icons/star-${!starRating ? 'null' : starRating >= 5 ? 'fill' : 'unfill'}.svg`}
            alt="star"
            onClick={() => setStarRating(5)}
          />
        </div>
      </div>
      {starRating && (
        <div className="flex w-full flex-col gap-y-3 rounded-md bg-primary-10 px-10 py-8">
          <div className="flex w-full flex-col items-center justify-center gap-y-4">
            <h3 className="text-xsmall16 font-bold text-primary">
              더 필요한 콘텐츠가 있다면 알려주세요!
            </h3>
            <input
              className={`w-full rounded-md border-none text-xsmall14 ${formValue.length === 0 ? 'bg-neutral-95' : 'bg-[#5177FF]/10'} p-3 outline-none placeholder:text-black/35 ${isPostedRating ? 'cursor-not-allowed text-neutral-45' : ''}`}
              placeholder="예시. 포트폴리오 꿀팁, 영문레쥬메 작성방법"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              readOnly={isPostedRating}
            />
          </div>
          <button
            className={`blog_form flex w-full items-center justify-center rounded-sm border-2 border-primary px-4 py-1.5 text-primary-dark ${formValue.length === 0 || isPostedRating ? 'cursor-not-allowed opacity-40' : ''}`}
            onClick={
              formValue.length === 0 || isPostedRating
                ? () => {}
                : handlePostRating
            }
          >
            {isPostedRating ? '제출완료' : '제출하기'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogRating;
