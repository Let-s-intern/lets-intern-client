import { useNavigate } from 'react-router-dom';
import { TransformedBlogInfoType } from '../../../api/blogSchema';
import { blogCategory } from '../../../utils/convert';
import BlogHashtag from './BlogHashtag';

const BlogCard = (blogInfo: TransformedBlogInfoType) => {
  const navigate = useNavigate();
  return (
    <div className="flex w-full flex-col gap-y-2 py-3">
      <span className="w-full text-xsmall16 font-bold text-primary">
        {blogCategory[blogInfo.blogThumbnailInfo.category || '']}
      </span>
      <div className="flex w-full flex-col gap-y-4">
        <div className="flex w-full gap-x-5">
          <div className="flex flex-1 flex-col gap-y-2">
            <h2 className="line-clamp-3 font-bold text-neutral-0">
              {blogInfo.blogThumbnailInfo.title}
            </h2>
            <p className="line-clamp-6 text-xsmall16 text-neutral-20">
              {blogInfo.blogThumbnailInfo.description}
            </p>
          </div>
          <img
            className="h-[60px] w-[100px] overflow-hidden rounded-md md:h-[90px] md:w-[130px]"
            src={blogInfo.blogThumbnailInfo.thumbnail || ''}
            alt="thumbnail"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {blogInfo.tagDetailInfos.map((tag) => (
            <BlogHashtag
              key={tag.id}
              text={tag.title || ''}
              onClick={() => {
                navigate(`/blog/hashtag`, { state: tag });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
