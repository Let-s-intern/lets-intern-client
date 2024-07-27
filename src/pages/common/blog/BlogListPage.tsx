import { useState } from 'react';
import BlogCategoryTag from '../../../components/common/blog/BlogCategoryTag';
import { blogCategory } from '../../../utils/convert';

const BlogListPage = () => {
  const [category, setCategory] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      <div className="w-full gap-y-1 bg-blog-banner px-[25px] py-10">
        <h1 className="text-xl font-bold text-neutral-100">
          렛츠커리어 블로그
        </h1>
        <p className="text-xsmall14 text-white/85">
          렛츠커리어의 독자적인 커리어 교육 콘텐츠를 확인해보세요.
        </p>
      </div>
      <div className="flex w-full flex-col gap-y-8 px-5 py-8 pt-5">
        <div className="flex w-full flex-wrap gap-2 py-2">
          <BlogCategoryTag
            category="전체"
            isClicked={!category}
            onClick={() => setCategory(null)}
          />
          <BlogCategoryTag
            category={blogCategory['LETSCAREER_NEWS']}
            isClicked={category === 'LETSCAREER_NEWS'}
            onClick={() => setCategory('LETSCAREER_NEWS')}
          />
          <BlogCategoryTag
            category={blogCategory['PROGRAM_REVIEWS']}
            isClicked={category === 'PROGRAM_REVIEWS'}
            onClick={() => setCategory('PROGRAM_REVIEWS')}
          />
          <BlogCategoryTag
            category={blogCategory['JOB_PREPARATION_TIPS']}
            isClicked={category === 'JOB_PREPARATION_TIPS'}
            onClick={() => setCategory('JOB_PREPARATION_TIPS')}
          />
          <BlogCategoryTag
            category={blogCategory['JOB_SUCCESS_STORIES']}
            isClicked={category === 'JOB_SUCCESS_STORIES'}
            onClick={() => setCategory('JOB_SUCCESS_STORIES')}
          />
          <BlogCategoryTag
            category={blogCategory['WORK_EXPERIENCES']}
            isClicked={category === 'WORK_EXPERIENCES'}
            onClick={() => setCategory('WORK_EXPERIENCES')}
          />
          <BlogCategoryTag
            category={blogCategory['JUNIOR_STORIES']}
            isClicked={category === 'JUNIOR_STORIES'}
            onClick={() => setCategory('JUNIOR_STORIES')}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogListPage;
