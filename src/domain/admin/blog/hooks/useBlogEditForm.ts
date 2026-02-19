import {
  useBlogTagQuery,
  useDeleteBlogTagMutation,
  usePatchBlogMutation,
  usePostBlogTagMutation,
} from '@/api/blog/blog';
import {
  BlogContent,
  BlogSchema,
  PostTag,
  postTagSchema,
  TagDetail,
} from '@/api/blog/blogSchema';
import { uploadFile } from '@/api/file';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import useBlogMenuItems from '@/hooks/useBlogMenuItems';
import useProgramMenuItems from '@/hooks/useProgramMenuItems';
import dayjs from '@/lib/dayjs';
import { SelectChangeEvent } from '@mui/material';
import { isAxiosError } from 'axios';
import { Dayjs } from 'dayjs';
import { ChangeEvent, FormEvent, useMemo, useState } from 'react';

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

const RECOMMEND_SLOT_COUNT = 4;

function createEmptyRecommend(): Pick<
  BlogContent,
  'programRecommend' | 'blogRecommend'
> {
  return {
    programRecommend: Array(RECOMMEND_SLOT_COUNT).fill({
      id: null,
      ctaTitle: undefined,
      ctaLink: undefined,
    }),
    blogRecommend: new Array(RECOMMEND_SLOT_COUNT),
  };
}

// 구버전: content에 렉시컬 저장
// 신버전: content에 렉시컬과 추천 콘텐츠 저장
// 구버전을 신버전 구조로 만드는 과정
function parseInitialContent(blogData: BlogSchema): BlogContent {
  const rawContent = blogData.blogDetailInfo.content;
  const emptyRecommend = createEmptyRecommend();

  if (!rawContent || rawContent === '') return emptyRecommend;

  const json = JSON.parse(rawContent);
  if (json.blogRecommend) return json;

  return { ...emptyRecommend, lexical: rawContent };
}

function buildEditingValue(blogData: BlogSchema): Omit<EditBlog, 'content'> {
  const { blogDetailInfo, tagDetailInfos } = blogData;
  const displayDate = blogDetailInfo.displayDate
    ? dayjs(blogDetailInfo.displayDate)
    : null;

  return {
    title: blogDetailInfo.title ?? '',
    category: blogDetailInfo.category ?? '',
    thumbnail: blogDetailInfo.thumbnail ?? '',
    description: blogDetailInfo.description ?? '',
    ctaLink: blogDetailInfo.ctaLink ?? '',
    ctaText: blogDetailInfo.ctaText ?? '',
    displayDate,
    tagList: tagDetailInfos,
  };
}

interface UseBlogEditFormParams {
  blogId: string;
  initialBlogData: BlogSchema;
}

export const useBlogEditForm = ({
  blogId,
  initialBlogData,
}: UseBlogEditFormParams) => {
  const { snackbar: setSnackbar } = useAdminSnackbar();

  const { data: tags = [] } = useBlogTagQuery();
  const createBlogTagMutation = usePostBlogTagMutation();
  const patchBlogMutation = usePatchBlogMutation();
  const deleteBlogTagMutation = useDeleteBlogTagMutation({
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 400) {
        setSnackbar('블로그에 연결된 태그는 삭제할 수 없습니다.');
      }
    },
  });

  // 초기 상태 계산 (useEffect 대신 직접 초기화)
  const initialContent = useMemo(
    () => parseInitialContent(initialBlogData),
    [initialBlogData],
  );
  const initialEditingValue = useMemo(
    () => buildEditingValue(initialBlogData),
    [initialBlogData],
  );

  const initialEditorStateJsonString = initialContent.lexical;

  // 폼 상태
  const [editingValue, setEditingValue] = useState(initialEditingValue);
  const [newTag, setNewTag] = useState('');
  const [dateTime, setDateTime] = useState<Dayjs | null>(
    initialEditingValue.displayDate,
  );
  const [content, setContent] = useState<BlogContent>(initialContent);

  // 메뉴 아이템 훅
  const programMenuItems = useProgramMenuItems();
  const blogMenuItems = useBlogMenuItems();

  // 핸들러
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditingValue({
      ...editingValue,
      [event.target.name]: event.target.value,
    });
  };

  const onChangeCategory = (category: string) => {
    setEditingValue((prev) => ({ ...prev, category }));
  };

  const onChangeTag = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTag(event.target.value);
  };

  const selectTag = (tag: TagDetail | PostTag) => {
    const isExist = editingValue.tagList.some((item) => item.id === tag.id);
    if (isExist) return;

    setEditingValue((prev) => ({
      ...prev,
      tagList: [...editingValue.tagList, tag],
    }));
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

  const deleteSelectedTag = (tagId: number) => {
    setEditingValue((prev) => ({
      ...prev,
      tagList: prev.tagList.filter((tag) => tag.id !== tagId),
    }));
  };

  const deleteTag = async (tagId: number) => {
    const res = await deleteBlogTagMutation.mutateAsync(tagId);
    if (res?.status === 200) {
      setSnackbar('태그를 삭제했습니다.');
    }
  };

  const onChangeEditor = (jsonString: string) => {
    setContent((prev) => ({ ...prev, lexical: jsonString }));
  };

  const patchBlog = async (isPublish: boolean) => {
    await patchBlogMutation.mutateAsync({
      ...editingValue,
      content: JSON.stringify(content),
      id: Number(blogId),
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

  return {
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
  };
};
