import Image from 'next/image';
import Link from 'next/link';

interface Props {
  blog: {
    id: string | number;
    title: string;
    category: string;
    thumbnail: string;
  };
}

function BlogRecommendCard({ blog }: Props) {
  return (
    <Link
      key={blog.id}
      href={`/blog/${blog.id}`}
      className="blogs-center flex justify-between gap-4"
    >
      <div>
        <h4 className="mb-1 text-xxsmall12 font-semibold text-primary">
          {blog.category}
        </h4>
        <h3 className="line-clamp-3 font-semibold text-neutral-20 md:line-clamp-2">
          {blog.title}
        </h3>
      </div>
      {/* 4:3 비율 */}
      <div className="relative h-[3.375rem] w-[4.5rem] shrink-0 bg-neutral-95">
        <Image
          className="rounded-xxs object-cover"
          src={blog.thumbnail}
          alt={blog.title + ' 썸네일'}
          fill
          sizes="4.5rem"
        />
      </div>
    </Link>
  );
}

export default BlogRecommendCard;
