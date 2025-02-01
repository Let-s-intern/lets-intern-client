'use client';

import Image from 'next/image';
import Link from 'next/link';

import { BlogReview, ReviewType } from '@/api/review';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import ReviewBadge from '@components/ReviewBadge';
import clsx from 'clsx';

interface Props {
  blogReview: BlogReview;
}

function MainBlogReviewCard({ blogReview }: Props) {
  return (
    <Link
      href={blogReview.url ?? ''}
      className="gap-3 flex flex-col"
      target="_blank"
      rel="noreferrer noopener"
    >
      <div className="w-full h-[7rem] relative overflow-hidden bg-neutral-85 rounded-sm">
        <Image
          className="object-cover"
          src={blogReview.thumbnail ?? ''}
          alt={blogReview.title + ' 블로그 썸네일'}
          fill
          sizes="(min-width:768px) 13rem , 50vw"
        />
      </div>
      <div>
        <div className="mb-2 flex flex-col md:flex-row gap-1 md:items-center md:gap-2">
          <ReviewBadge
            hideSubText
            reviewType={`${blogReview.programType}_REVIEW` as ReviewType}
            className={clsx('w-fit', {
              'bg-primary-10 text-primary':
                blogReview.programType === 'CHALLENGE',
            })}
            fill={
              blogReview.programType === 'CHALLENGE' ? '#4D55F5' : undefined
            }
          />
          <span className="text-xsmall14 font-bold text-primary truncate block">
            {blogReview.programTitle}
          </span>
        </div>
        <h3 className="mb-2 font-bold h-12 text-xsmall16 overflow-hidden line-clamp-2 text-neutral-0 text-ellipsis">
          {blogReview.title}
        </h3>
        <p className="mb-4 text-neutral-20 md:h-11 text-xsmall14 overflow-hidden line-clamp-2 text-ellipsis">
          {blogReview.description}
        </p>
        <div className="mb-1 flex items-center">
          {/* 그래픽 */}
          <span className="text-xsmall14 text-neutral-35 block truncate">
            {blogReview.url}
          </span>
        </div>
        <span className="text-neutral-40 text-xxsmall12">
          {dayjs(blogReview.postDate).format(YYYY_MM_DD)} 작성
        </span>
      </div>
    </Link>
  );
}

export default MainBlogReviewCard;
