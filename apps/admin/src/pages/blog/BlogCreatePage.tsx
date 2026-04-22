'use client';

import { useBlogCreateForm } from '@/domain/admin/blog/hooks/useBlogCreateForm';
import BlogActionButtons from '@/domain/admin/blog/section/BlogActionButtons';
import BlogBasicInfoSection from '@/domain/admin/blog/section/BlogBasicInfoSection';
import BlogProgramRecommendSection from '@/domain/admin/blog/section/BlogProgramRecommendSection';
import BlogPublishDateSection from '@/domain/admin/blog/section/BlogPublishDateSection';
import BlogRecommendSection from '@/domain/admin/blog/section/BlogRecommendSection';
import BlogTagSection from '@/domain/admin/blog/section/BlogTagSection';
// TODO: next/ → react-router-dom 또는 공유 어댑터로 교체 필요 (Vite 이전)
import dynamic from 'next/dynamic';
// TODO: next/ → react-router-dom 또는 공유 어댑터로 교체 필요 (Vite 이전)
import { useRouter } from 'next/navigation';

const EditorApp = dynamic(() => import('@/common/lexical/EditorApp'), {
  ssr: false,
});

const BlogCreatePage = () => {
  const router = useRouter();
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

          <EditorApp onChange={onChangeEditor} />

          <BlogActionButtons
            onCancel={() => router.push('/admin/blog/list')}
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
