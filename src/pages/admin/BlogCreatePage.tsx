import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';

import { useBlogTagQuery, usePostBlogTagMutation } from '../../api/blog';
import { TagDetail } from '../../api/blogSchema';
import BlogPostEditor from '../../components/admin/blog/BlogPostEditor';
import Tag from '../../components/admin/blog/Tag';
import TagDelete from '../../components/admin/blog/TagDelete';
import { blogCategory } from '../../utils/convert';

interface NewBlog {
  title: string;
  category: string;
  thumbnail: string;
  description: string;
  content: string;
  ctaLink: string;
  ctaText: string;
  displayDate: string;
  tagList: number[];
}

const BlogCreatePage = () => {
  const [value, setValue] = useState<NewBlog>({
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

  const handleSubmit = () => {
    console.log('블로그 제출');
  };

  const handleChange = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>,
  ) => {
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

  const { data: blogTagData } = useBlogTagQuery();
  const blogTagMutation = usePostBlogTagMutation(newTag, resetTag);

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
          <TextField
            type="text"
            label="제목"
            placeholder="제목"
            name="title"
            value={value.title}
            onChange={handleChange}
            autoComplete="off"
            fullWidth
          />
          <TextField
            type="text"
            label="설명"
            placeholder="설명"
            name="description"
            value={value.description}
            onChange={handleChange}
            multiline
            minRows={3}
            autoComplete="off"
            fullWidth
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
          <TextField
            type="text"
            label="CTA 텍스트"
            placeholder="CTA 텍스트"
            name="ctaText"
            value={value.ctaText}
            onChange={handleChange}
            autoComplete="off"
            fullWidth
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
              <span className="text-0.875 text-neutral-30">
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
                  <Tag key={tag.id} id={tag.id} title={tag.title!} />
                ))}
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default BlogCreatePage;
