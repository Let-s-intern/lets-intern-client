import dayjs from '@/lib/dayjs';
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { isAxiosError } from 'axios';
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  useBlogQuery,
  useBlogTagQuery,
  useDeleteBlogTagMutation,
  usePatchBlogMutation,
  usePostBlogTagMutation,
} from '@/api/blog';
import { PostTag, postTagSchema, TagDetail } from '@/api/blogSchema';
import { uploadFile } from '@/api/file';
import TagSelector from '@/components/admin/blog/TagSelector';
import TextFieldLimit from '@/components/admin/blog/TextFieldLimit';
import EditorApp from '@/components/admin/lexical/EditorApp';
import ImageUpload from '@/components/admin/program/ui/form/ImageUpload';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { blogCategory } from '@/utils/convert';
import { Dayjs } from 'dayjs';

const maxCtaTextLength = 23;
const maxTitleLength = 49;
const maxDescriptionLength = 100;
const initialBlog = {
  title: '',
  category: '',
  thumbnail: '',
  description: '',
  content: '',
  ctaLink: '',
  ctaText: '',
  displayDate: null,
  isDisplayed: '',
  tagList: [],
};

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

const BlogEditPage = () => {
  const navgiate = useNavigate();
  const { id } = useParams();

  const [editingValue, setEditingValue] = useState<EditBlog>(initialBlog);
  const [newTag, setNewTag] = useState('');

  const { snackbar: setSnackbar } = useAdminSnackbar();

  const [dateTime, setDateTime] = useState<Dayjs | null>(null);

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

  const initialEditorStateJsonString =
    !blogData?.blogDetailInfo.content || blogData?.blogDetailInfo.content === ''
      ? undefined
      : blogData?.blogDetailInfo.content;

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
    setEditingValue((prev) => ({ ...prev, content: jsonString }));
  };

  const patchBlog = async (event: MouseEvent<HTMLButtonElement>) => {
    const { name } = event.target as HTMLButtonElement;

    await patchBlogMutation.mutateAsync({
      ...editingValue,
      id: Number(id),
      isDisplayed: name === 'publish',
      tagList: editingValue.tagList.map((tag) => tag.id),
      displayDate:
        name === 'publish'
          ? dateTime
            ? dateTime?.format('YYYY-MM-DDTHH:mm')
            : dayjs().format('YYYY-MM-DDTHH:mm')
          : (dateTime?.format('YYYY-MM-DDTHH:mm') ?? ''),
    });

    setSnackbar('블로그가 수정되었습니다.');
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
      content: blogData.blogDetailInfo.content || '',
      ctaLink: blogData.blogDetailInfo.ctaLink || '',
      ctaText: blogData.blogDetailInfo.ctaText || '',
      displayDate,
      tagList: blogData.tagDetailInfos,
    });
    setDateTime(displayDate);
  }, [isLoading, blogData]);

  return (
    <div className="mx-3 mb-40 mt-3">
      <header>
        <h1 className="text-2xl font-semibold">블로그 수정</h1>
      </header>
      {isLoading ? (
        <span>로딩 중...</span>
      ) : blogData ? (
        <main className="max-w-screen-xl">
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex-no-wrap flex items-center gap-4">
              <FormControl size="small" required>
                <InputLabel id="category-label">카테고리</InputLabel>
                <Select
                  className="w-60"
                  id="category"
                  size="small"
                  label="카테고리"
                  name="category"
                  value={editingValue.category}
                  onChange={(e) => {
                    setEditingValue({
                      ...editingValue,
                      category: e.target.value,
                    });
                  }}
                >
                  {Object.entries(blogCategory).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  카테고리는 하나만 설정할 수 있습니다.
                </FormHelperText>
              </FormControl>
            </div>

            <TextFieldLimit
              type="text"
              label="제목"
              placeholder="제목"
              name="title"
              required
              value={editingValue.title}
              onChange={onChange}
              autoComplete="off"
              fullWidth
              maxLength={maxTitleLength}
              autoFocus={true}
            />
            <TextFieldLimit
              type="text"
              label="메타 디스크립션"
              placeholder="설명"
              name="description"
              value={editingValue.description}
              onChange={onChange}
              multiline
              minRows={3}
              autoComplete="off"
              fullWidth
              maxLength={maxDescriptionLength}
            />

            <div className="flex gap-4">
              <div className="w-56">
                <ImageUpload
                  label="블로그 썸네일"
                  id="file"
                  image={editingValue.thumbnail}
                  onChange={async (e) => {
                    const file = e.target.files?.item(0);
                    if (!file) {
                      setSnackbar('파일이 없습니다.');
                      return;
                    }
                    const url = await uploadFile({ file, type: 'BLOG' });

                    setEditingValue({ ...editingValue, thumbnail: url });
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="mb-5">
                  <TextField
                    type="text"
                    label="CTA 링크"
                    placeholder="CTA 링크"
                    size="small"
                    name="ctaLink"
                    value={editingValue.ctaLink}
                    onChange={onChange}
                    fullWidth
                    autoComplete="off"
                  />
                  <span className="text-0.875 text-neutral-35">
                    {
                      '*latest:{text}으로 설정하면, 텍스트를 제목에 포함하는 챌린지 상세페이지로 이동합니다. (예시) latest:인턴'
                    }
                  </span>
                </div>
                <TextFieldLimit
                  type="text"
                  label="CTA 텍스트"
                  placeholder="CTA 텍스트"
                  size="small"
                  name="ctaText"
                  value={editingValue.ctaText}
                  onChange={onChange}
                  autoComplete="off"
                  fullWidth
                  maxLength={maxCtaTextLength}
                />
              </div>
            </div>

            <div className="border px-6 py-10">
              <h2 className="mb-4">태그 설정</h2>
              <TagSelector
                selectedTagList={editingValue.tagList}
                tagList={tags}
                value={newTag}
                deleteSelectedTag={(id) => {
                  setEditingValue((prev) => ({
                    ...prev,
                    tagList: prev.tagList.filter((tag) => tag.id !== id),
                  }));
                }}
                deleteTag={async (tagId) => {
                  const res = await deleteBlogTagMutation.mutateAsync(tagId);
                  if (res?.status === 200) {
                    setSnackbar('태그를 삭제했습니다.');
                  }
                }}
                selectTag={selectTag}
                onChange={onChangeTag}
                onSubmit={onSubmitTag}
              />
            </div>

            <div className="border px-6 py-10">
              <h2 className="mb-2">게시 일자</h2>
              <DateTimePicker
                label="게시 일자"
                value={dateTime}
                onChange={setDateTime}
              />
            </div>

            <h2 className="mt-10">콘텐츠 편집</h2>
            <EditorApp
              initialEditorStateJsonString={initialEditorStateJsonString}
              onChange={onChangeEditor}
            />
            <div className="text-right">
              <div className="mb-1 flex items-center justify-end gap-4">
                <Button
                  variant="outlined"
                  type="button"
                  onClick={() => {
                    navgiate('/admin/blog/list');
                  }}
                >
                  취소 (리스트로 돌아가기)
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  type="button"
                  name="save_temp"
                  onClick={patchBlog}
                >
                  임시 저장
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="button"
                  name="publish"
                  onClick={patchBlog}
                >
                  발행
                </Button>
              </div>
              <span className="text-0.875 text-neutral-35">
                *임시 저장: 블로그가 숨겨집니다.
              </span>
            </div>
          </div>
        </main>
      ) : (
        <span>블로그를 불러오지 못했습니다.</span>
      )}
    </div>
  );
};

export default BlogEditPage;
