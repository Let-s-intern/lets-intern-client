import Heading2 from '@/domain/admin/ui/heading/Heading2';
import { ExternalBlogReview, ProgramBlogReview } from '@/types/interface';
import React from 'react';
import ProgramBlogReviewEditor from './ProgramBlogReviewEditor';

const ChallengeBlogReviewSection: React.FC<{
  externalBlogReviews: ExternalBlogReview[];
  onExternalChange: (reviews: ExternalBlogReview[]) => void;
  blogReview: ProgramBlogReview;
  onBlogReviewChange: (review: ProgramBlogReview) => void;
  isCreate?: boolean;
}> = ({
  externalBlogReviews,
  onExternalChange,
  blogReview,
  onBlogReviewChange,
  isCreate = false,
}) => {
  const emptyMessage = isCreate
    ? '블로그 후기를 비워두고 챌린지 저장 시 챌린지 제목을 기반으로 자동으로 추가됩니다.'
    : '이전 기수를 포함하여 해당 챌린지에 해당하는 외부 블로그 후기가 존재하지 않습니다.';

  return (
    <div className="my-10">
      <div className="mb-4 flex items-center gap-3">
        <Heading2>블로그 후기</Heading2>
        <div className="flex gap-1">
          <span className="text-xs text-neutral-50">
            ** <b>3개의 블로그 후기값을 채워주세요</b> (초과 시 외부블로그후기
            선노출)
          </span>
          <span className="text-xs text-neutral-50"></span>
        </div>
      </div>
      <h3 className="text-small18 mb-2 font-semibold">외부 블로그 후기</h3>
      <div className="mb-6">
        {externalBlogReviews.length === 0 ? (
          <p className="text-sm text-neutral-50">{emptyMessage}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {externalBlogReviews.map((item, idx) => (
              <div
                key={idx}
                className="relative h-28 w-32 flex-none rounded border"
                style={{
                  backgroundImage: `url(${item.thumbnail})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <button
                  type="button"
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                  onClick={() =>
                    onExternalChange(
                      externalBlogReviews.filter((_, i) => i !== idx),
                    )
                  }
                >
                  ×
                </button>
                <div className="flex h-full items-end bg-black/20 p-1">
                  <span className="text-xxsmall12 line-clamp-2 text-white">
                    {item.programTitle} / {item.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <h3 className="text-small18 mb-2 font-semibold">
        렛츠커리어 블로그 후기
      </h3>
      <ProgramBlogReviewEditor
        showHeading={false}
        className=""
        blogReview={blogReview}
        setBlogReview={onBlogReviewChange}
      />
    </div>
  );
};

export default ChallengeBlogReviewSection;
