'use client';

import dayjs from '@/lib/dayjs';
import { useRouter } from 'next/navigation';
import { BlogInfoSchema } from '../../../api/blogSchema';
import { blogCategory } from '../../../utils/convert';
import BlogHashtag from '../ui/BlogHashtag';

const RecommendBlogCard = (blogInfo: BlogInfoSchema) => {
  const router = useRouter();
  return (
    <div
      className="flex w-full cursor-pointer flex-col gap-y-2 py-3"
      onClick={() => {
        router.push(`/blog/${blogInfo.blogThumbnailInfo.id}`);
      }}
    >
      <span className="w-full text-xsmall16 font-bold text-primary">
        {blogCategory[blogInfo.blogThumbnailInfo.category || '']}
      </span>
      <div className="flex w-full flex-col gap-y-4">
        <div className="flex w-full gap-x-5">
          <div className="flex flex-1 flex-col gap-y-2">
            <h2 className="line-clamp-3 font-bold text-neutral-0">
              {blogInfo.blogThumbnailInfo.title}
            </h2>
            <p className="text-xsmall14 text-neutral-45">
              {blogInfo.blogThumbnailInfo.lastModifiedDate
                ? dayjs(blogInfo.blogThumbnailInfo.lastModifiedDate).format(
                    'YYYY년 MM월 DD일',
                  )
                : null}
            </p>
          </div>
          <img
            className="h-[60px] w-[100px] overflow-hidden rounded-md md:h-[90px] md:w-[130px]"
            src={blogInfo.blogThumbnailInfo.thumbnail || ''}
            alt="thumbnail"
          />
        </div>
        {blogInfo.tagDetailInfos.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {blogInfo.tagDetailInfos.map((tag) => (
              <BlogHashtag key={tag.id} text={tag.title || ''} tagId={tag.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendBlogCard;
