import dayjs from '@/lib/dayjs';
import { useRouter } from 'next/navigation';
import { BlogInfoSchema } from '../../../api/blogSchema';
import { blogCategory } from '../../../utils/convert';
import { getBlogPathname } from '../../../utils/url';
import BlogHashtag from './BlogHashtag';

interface BlogCardProps {
  blogInfo: BlogInfoSchema;
}

const BlogCard = ({ blogInfo }: BlogCardProps) => {
  const router = useRouter();

  return (
    <div
      className="flex flex-col w-full py-3 cursor-pointer gap-y-2"
      onClick={() => {
        router.push(getBlogPathname(blogInfo.blogThumbnailInfo));
      }}
    >
      <span className="w-full font-bold text-xsmall16 text-primary">
        {blogCategory[blogInfo.blogThumbnailInfo.category || '']}
      </span>
      <div className="flex flex-col w-full gap-y-4">
        <div className="flex w-full gap-x-5">
          <div className="flex flex-col flex-1 gap-y-2">
            <h2 className="font-bold line-clamp-3 text-neutral-0">
              {blogInfo.blogThumbnailInfo.title}{' '}
              {!blogInfo.blogThumbnailInfo.isDisplayed && (
                <span className="text-xsmall14 text-system-error">
                  (비공개)
                </span>
              )}
            </h2>
            <p className="line-clamp-6 text-xsmall16 text-neutral-20">
              {blogInfo.blogThumbnailInfo.description}
            </p>
            <p className="w-full text-xsmall14 text-neutral-45">
              {blogInfo.blogThumbnailInfo.displayDate
                ? dayjs(blogInfo.blogThumbnailInfo.displayDate).format(
                    'YYYY년 MM월 DD일',
                  )
                : null}
            </p>
          </div>
          <img
            className="h-[68px] w-[100px] overflow-hidden rounded-md object-cover md:h-[90px] md:w-[130px]"
            src={blogInfo.blogThumbnailInfo.thumbnail || ''}
            alt="thumbnail"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {blogInfo.tagDetailInfos.map((tag) => (
            <BlogHashtag key={tag.id} text={tag.title || ''} tagId={tag.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
