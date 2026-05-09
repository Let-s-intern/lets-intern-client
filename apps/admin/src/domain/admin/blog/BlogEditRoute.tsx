import { useBlogQuery } from '@/api/blog/blog';
import { useParams } from 'react-router-dom';
import BlogEditPage from './BlogEditPage';

const BlogEditRoute = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useBlogQuery(id ?? '');

  if (!id) return <div className="p-6">잘못된 접근입니다.</div>;
  if (isLoading) return <div className="p-6">불러오는 중…</div>;
  if (isError || !data)
    return <div className="p-6">블로그를 불러오지 못했습니다.</div>;

  return <BlogEditPage blogId={id} initialBlogData={data} />;
};

export default BlogEditRoute;
