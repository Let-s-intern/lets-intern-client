import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useBlogTagQuery,
  usePostBlogMutation,
  usePostBlogTagMutation,
} from '../../api/blog';
import { PostBlogReqBody, TagDetail } from '../../api/blogSchema';
import { usePostFileMutation } from '../../api/file';
import BlogPostEditor from '../../components/admin/blog/BlogPostEditor';
import TagSelector from '../../components/admin/blog/TagSelector';
import TextFieldLimit from '../../components/admin/blog/TextFieldLimit';
import ImageUpload from '../../components/admin/program/ui/form/ImageUpload';
import ActionButton from '../../components/admin/ui/button/ActionButton';
import { blogCategory } from '../../utils/convert';

const maxCtaTextLength = 23;
const maxTitleLength = 49;
const maxDescriptionLength = 100;
const titleHelperText = '제목을 입력해주세요';
const categoryHelperText = '카테고리를 선택주세요';
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

  const [value, setValue] = useState<PostBlogReqBody>(initialBlog);
  const [newTag, setNewTag] = useState('');
  const [selectedTagList, setNewTagList] = useState<TagDetail[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [isCategoryValid, setIsCategoryValid] = useState(true);

  const { data: blogTagData } = useBlogTagQuery();
  const blogTagMutation = usePostBlogTagMutation(function resetTag() {
    setNewTag('');
  });
  const fileMutation = usePostFileMutation();
  const blogMutation = usePostBlogMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const saveBlog = async () => {
    if (!validate()) return;

    const thumbnail = await convertFiletoUrl(file);
    const reqBody = { ...value, thumbnail };
    blogMutation.mutate(reqBody);
    navgiate('/admin/blog/list');
  };

  const submitBlog = async () => {
    if (!validate()) return;

    const thumbnail = await convertFiletoUrl(file);
    const reqBody = { ...value, thumbnail, isDisplayed: true };
    blogMutation.mutate(reqBody);
    navgiate('/admin/blog/list');
  };

  const convertFiletoUrl = async (file: File | null) => {
    if (!file) return '';
    const res = await fileMutation.mutateAsync({ type: 'BLOG', file });
    return res.data.data.fileUrl;
  };

  const validate = () => {
    // 제목, 카테고리는 필수값
    let isValid = true;

    if (value.category === '') {
      setIsCategoryValid(false);
      isValid = false;
    }
    if (value.title === '') {
      setIsTitleValid(false);
      isValid = false;
    }
    if (!isValid) scrollTo(0, 0);

    return isValid;
  };

  const handleChange = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>,
  ) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      setFile(target.files[0]);
      return;
    }
    setValue({ ...value, [event.target.name]: event.target.value });
  };

  const deleteTag = (id: number) => {
    const i = selectedTagList.findIndex((tag) => tag.id === id);
    setNewTagList((prev) => [...prev.slice(0, i), ...prev.slice(i + 1)]);
    const j = value.tagList.findIndex((tag) => tag === id);
    setValue((prev) => ({
      ...prev,
      tagList: [...prev.tagList.slice(0, j), ...prev.tagList.slice(j + 1)],
    }));
  };

  const handleChangeTag = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTag(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const isEmpty = newTag === '';
    const isExist = blogTagData?.tagDetailInfos.some(
      (tag) => tag.title === newTag,
    );

    if (event.key !== 'Enter' || isEmpty) return;
    if (isExist) {
      alert('이미 존재하는 태그입니다.');
    } else blogTagMutation.mutate(newTag);
  };

  const getJSONFromLexical = (jsonString: string) => {
    setValue((prev) => ({ ...prev, content: jsonString }));
  };

  const selectTag = (tag: TagDetail) => {
    if (value.tagList.includes(tag.id)) return;
    setNewTagList((prev) => [...prev, { id: tag.id, title: tag.title }]);
    setValue((prev) => ({
      ...prev,
      tagList: [...prev.tagList, tag.id],
    }));
  };

  return (
    <div className="mx-auto my-12 w-[36rem]">
      <header>
        <h1 className="text-2xl font-semibold">블로그 등록</h1>
      </header>
      <main>
        <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
          <FormControl
            focused={!isCategoryValid}
            error={!isCategoryValid}
            fullWidth
          >
            <InputLabel id="category">카테고리</InputLabel>
            <Select
              labelId="category"
              id="category"
              label="구분"
              name="category"
              value={value.category}
              onChange={handleChange}
            >
              {Object.entries(blogCategory).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {!isCategoryValid ? categoryHelperText : ''}
            </FormHelperText>
          </FormControl>
          <TextFieldLimit
            type="text"
            label="제목"
            placeholder="제목"
            name="title"
            value={value.title}
            onChange={handleChange}
            autoComplete="off"
            fullWidth
            maxLength={maxTitleLength}
            focused={!isTitleValid}
            error={!isTitleValid}
            helperText={!isTitleValid ? titleHelperText : ''}
          />
          <TextFieldLimit
            type="text"
            label="메타 디스크립션"
            placeholder="설명"
            name="description"
            value={value.description}
            onChange={handleChange}
            multiline
            minRows={3}
            autoComplete="off"
            fullWidth
            maxLength={maxDescriptionLength}
          />
          <ImageUpload
            label="블로그 썸네일"
            id="file"
            name="file"
            image={value.thumbnail as string}
            onChange={handleChange}
          />
          <BlogPostEditor getJSONFromLexical={getJSONFromLexical} />
          <TextField
            type="text"
            label="CTA 링크"
            placeholder="CTA 링크"
            name="ctaLink"
            value={value.ctaLink}
            onChange={handleChange}
            autoComplete="off"
            fullWidth
          />
          <TextFieldLimit
            type="text"
            label="CTA 텍스트"
            placeholder="CTA 텍스트"
            name="ctaText"
            value={value.ctaText}
            onChange={handleChange}
            autoComplete="off"
            fullWidth
            maxLength={maxCtaTextLength}
          />
          <TagSelector
            selectedTagList={selectedTagList}
            tagList={blogTagData?.tagDetailInfos || []}
            value={newTag}
            deleteTag={deleteTag}
            selectTag={selectTag}
            onChange={handleChangeTag}
            onKeyDown={handleKeyDown}
          />
        </form>
      </main>
      {/* 버튼 */}
      <footer>
        <div className="flex items-center justify-end gap-4">
          <ActionButton
            onClick={saveBlog}
            type="button"
            bgColor="gray"
            width="6rem"
          >
            임시 저장
          </ActionButton>
          <ActionButton onClick={submitBlog} type="button">
            발행
          </ActionButton>
          <ActionButton type="button" to="/admin/blog/list" bgColor="gray">
            취소
          </ActionButton>
        </div>
      </footer>
    </div>
  );
};

export default BlogCreatePage;
