import { useNavigate } from 'react-router-dom';
import { TransformedBlogInfoType } from '../../../api/blogSchema';
import { blogCategory } from '../../../utils/convert';

const RecommendBlogCard = (blogInfo: TransformedBlogInfoType) => {
  const navigate = useNavigate();
  return (
    <div
      className="flex w-full cursor-pointer flex-col gap-y-2 py-3"
      onClick={() => {
        navigate(`/blog/${blogInfo.blogThumbnailInfo.id}`);
      }}
    >
      <span className="w-full text-xsmall16 font-bold text-primary">
        {blogCategory[blogInfo.blogThumbnailInfo.category || '']}
      </span>
      <div className="flex w-full gap-x-5">
        <div className="flex flex-1 flex-col gap-y-2">
          <h2 className="line-clamp-3 font-bold text-neutral-0">
            {blogInfo.blogThumbnailInfo.title}
          </h2>
          <p className="line-clamp-6 text-xsmall16 text-neutral-20">
            {blogInfo.blogThumbnailInfo.lastModifiedDate?.format(
              'YYYY년 MM월 DD일',
            )}
          </p>
        </div>
        <img
          className="h-[60px] w-[100px] overflow-hidden rounded-md md:h-[90px] md:w-[130px]"
          src={blogInfo.blogThumbnailInfo.thumbnail || ''}
          alt="thumbnail"
        />
      </div>
    </div>
  );
};

export default RecommendBlogCard;
