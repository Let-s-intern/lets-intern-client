import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { AxiosResponse } from 'axios';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useBlogTagQuery,
  usePostBlogMutation,
  usePostBlogTagMutation,
} from '../../api/blog';
import { PostBlog, TagDetail } from '../../api/blogSchema';
import { usePostFileMutation } from '../../api/file';
import BlogPostEditor from '../../components/admin/blog/BlogPostEditor';
import Tag from '../../components/admin/blog/Tag';
import TagDelete from '../../components/admin/blog/TagDelete';
import TextFieldLimit from '../../components/admin/blog/TextFieldLimit';
import ImageUpload from '../../components/admin/program/ui/form/ImageUpload';
import ActionButton from '../../components/admin/ui/button/ActionButton';
import { blogCategory } from '../../utils/convert';

const maxCtaTextLength = 23;
const maxTitleLength = 49;
const maxDescriptionLength = 100;

const BlogCreatePage = () => {
  const navgiate = useNavigate();

  const [value, setValue] = useState<PostBlog>({
    title: '',
    category: '',
    thumbnail: '',
    description: '',
    content: '',
    ctaLink: '',
    ctaText: '',
    displayDate: '',
    tagList: [],
  });
  const [newTag, setNewTag] = useState('');
  const [newTagList, setNewTagList] = useState<TagDetail[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (value.title === '' || value.category === '') {
      alert('카테고리와 제목을 입력해주세요');
      return;
    }

    // File을 url로 변환
    if (file) fileMutation.mutate({ type: 'BLOG', file });
    blogMutation.mutate(value);
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
    const i = newTagList.findIndex((tag) => tag.id === id);
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const isEmpty = newTag === '';
    const isExist = blogTagData?.tagDetailInfos.some(
      (tag) => tag.title === newTag,
    );

    if (event.key !== 'Enter' || isEmpty) return;
    if (isExist) {
      alert('이미 존재하는 태그입니다.');
    } else blogTagMutation.mutate();
  };

  const addTagToBlog = (tag: TagDetail) => {
    if (value.tagList.includes(tag.id)) return;
    setNewTagList((prev) => [...prev, { id: tag.id, title: tag.title }]);
    setValue((prev) => ({
      ...prev,
      tagList: [...prev.tagList, tag.id],
    }));
  };

  const resetTag = () => {
    setNewTag('');
  };

  const setImgUrl = (res: AxiosResponse) => {
    const imgUrl = res.data.data.fileUrl;
    setValue((prev) => ({ ...prev, thumbnail: imgUrl }));
  };

  const navigateToBlogList = () => {
    navgiate('/admin/blog/list');
  };

  const { data: blogTagData } = useBlogTagQuery();
  const blogTagMutation = usePostBlogTagMutation(newTag, resetTag);
  const fileMutation = usePostFileMutation(setImgUrl);
  const blogMutation = usePostBlogMutation(navigateToBlogList);

  return (
    <div className="mx-auto my-12 w-[36rem]">
      <header>
        <h1 className="text-2xl font-semibold">블로그 등록</h1>
      </header>
      <main>
        <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
          <FormControl fullWidth>
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
          <BlogPostEditor />
          https://lexical.dev/docs/getting-started/react 따라하는중...
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
          {/* 해시태그 */}
          <div className="mt-4">
            <div className="mb-4 flex flex-wrap gap-4">
              {newTagList.map((newTag) => (
                <TagDelete
                  key={newTag.title}
                  title={newTag.title}
                  onClickDelete={() => deleteTag(newTag.id)}
                />
              ))}
            </div>
            <div>
              <span className="text-0.875 text-neutral-40">
                자유 태그등록하기 (중복되지 않은 태그만 등록됩니다)
              </span>
              <TextField
                type="text"
                placeholder="등록할 태그를 입력하세요"
                name="tag"
                value={newTag}
                onChange={handleChangeTag}
                onKeyDown={handleKeyPress}
                fullWidth
              />
              <div className="mt-2 flex flex-wrap gap-4">
                {blogTagData?.tagDetailInfos.map((tag) => (
                  <Tag
                    key={tag.id}
                    id={tag.id}
                    title={tag.title!}
                    onClick={() => addTagToBlog(tag)}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* 버튼 */}
          <div className="mt-4 flex items-center justify-end gap-4">
            <ActionButton type="submit" bgColor="gray" width="6rem">
              임시 저장
            </ActionButton>
            <ActionButton type="submit">발행</ActionButton>
            <ActionButton to="/admin/blog/list" bgColor="gray">
              취소
            </ActionButton>
          </div>
        </form>
      </main>
    </div>
  );
};

export default BlogCreatePage;
