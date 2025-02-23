import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  blog: {
    id: string | number;
    title: string;
    category: string;
    thumbnail: string;
    displayDate: string;
  };
}

function BlogRecommendCard({ blog }: Props) {
  return (
    <Link
      key={blog.id}
      href={`/blog/${blog.id}`}
      className="flex justify-between gap-4 md:max-w-[16.25rem] md:flex-col-reverse md:justify-normal md:gap-3"
    >
      <div className="flex flex-col gap-1 md:gap-2">
        <h4 className="text-xxsmall12 font-semibold text-primary md:text-xsmall14">
          {blog.category}
        </h4>
        <h3 className="line-clamp-3 font-semibold text-neutral-20 md:line-clamp-2 md:font-bold">
          {blog.title}
        </h3>
        <span className="hidden py-2 text-xxsmall12 text-neutral-40 md:block">
          {dayjs(blog.displayDate).format(YYYY_MM_DD)} 작성
        </span>
      </div>
      {/* 4:3 비율 */}
      <div className="relative h-[3.375rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xxs bg-neutral-95 md:aspect-[4/3] md:h-auto md:w-full">
        <Image
          className="object-cover"
          src={blog.thumbnail}
          alt={blog.title + ' 썸네일'}
          fill
          sizes="(max-width: 768px) 4.5rem, 260px"
        />
      </div>
    </Link>
  );
}

export default BlogRecommendCard;
