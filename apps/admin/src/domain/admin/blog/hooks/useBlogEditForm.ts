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
export function parseInitialContent(blogData: BlogSchema): BlogContent {
  const rawContent = blogData.blogDetailInfo.content;
  const emptyRecommend = createEmptyRecommend();

  if (!rawContent || rawContent === '') return emptyRecommend;

  // JSON이 아닌 content(과거 HTML 본문 등)도 있다. 파싱 실패로 훅이 던지면
  // errorElement가 없는 라우트라 수정 화면 전체가 죽어 글을 되살릴 방법이 없어진다.
  // 파싱되지 않으면 아래 구버전 경로와 같게 원문을 렉시컬로 넘긴다.
  let json: unknown;
  try {
    json = JSON.parse(rawContent);
  } catch {
    return { ...emptyRecommend, lexical: rawContent };
  }

  if (json && typeof json === 'object' && 'blogRecommend' in json) {
    return json as BlogContent;
  }

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
