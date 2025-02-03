'use client';

import Image from 'next/image';
import Link from 'next/link';

import { BlogReview } from '@/api/review';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import ReviewBadge, {
  getBadgeTypeFromProgramType,
} from '@components/ReviewBadge';

interface Props {
  blogReview: BlogReview;
}

function BlogReviewCard({ blogReview }: Props) {
  const badgeType = getBadgeTypeFromProgramType(blogReview.programType);

  return (
    <Link
      href={blogReview.url ?? ''}
      className="flex flex-col gap-4 p-4 border rounded-sm md:gap-11 md:justify-between md:flex-row border-neutral-80"
      target="_blank"
      rel="noreferrer noopener"
    >
      <div>
        <div className="flex flex-col items-start gap-1 mb-2 md:flex-row md:items-center md:gap-2">
          <ReviewBadge type={badgeType} />
          <span className="block font-bold truncate text-xsmall14 text-primary ">
            {blogReview.programTitle}
          </span>
        </div>
        <h3 className="mb-2 overflow-hidden font-bold text-xsmall16 line-clamp-2 text-neutral-0 text-ellipsis">
          {blogReview.title}
        </h3>
        <p className="mb-4 overflow-hidden text-neutral-20 md:h-11 text-xsmall14 line-clamp-2 text-ellipsis">
          {blogReview.description}
        </p>
        <div className="mb-2 flex items-center md:max-w-[22rem] gap-2">
          <img
            className="w-5 h-5"
            src={`${blogReview.url}/favicon.ico`}
            alt={blogReview.title + ' 파비콘'}
          />
          <span className="text-xsmall14 text-neutral-35 truncate">
            {blogReview.url}
          </span>
        </div>
        <span className="text-neutral-40 text-xxsmall12">
          {dayjs(blogReview.postDate).format(YYYY_MM_DD)} 작성
        </span>
      </div>

      <div className="w-40 h-[5.625rem] shrink-0 relative overflow-hidden md:w-60 md:h-[8.5rem] bg-neutral-85 rounded-sm">
        <Image
          className="object-cover"
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
