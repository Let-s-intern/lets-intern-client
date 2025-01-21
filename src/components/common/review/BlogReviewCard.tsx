'use client';

import Image from 'next/image';

import { BlogReview } from '@/api/review';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import ReviewCardContainer from '@components/ReviewCardContainer';

interface Props {
  blogReview: BlogReview;
}

const BlogReviewCard = ({ blogReview }: Props) => {
  return (
    <ReviewCardContainer>
      <div className="flex flex-col max-w-full mr-auto">
        <span className="text-xsmall14 font-bold text-primary mb-2">
          {blogReview.programTitle}
        </span>
        <h3 className="mb-2 font-bold text-xsmall16 overflow-hidden line-clamp-2 text-neutral-0 text-ellipsis">
          {blogReview.title}
        </h3>
        <p className="mb-4 text-neutral-20 text-xsmall14 overflow-hidden line-clamp-2 text-ellipsis">
          {blogReview.description}
        </p>
        <div className="mb-2 text-xsmall14 text-neutral-35 truncate">
          {blogReview.url}
        </div>
        <span className="text-neutral-40 text-xxsmall12">
          {dayjs(blogReview.postDate).format(YYYY_MM_DD)} 작성
        </span>
        <div className="w-40 mt-4 h-[5.625rem] bg-neutral-85 rounded-sm">
          <Image
            src={''}
            alt={blogReview.title + ' 블로그 썸네일'}
            fill
            objectFit="cover"
          />
        </div>
      </div>
      {/* 썸네일 */}
    </ReviewCardContainer>
  );
};

export default BlogReviewCard;
