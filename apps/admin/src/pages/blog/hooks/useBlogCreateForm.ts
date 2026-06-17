import { usePostBlogMutation } from '@/api/blog/blog';
import {
  BlogContent,
  ProgramRecommendItem,
  TagDetail,
} from '@/api/blog/blogSchema';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';
import { Dayjs } from 'dayjs';
import { ChangeEvent, useState } from 'react';

interface CreateBlog {
  title: string;
  category: string;
  thumbnail: string;
  description: string;
  ctaLink: string;
  ctaText: string;
  tagList: TagDetail[];
}

const RECOMMEND_SLOT_COUNT = 4;

const initialBlog: CreateBlog = {
  title: '',
  category: '',
  thumbnail: '',
  description: '',
  ctaLink: '',
  ctaText: '',
  tagList: [],
};

const initialContent: BlogContent = {
  programRecommend: Array(RECOMMEND_SLOT_COUNT).fill({ id: null }),
  blogRecommend: new Array(RECOMMEND_SLOT_COUNT).fill(null),
};

export const useBlogCreateForm = () => {
  const { snackbar: setSnackbar } = useAdminSnackbar();
  const createBlogMutation = usePostBlogMutation();

  const [editingValue, setEditingValue] = useState<CreateBlog>(initialBlog);
  const [dateTime, setDateTime] = useState<Dayjs | null>(null);
  const [content, setContent] = useState<BlogContent>(initialContent);

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

  const postBlog = async (isPublish: boolean) => {
    const displayDate =
      isPublish && !dateTime
        ? dayjs().format('YYYY-MM-DDTHH:mm')
        : (dateTime?.format('YYYY-MM-DDTHH:mm') ?? '');

    await createBlogMutation.mutateAsync({
      ...editingValue,
      content: JSON.stringify(content),
      isDisplayed: isPublish,
      tagList: editingValue.tagList.map((tag) => tag.id),
      displayDate,
    });

    setSnackbar('블로그가 생성되었습니다.');
  };

  return {
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
  };
};
