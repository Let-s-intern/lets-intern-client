'use client';

import {
  useBlogQuery,
  useBlogTagQuery,
  useDeleteBlogTagMutation,
  usePatchBlogMutation,
  usePostBlogTagMutation,
} from '@/api/blog/blog';
import {
  BlogContent,
  PostTag,
  postTagSchema,
  TagDetail,
} from '@/api/blog/blogSchema';
import { uploadFile } from '@/api/file';
import LoadingContainer from '@/common/loading/LoadingContainer';
import BlogActionButtons from '@/domain/admin/blog/section/BlogActionButtons';
import BlogBasicInfoSection from '@/domain/admin/blog/section/BlogBasicInfoSection';
import BlogProgramRecommendSection from '@/domain/admin/blog/section/BlogProgramRecommendSection';
import BlogPublishDateSection from '@/domain/admin/blog/section/BlogPublishDateSection';
import BlogRecommendSection from '@/domain/admin/blog/section/BlogRecommendSection';
import BlogTagSection from '@/domain/admin/blog/section/BlogTagSection';
import EditorApp from '@/domain/admin/lexical/EditorApp';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import useBlogMenuItems from '@/hooks/useBlogMenuItems';
import useProgramMenuItems from '@/hooks/useProgramMenuItems';
import dayjs from '@/lib/dayjs';
import { SelectChangeEvent } from '@mui/material';
import { isAxiosError } from 'axios';
import { Dayjs } from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';

interface EditBlog {
  title: string;
  category: string;
  thumbnail: string;
  description: string;
  content: string;
  ctaLink: string;
  ctaText: string;
  displayDate: Dayjs | null;
  tagList: TagDetail[];
}

const initialBlog = {
  title: '',
  category: '',
  thumbnail: '',
  description: '',
  ctaLink: '',
  ctaText: '',
  displayDate: null,
  isDisplayed: '',
  tagList: [],
};

const BlogEditPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { snackbar: setSnackbar } = useAdminSnackbar();

  const { data: tags = [] } = useBlogTagQuery();
  const { data: blogData, isLoading } = useBlogQuery(id!);
  const createBlogTagMutation = usePostBlogTagMutation();
  const patchBlogMutation = usePatchBlogMutation();
  const deleteBlogTagMutation = useDeleteBlogTagMutation({
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 400) {
        setSnackbar('블로그에 연결된 태그는 삭제할 수 없습니다.');
      }
    },
  });

  const initialRecommend = {
    programRecommend: Array(4).fill({
      id: null,
      ctaTitle: undefined,
      ctaLink: undefined,
    }),
    blogRecommend: new Array(4),
  };

  const isContentExist =
    blogData?.blogDetailInfo.content && blogData?.blogDetailInfo.content !== '';

  // 구버전: content에 렉시컬 저장
  // 신버전: content에 렉시컬과 추천 콘텐츠 저장
  // 구버전을 신버전 구조로 만드는 과정..
  const initialContent: BlogContent = useMemo(() => {
    if (!isContentExist) return initialRecommend;

    const json = JSON.parse(blogData?.blogDetailInfo.content ?? '{}');
    if (json.blogRecommend) return json;

    return {
      ...initialRecommend,
      lexical: blogData?.blogDetailInfo.content,
    };
  }, [blogData?.blogDetailInfo.content]);

  const initialEditorStateJsonString = initialContent.lexical;

  const [editingValue, setEditingValue] =
    useState<Omit<EditBlog, 'content'>>(initialBlog);
  const [newTag, setNewTag] = useState('');
  const [dateTime, setDateTime] = useState<Dayjs | null>(null);
  const [content, setContent] = useState<BlogContent>(initialContent);

  const programMenuItems = useProgramMenuItems();
  const blogMenuItems = useBlogMenuItems();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditingValue({
      ...editingValue,
      [event.target.name]: event.target.value,
    });
  };

  const onChangeTag = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTag(event.target.value);
  };

  const onSubmitTag = async (event: FormEvent) => {
    event.preventDefault();
    if (newTag.trim() === '') return;

    const isExist = tags?.some((tag) => tag.title === newTag);
    if (isExist) {
      setSnackbar('이미 존재하는 태그입니다.');
      return;
    }

    const res = await createBlogTagMutation.mutateAsync(newTag);
    const createdTag = postTagSchema.parse(res.data.data);
    selectTag(createdTag);
    setNewTag('');
    setSnackbar(`태그가 생성되었습니다: ${newTag}`);
  };

  const selectTag = (tag: TagDetail | PostTag) => {
    const isExist = editingValue.tagList.some((item) => item.id === tag.id);
    if (isExist) return;

    setEditingValue((prev) => ({
      ...prev,
      tagList: [...editingValue.tagList, tag],
    }));
  };

  const onChangeEditor = (jsonString: string) => {
    setContent((prev) => ({ ...prev, lexical: jsonString }));
  };

  const patchBlog = async (isPublish: boolean) => {
    await patchBlogMutation.mutateAsync({
      ...editingValue,
      content: JSON.stringify(content),
      id: Number(id),
      isDisplayed: isPublish,
      tagList: editingValue.tagList.map((tag) => tag.id),
      displayDate: dateTime?.format('YYYY-MM-DDTHH:mm'),
    });

    setSnackbar('블로그가 수정되었습니다.');
  };

  const handleChangeProgramRecommend = (
    e:
      | SelectChangeEvent<string | null>
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    setContent((prev) => {
      const list = [...prev.programRecommend!];
      const item = {
        ...list[index],
        [e.target.name]: e.target.value,
      };
      const notSelectProgram = e.target.value === 'null';

      // 프로그램이 '선택 안 함'이면 CTA 초기화
      if (e.target.name === 'id' && notSelectProgram) {
        item.id = null;
        delete item.ctaLink;
        delete item.ctaTitle;
      }

      return {
        ...prev,
        programRecommend: [
          ...list.slice(0, index),
          item,
          ...list.slice(index + 1),
        ],
      };
    });
  };

  const handleChangeBlogRecommend = (
    e: SelectChangeEvent<number | 'null'>,
    index: number,
  ) => {
    setContent((prev) => {
      const list = [...prev.blogRecommend!];
      list[index] = Number(e.target.value);

      return {
        ...prev,
        blogRecommend: list,
      };
    });
  };

  const handleChangeThumbnail = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) {
      setSnackbar('파일이 없습니다.');
      return;
    }
    const url = await uploadFile({ file, type: 'BLOG' });
    setEditingValue((prev) => ({ ...prev, thumbnail: url }));
  };

  useEffect(() => {
    if (isLoading || !blogData) return;
    const displayDate = blogData.blogDetailInfo.displayDate
      ? dayjs(blogData.blogDetailInfo.displayDate)
      : null;
    setEditingValue({
      title: blogData.blogDetailInfo.title!,
      category: blogData.blogDetailInfo.category!,
      thumbnail: blogData.blogDetailInfo.thumbnail || '',
      description: blogData.blogDetailInfo.description || '',
      ctaLink: blogData.blogDetailInfo.ctaLink || '',
      ctaText: blogData.blogDetailInfo.ctaText || '',
      displayDate,
      tagList: blogData.tagDetailInfos,
    });
    setDateTime(displayDate);
    setContent(initialContent);
  }, [isLoading, blogData]);

  if (isLoading) return <LoadingContainer className="mt-[20%]" />;

  return (
    <div className="mx-3 mb-40 mt-3">
      <header>
        <h1 className="text-2xl font-semibold">블로그 수정</h1>
      </header>
      {blogData ? (
        <main className="max-w-screen-xl">
          <div className="mt-4 flex flex-col gap-4">
            <BlogBasicInfoSection
              category={editingValue.category}
              title={editingValue.title}
              description={editingValue.description}
              thumbnail={editingValue.thumbnail}
              onChangeCategory={(category) =>
                setEditingValue((prev) => ({ ...prev, category }))
              }
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
              onDeleteSelectedTag={(tagId) => {
                setEditingValue((prev) => ({
                  ...prev,
                  tagList: prev.tagList.filter((tag) => tag.id !== tagId),
                }));
              }}
              onDeleteTag={async (tagId) => {
                const res = await deleteBlogTagMutation.mutateAsync(tagId);
                if (res?.status === 200) {
                  setSnackbar('태그를 삭제했습니다.');
                }
              }}
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

            <BlogPublishDateSection
              dateTime={dateTime}
              onChange={setDateTime}
            />

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
      ) : (
        <span>블로그를 불러오지 못했습니다.</span>
      )}
    </div>
  );
};

export default BlogEditPage;
