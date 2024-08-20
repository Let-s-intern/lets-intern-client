import dayjs from 'dayjs';
import { createContext, useContext } from 'react';
import { z } from 'zod';
import { blogSchema } from '../api/blogSchema';

export const mockBlog: z.infer<typeof blogSchema> = {
  blogDetailInfo: {
    id: 0,
    title: '로딩중...',
    description: '',
    content: '{"root":{"children":[]}}',
    displayDate: dayjs(),
    createDate: dayjs(),
    lastModifiedDate: dayjs(),
    thumbnail: '',
  },
  tagDetailInfos: [],
};

const context = createContext({
  blog: mockBlog,
});

export const BlogProvider: React.FC<{
  blog: z.infer<typeof blogSchema>;
  children: React.ReactNode;
}> = ({ children, blog }) => {
  return <context.Provider value={{ blog }}>{children}</context.Provider>;
};

export const useBlog = () => {
  const blog = useContext(context).blog;

  return blog;
};
