import { useBlogCreateForm } from '@/domain/admin/blog/hooks/useBlogCreateForm';
import BlogActionButtons from '@/domain/admin/blog/section/BlogActionButtons';
import BlogBasicInfoSection from '@/domain/admin/blog/section/BlogBasicInfoSection';
import BlogProgramRecommendSection from '@/domain/admin/blog/section/BlogProgramRecommendSection';
import BlogPublishDateSection from '@/domain/admin/blog/section/BlogPublishDateSection';
import BlogRecommendSection from '@/domain/admin/blog/section/BlogRecommendSection';
import BlogTagSection from '@/domain/admin/blog/section/BlogTagSection';
import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

const EditorApp = lazy(() => import('@/common/lexical/EditorApp'));

const BlogCreatePage = () => {
  const navigate = useNavigate();
  const {
    editingValue,
    dateTime,
    content,
    onChangeField,
    onChangeCategory,
    onChangeThumbnail,
    onChangeTagList,
    onChangeProgramRecommend,
    onChangeBlogRecommend,
    onChangeEditor,
    setDateTime,
    postBlog,
  } = useBlogCreateForm();

  return (
    <div className="mx-3 mb-40 mt-3">
      <header>
        <h1 className="text-2xl font-semibold">블로그 등록</h1>
      </header>
      <main className="max-w-screen-xl">
        <div className="mt-4 flex flex-col gap-4">
          <BlogBasicInfoSection
            category={editingValue.category}
            title={editingValue.title}
            description={editingValue.description}
            thumbnail={editingValue.thumbnail}
            onChangeCategory={onChangeCategory}
            onChangeField={onChangeField}
            onChangeThumbnail={onChangeThumbnail}
          />

          <BlogTagSection
            tagList={editingValue.tagList}
            onChangeTagList={onChangeTagList}
          />

          <div className="flex gap-5">
            <BlogProgramRecommendSection
              programRecommend={content.programRecommend!}
              onChangeProgramRecommend={onChangeProgramRecommend}
            />
            <BlogRecommendSection
              blogRecommend={content.blogRecommend!}
              onChangeBlogRecommend={onChangeBlogRecommend}
            />
          </div>

          <BlogPublishDateSection dateTime={dateTime} onChange={setDateTime} />

          <h2 className="mt-10">콘텐츠 편집</h2>

          <Suspense fallback={null}>
            <EditorApp onChange={onChangeEditor} />
          </Suspense>

          <BlogActionButtons
            onCancel={() => navigate('/admin/blog/list')}
            onSaveTemp={() => postBlog(false)}
            onPublish={() => postBlog(true)}
            helperText="*발행: 블로그가 바로 게시됩니다."
          />
        </div>
      </main>
    </div>
  );
};

export default BlogCreatePage;
