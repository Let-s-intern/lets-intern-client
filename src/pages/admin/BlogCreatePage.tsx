import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

import { useBlogTagQuery } from '../../api/blog';
import { TagDetail, TagDetailTitle } from '../../api/blogSchema';
import BlogPostEditor from '../../components/admin/blog/BlogPostEditor';
import { blogCategory } from '../../utils/convert';

interface BlogTag {
  title: TagDetailTitle;
}

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
  const { data: blogTagData } = useBlogTagQuery();

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
  const [newTagList, setNewTagList] = useState<BlogTag[]>([]);

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

  const handleChangeTag = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTag(event.target.value);
  };

  const handleKeyPressDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // 태그 등록
  };

  const addTagToBlog = (tag: TagDetail) => {
    if (value.tagList.includes(tag.id)) return;
    setNewTagList((prev) => [...prev, { title: tag.title }]);
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
            <div className="mb-4 flex gap-4">
              {newTagList.map((newTag) => (
                <div
                  key={newTag.title}
                  className="flex items-center gap-2.5 bg-[#FAEDEE] pl-2.5"
                >
                  <div className="text-0.875 bg-[#FAEDEE]">#{newTag.title}</div>
                  <IoCloseOutline
                    className="cursor-pointer bg-neutral-0"
                    color="#FFF"
                    size={20}
                  />
                </div>
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
                onKeyDown={handleKeyPressDown}
                fullWidth
              />
              <div className="mt-2 flex gap-4">
                {blogTagData?.tagDetailInfos.map((tag) => (
                  <div
                    key={tag.id}
                    className="text-0.75 cursor-pointer rounded-full bg-[#F3F5FA] px-2.5 py-1 text-primary-dark"
                    onClick={() => addTagToBlog(tag)}
                  >
                    #{tag.title}
                  </div>
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
