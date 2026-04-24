'use client';

import { BlogReview } from '@/api/review/review';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import ReviewBadge, {
  getBadgeTypeFromProgramType,
} from '@/domain/review/ReviewBadge';
import dayjs from '@/lib/dayjs';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  blogReview: BlogReview;
  className?: string;
}

function BlogReviewCard({ blogReview, className }: Props) {
  const badgeType = getBadgeTypeFromProgramType(blogReview.programType);

  return (
    <Link
      href={blogReview.url ?? ''}
      className={clsx(
        'flex flex-col gap-4 rounded-sm border border-neutral-80 p-4 md:flex-row md:justify-between md:gap-11',
        className,
      )}
      target="_blank"
      rel="noreferrer noopener"
      data-program-name={blogReview.programTitle}
      data-program-type={blogReview.programType}
      data-review-type={`${blogReview.programType}_REVIEW`}
      data-blog-name={blogReview.title}
    >
      <div>
        <div className="mb-2 flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-2">
          {badgeType ? <ReviewBadge type={badgeType} /> : null}
          <span className="block max-w-full truncate text-xsmall14 font-semibold text-primary">
            {blogReview.programTitle}
          </span>
        </div>
        <h3 className="mb-2 line-clamp-2 overflow-hidden text-ellipsis text-xsmall16 font-bold text-neutral-0">
          {blogReview.title}
        </h3>
        <p className="mb-4 line-clamp-2 overflow-hidden text-ellipsis text-xsmall14 text-neutral-20 md:h-11">
          {blogReview.description}
        </p>
        <div className="mb-2 flex items-center gap-2 md:max-w-[22rem]">
          <img
            className="h-5 w-5"
            src={`${new URL(blogReview.url ?? '').origin}/favicon.ico`}
            alt={blogReview.title + ' 파비콘'}
          />
          <span className="truncate text-xsmall14 text-neutral-35">
            {blogReview.url}
          </span>
        </div>
        <span className="text-xxsmall12 text-neutral-40">
          {dayjs(blogReview.postDate).format(YYYY_MM_DD)} 작성
        </span>
      </div>

      <div className="relative h-[5.625rem] w-40 shrink-0 overflow-hidden rounded-sm bg-neutral-85 md:h-[8.125rem] md:w-[14.375rem]">
        <Image
          unoptimized
          className="border border-neutral-80 object-cover"
          src={blogReview.thumbnail ?? ''}
          alt={blogReview.title + ' 블로그 썸네일'}
          fill
          sizes="(min-width:768px) 15rem , 10rem"
        />
      </div>
    </Link>
  );
}

export default BlogReviewCard;
