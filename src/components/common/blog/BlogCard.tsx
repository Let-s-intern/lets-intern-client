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
      className="flex w-full cursor-pointer flex-col gap-y-2 py-3"
      onClick={() => {
        router.push(getBlogPathname(blogInfo.blogThumbnailInfo));
      }}
    >
      <span className="w-full text-xsmall16 font-bold text-primary">
        {blogCategory[blogInfo.blogThumbnailInfo.category || '']}
      </span>
      <div className="flex w-full flex-col gap-y-4">
        <div className="flex w-full gap-x-5">
          <div className="flex flex-1 flex-col gap-y-2">
            <h2 className="line-clamp-3 font-bold text-neutral-0">
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
              {blogInfo.blogThumbnailInfo.displayDate?.format(
                'YYYY년 MM월 DD일',
              )}
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
