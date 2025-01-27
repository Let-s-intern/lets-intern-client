'use client';

import Image from 'next/image';
import Link from 'next/link';

import { BlogReview } from '@/api/review';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';

interface Props {
  blogReview: BlogReview;
}

const BlogReviewCard = ({ blogReview }: Props) => {
  return (
    <Link
      href={blogReview.url ?? ''}
      className="p-4 border rounded-sm gap-4 md:gap-11 flex md:justify-between flex-col md:flex-row border-neutral-80"
    >
      <div>
        <span className="text-xsmall14 font-bold text-primary mb-2 truncate block">
          {blogReview.programTitle}
        </span>
        <h3 className="mb-2 font-bold text-xsmall16 overflow-hidden line-clamp-2 text-neutral-0 text-ellipsis">
          {blogReview.title}
        </h3>
        <p className="mb-4 text-neutral-20 md:h-11 text-xsmall14 overflow-hidden line-clamp-2 text-ellipsis">
          {blogReview.description}
        </p>
        <div className="mb-2 text-xsmall14 text-neutral-35 truncate">
          {blogReview.url}
        </div>
        <span className="text-neutral-40 text-xxsmall12">
          {dayjs(blogReview.postDate).format(YYYY_MM_DD)} 작성
        </span>
      </div>

      <div className="w-40 h-[5.625rem] relative overflow-hidden md:w-60 md:h-[8.5rem] bg-neutral-85 rounded-sm">
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
};

export default BlogReviewCard;
