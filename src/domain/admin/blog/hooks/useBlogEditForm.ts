import { usePatchBlogMutation } from '@/api/blog/blog';
import {
  BlogContent,
  BlogSchema,
  ProgramRecommendItem,
  TagDetail,
} from '@/api/blog/blogSchema';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';
import { Dayjs } from 'dayjs';
import { ChangeEvent, useMemo, useState } from 'react';

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
  const patchBlogMutation = usePatchBlogMutation();

  // 초기 상태 계산
  const initialContent = useMemo(
    () => parseInitialContent(initialBlogData),
    [initialBlogData],
  );
  const initialEditingValue = useMemo(
    () => buildEditingValue(initialBlogData),
    [initialBlogData],
  );

  // 폼 상태
  const [editingValue, setEditingValue] = useState(initialEditingValue);
  const [dateTime, setDateTime] = useState<Dayjs | null>(
    initialEditingValue.displayDate,
  );
  const [content, setContent] = useState<BlogContent>(initialContent);

  // 공통 핸들러
  const onChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    setEditingValue((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onChangeCategory = (category: string) => {
    setEditingValue((prev) => ({ ...prev, category }));
  };

  const onChangeThumbnail = (url: string) => {
    setEditingValue((prev) => ({ ...prev, thumbnail: url }));
  };

  const onChangeTagList = (tagList: TagDetail[]) => {
    setEditingValue((prev) => ({ ...prev, tagList }));
  };

  const onChangeProgramRecommend = (items: ProgramRecommendItem[]) => {
    setContent((prev) => ({ ...prev, programRecommend: items }));
  };

  const onChangeBlogRecommend = (items: (number | null)[]) => {
    setContent((prev) => ({ ...prev, blogRecommend: items }));
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

  return {
    editingValue,
    dateTime,
    content,
    initialEditorStateJsonString: initialContent.lexical,
    onChangeField,
    onChangeCategory,
    onChangeThumbnail,
    onChangeTagList,
    onChangeProgramRecommend,
    onChangeBlogRecommend,
    onChangeEditor,
    setDateTime,
    patchBlog,
  };
};
