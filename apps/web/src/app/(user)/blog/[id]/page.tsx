import { fetchBlogData } from '@/api/blog/blog';
import { getBlogPathname } from '@/utils/url';
import * as Sentry from '@sentry/nextjs';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  Sentry.setTag('domain', 'blog');
  Sentry.setTag('blog.route', '/blog/[id]');

  const { id } = await params;
  Sentry.setTag('blog.id', id);
  const blog = await fetchBlogData(id);

  redirect(
    getBlogPathname({
      id,
      title: blog.blogDetailInfo.title,
    }),
  );
};

export default Page;
