import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from '@mui/material';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  useBlogQuery,
  useBlogTagQuery,
  usePatchBlogMutation,
  usePostBlogTagMutation,
} from '../../api/blog';
import { TagDetail } from '../../api/blogSchema';
import { uploadFile } from '../../api/file';
import DateTimePicker from '../../components/admin/blog/DateTimePicker';
import TagSelector from '../../components/admin/blog/TagSelector';
import TextFieldLimit from '../../components/admin/blog/TextFieldLimit';
import EditorApp from '../../components/admin/lexical/EditorApp';
import ImageUpload from '../../components/admin/program/ui/form/ImageUpload';
import { blogCategory } from '../../utils/convert';

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
  isDisplayed: false,
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
  tagList: TagDetail[];
}

const BlogEditPage = () => {
  const navgiate = useNavigate();
  const { id } = useParams();

  const { data: tags = [] } = useBlogTagQuery();
  const { data: blogData, isLoading } = useBlogQuery(id!);
  const blogTagMutation = usePostBlogTagMutation();
  const patchBlogMutation = usePatchBlogMutation();

  const [editingValue, setEditingValue] = useState<EditBlog>(initialBlog);
  const [newTag, setNewTag] = useState('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: '',
  });

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditingValue({
      ...editingValue,
      [event.target.name]: event.target.value,
    });
  };

  const onChangeTag = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTag(event.target.value);
  };

  const onKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' || newTag === '') {
      return;
    }

    const isExist = tags?.some((tag) => tag.title === newTag);
    if (isExist) {
      setSnackbar({ open: true, message: '이미 존재하는 태그입니다.' });
      return;
    }

    await blogTagMutation.mutateAsync(newTag);
    setSnackbar({ open: true, message: `태그가 생성되었습니다: ${newTag}` });
    setNewTag('');
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
    });

    setSnackbar({
      open: true,
      message: '블로그가 수정되었습니다.',
    });
    navgiate('/admin/blog/list');
  };

  useEffect(() => {
    console.log('editingValue', editingValue);
  }, [editingValue]);

  useEffect(() => {
    if (isLoading || !blogData) return;
    setEditingValue({
      title: blogData.blogDetailInfo.title!,
      category: blogData.blogDetailInfo.category!,
      thumbnail: blogData.blogDetailInfo.thumbnail || '',
      description: blogData.blogDetailInfo.description || '',
      content: blogData.blogDetailInfo.content || '',
      ctaLink: blogData.blogDetailInfo.ctaLink || '',
      ctaText: blogData.blogDetailInfo.ctaText || '',
      tagList: blogData.tagDetailInfos,
    });
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
                      setSnackbar({ open: true, message: '파일이 없습니다.' });
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
                deleteTag={(id) => {
                  setEditingValue((prev) => ({
                    ...prev,
                    tagList: prev.tagList.filter((tag) => tag.id !== id),
                  }));
                }}
                selectTag={(tag) => {
                  const isExist = editingValue.tagList.some(
                    (item) => item.id === tag.id,
                  );
                  if (isExist) {
                    return;
                  }
                  setEditingValue((prev) => ({
                    ...prev,
                    tagList: [...editingValue.tagList, tag],
                  }));
                }}
                onChange={onChangeTag}
                onKeyDown={onKeyDown}
              />
            </div>

            <div className="border px-6 py-10">
              <DateTimePicker onChange={() => console.log('날짜 선택')} />
            </div>

            <h2 className="mt-10">콘텐츠 편집</h2>
            <EditorApp
              editorStateJsonString={blogData.blogDetailInfo.content!}
              getJSONFromLexical={onChangeEditor}
            />

            <div className="flex items-center justify-end gap-4">
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
          </div>
        </main>
      ) : (
        <span>블로그를 불러오지 못했습니다.</span>
      )}

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </div>
  );
};

export default BlogEditPage;
