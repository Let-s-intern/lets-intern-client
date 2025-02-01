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

function ReviewLinkCard({ blogReview }: Props) {
  const badgeType = getBadgeTypeFromProgramType(blogReview.programType);

  return (
    <Link
      href={blogReview.url ?? ''}
      className="flex flex-col gap-3"
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
        <div className="flex flex-col items-start gap-1 mb-2 md:flex-row md:items-center md:gap-2">
          <ReviewBadge type={badgeType} />
          <span className="block font-bold truncate text-xsmall14 text-primary">
            {blogReview.programTitle}
          </span>
        </div>
        <h3 className="h-12 mb-2 overflow-hidden font-bold text-xsmall16 line-clamp-2 text-neutral-0 text-ellipsis">
          {blogReview.title}
        </h3>
        <p className="mb-4 overflow-hidden text-neutral-20 md:h-11 text-xsmall14 line-clamp-2 text-ellipsis">
          {blogReview.description}
        </p>
        <div className="flex items-center mb-1">
          {/* 그래픽 */}
          <span className="block truncate text-xsmall14 text-neutral-35">
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

export default ReviewLinkCard;
