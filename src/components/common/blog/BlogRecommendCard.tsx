import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { blogCategory } from '@/utils/convert';
import Link from 'next/link';

interface Props {
  blog: {
    id: number;
    category?: string | null;
    title?: string | null;
    thumbnail?: string | null;
    displayDate?: string | null;
  };
}

async function BlogRecommendCard({ blog }: Props) {
  return (
    <Link
      key={blog.id}
      href={`/blog/${blog.id}/${encodeURIComponent(blog.title ?? '')}`}
      className="blog_recommend flex justify-between gap-4 md:max-w-[16.25rem] md:flex-col-reverse md:justify-normal md:gap-2.5"
      data-url={`/blog/${blog.id}`}
      data-text={blog.title}
    >
      <div className="flex flex-col gap-1 md:gap-2">
        <h4 className="mb-1 text-xxsmall12 font-semibold text-primary md:text-xsmall14">
          {blogCategory[blog.category ?? ''] ?? '전체'}
        </h4>
        <h3 className="line-clamp-3 font-semibold text-neutral-0 md:line-clamp-2 md:min-h-12">
          {blog.title}
        </h3>
        <span className="hidden py-2 text-xxsmall12 text-neutral-40 md:block">
          {dayjs(blog.displayDate).format(YYYY_MM_DD)} 작성
        </span>
      </div>
      {/* 4:3 비율 */}
      <div className="relative h-[3.375rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xxs bg-neutral-95 md:aspect-[4/3] md:h-auto md:w-full">
        <img
          className="h-full w-full object-cover"
          src={blog.thumbnail ?? ''}
          alt={blog.title + ' 썸네일'}
        />
      </div>
    </Link>
  );
}

export default BlogRecommendCard;
