import { fetchBlogData } from '@/api/blog/blog';
import BlogEditPage from '@/domain/admin/pages/blog/BlogEditPage';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const blogData = await fetchBlogData(id);

  return <BlogEditPage blogId={id} initialBlogData={blogData} />;
};

export default Page;
