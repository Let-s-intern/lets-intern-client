import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';

import BlogPostEditor from '../../components/admin/blog/BlogPostEditor';
import { blogCategory } from '../../utils/convert';

const BlogCreatePage = () => {
  const [value, setValue] = useState({
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

  return (
    <main className="mx-auto my-12 w-[36rem]">
      <header>
        <h1 className="text-2xl font-semibold">블로그 등록</h1>
      </header>
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
      </form>
    </main>
  );
};

export default BlogCreatePage;
