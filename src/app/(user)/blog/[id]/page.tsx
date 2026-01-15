import { fetchBlogData } from '@/api/blog/blog';
import { getBlogPathname } from '@/utils/url';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const blog = await fetchBlogData(id);

  try {
    redirect(
      getBlogPathname({
        id,
        title: blog.blogDetailInfo.title,
      }),
    );
  } catch (err) {
    console.log(err);
    redirect(
      getBlogPathname({
        id,
        title: blog.blogDetailInfo.title,
      }),
    );
  }
};

export default Page;
