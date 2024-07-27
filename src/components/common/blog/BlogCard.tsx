import { BlogInfoType } from '../../../api/blogSchema';
import { blogCategory } from '../../../utils/convert';
import BlogHashtag from './BlogHashtag';

const BlogCard = (blogInfo: BlogInfoType) => {
  return (
    <div>
      <span>{blogCategory[blogInfo.blogThumbnailInfo.category || '']}</span>
      <div>
        <div>
          <div>
            <h2>{blogInfo.blogThumbnailInfo.title}</h2>
            <img
              src={blogInfo.blogThumbnailInfo.thumbnail || ''}
              alt="thumbnail"
            />
          </div>
          <p>{blogInfo.blogThumbnailInfo.description}</p>
        </div>
        <div>
          {blogInfo.tagDetailInfos.map((tag) => (
            <BlogHashtag
              key={tag.id}
              text={tag.title || ''}
              onClick={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
