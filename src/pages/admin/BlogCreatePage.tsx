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
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useBlogTagQuery,
  usePostBlogMutation,
  usePostBlogTagMutation,
} from '../../api/blog';
import { PostBlogReqBody } from '../../api/blogSchema';
import { uploadFile } from '../../api/file';
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

const BlogCreatePage = () => {
  const navgiate = useNavigate();

  const [editingValue, setEditingValue] =
    useState<PostBlogReqBody>(initialBlog);
  const [newTag, setNewTag] = useState('');

  const { data: tags = [] } = useBlogTagQuery();
  const blogTagMutation = usePostBlogTagMutation();
  // const fileMutation = usePostFileMutation();
  const blogMutation = usePostBlogMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const intent = (event.nativeEvent as SubmitEvent).submitter?.getAttribute(
      'value',
    );

    if (!intent) {
      return;
    }

    event.preventDefault();
    console.log('event', event);
    const formData = new FormData(event.currentTarget);
    // Object.fromEntries(formData.entries());
    console.log('event entries', Object.fromEntries(formData.entries()));
    console.log('event.currentTarget.value', event.currentTarget.value);

    await blogMutation.mutateAsync({
      ...editingValue,
      isDisplayed: event.currentTarget.intent.value === 'publish',
    });

    setSnackbar({
      open: true,
      message: '블로그가 생성되었습니다.',
    });
    navgiate('/admin/blog/list');
  };

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: '',
  });

  const handleChangeTag = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTag(event.target.value);
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== 'Enter') {
      return;
    }

    // 이미 존재하는 태그인지 체크
    const isExist = tags?.some((tag) => tag.title === newTag);
    if (isExist) {
      setSnackbar({ open: true, message: '이미 존재하는 태그입니다.' });
      return;
    }

    // 태그 생성
    await blogTagMutation.mutateAsync(newTag);
    setSnackbar({ open: true, message: `태그가 생성되었습니다: ${newTag}` });
  };

  const onChangeEditor = (jsonString: string) => {
    setEditingValue((prev) => ({ ...prev, content: jsonString }));
  };

  useEffect(() => {
    console.log('editingValue', editingValue);
  }, [editingValue]);

  const selectedTagList = tags.filter((tag) =>
    editingValue.tagList.includes(tag.id),
  );

  return (
    <div className="mx-3 mb-40 mt-3">
      <header>
        <h1 className="text-2xl font-semibold">블로그 등록</h1>
      </header>
      <main className="max-w-screen-xl">
        <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
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
            onChange={(e) => {
              setEditingValue({ ...editingValue, title: e.target.value });
            }}
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
            onChange={(e) => {
              setEditingValue({ ...editingValue, description: e.target.value });
            }}
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
                  onChange={(e) => {
                    setEditingValue({
                      ...editingValue,
                      ctaLink: e.target.value,
                    });
                  }}
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
                onChange={(e) => {
                  setEditingValue({ ...editingValue, ctaText: e.target.value });
                }}
                autoComplete="off"
                fullWidth
                maxLength={maxCtaTextLength}
              />
            </div>
          </div>

          <div className="border px-6 py-10">
            <h2>태그 설정</h2>
            <TagSelector
              selectedTagList={selectedTagList}
              tagList={tags}
              value={newTag}
              deleteTag={(id) => {
                setEditingValue((prev) => ({
                  ...prev,
                  tagList: prev.tagList.filter((tag) => tag !== id),
                }));
              }}
              selectTag={(tag) => {
                setEditingValue((prev) => ({
                  ...prev,
                  tagList: [...new Set([...editingValue.tagList, tag.id])],
                }));
              }}
              onChange={handleChangeTag}
              onKeyDown={handleKeyDown}
            />
          </div>

          <h2 className="mt-20">콘텐츠 편집</h2>
          <EditorApp getJSONFromLexical={onChangeEditor} />

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
              type="submit"
              name="intent"
              value="save_temp"
            >
              임시 저장
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              name="intent"
              value="publish"
            >
              발행
            </Button>
          </div>
        </form>
      </main>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </div>
  );
};

export default BlogCreatePage;
