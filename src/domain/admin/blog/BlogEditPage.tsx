'use client';

import { BlogSchema } from '@/api/blog/blogSchema';
import BlogActionButtons from '@/domain/admin/blog/section/BlogActionButtons';
import BlogBasicInfoSection from '@/domain/admin/blog/section/BlogBasicInfoSection';
import BlogProgramRecommendSection from '@/domain/admin/blog/section/BlogProgramRecommendSection';
import BlogPublishDateSection from '@/domain/admin/blog/section/BlogPublishDateSection';
import BlogRecommendSection from '@/domain/admin/blog/section/BlogRecommendSection';
import BlogTagSection from '@/domain/admin/blog/section/BlogTagSection';
import { useBlogEditForm } from '@/domain/admin/blog/hooks/useBlogEditForm';
import EditorApp from '@/domain/admin/lexical/EditorApp';
import { useRouter } from 'next/navigation';

interface BlogEditPageProps {
  blogId: string;
  initialBlogData: BlogSchema;
}

const BlogEditPage = ({ blogId, initialBlogData }: BlogEditPageProps) => {
  const router = useRouter();
  const {
    editingValue,
    newTag,
    dateTime,
    content,
    initialEditorStateJsonString,
    tags,
    programMenuItems,
    blogMenuItems,
    onChange,
    onChangeCategory,
    onChangeTag,
    onSubmitTag,
    selectTag,
    deleteSelectedTag,
    deleteTag,
    onChangeEditor,
    setDateTime,
    patchBlog,
    handleChangeProgramRecommend,
    handleChangeBlogRecommend,
    handleChangeThumbnail,
  } = useBlogEditForm({ blogId, initialBlogData });

  return (
    <div className="mx-3 mb-40 mt-3">
      <header>
        <h1 className="text-2xl font-semibold">블로그 수정</h1>
      </header>
      <main className="max-w-screen-xl">
        <div className="mt-4 flex flex-col gap-4">
          <BlogBasicInfoSection
            category={editingValue.category}
            title={editingValue.title}
            description={editingValue.description}
            thumbnail={editingValue.thumbnail}
            onChangeCategory={onChangeCategory}
            onChangeField={onChange}
            onChangeThumbnail={handleChangeThumbnail}
          />

          <BlogTagSection
            selectedTagList={editingValue.tagList}
            tags={tags}
            newTag={newTag}
            onChangeTag={onChangeTag}
            onSubmitTag={onSubmitTag}
            onSelectTag={selectTag}
            onDeleteSelectedTag={deleteSelectedTag}
            onDeleteTag={deleteTag}
          />

          <div className="flex gap-5">
            <BlogProgramRecommendSection
              programRecommend={content.programRecommend!}
              programMenuItems={programMenuItems}
              onChange={handleChangeProgramRecommend}
            />
            <BlogRecommendSection
              blogRecommend={content.blogRecommend!}
              blogMenuItems={blogMenuItems}
              onChange={handleChangeBlogRecommend}
            />
          </div>

          <BlogPublishDateSection dateTime={dateTime} onChange={setDateTime} />

          <h2 className="mt-10">콘텐츠 편집</h2>
          <EditorApp
            initialEditorStateJsonString={initialEditorStateJsonString}
            onChange={onChangeEditor}
          />

          <BlogActionButtons
            onCancel={() => router.push('/admin/blog/list')}
            onSaveTemp={() => patchBlog(false)}
            onPublish={() => patchBlog(true)}
          />
        </div>
      </main>
    </div>
  );
};

export default BlogEditPage;
