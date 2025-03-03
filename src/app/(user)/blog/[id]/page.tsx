import { fetchBlogData } from '@/api/blog';
import { getBlogPathname } from '@/utils/url';
import EmptyContainer from '@components/common/ui/EmptyContainer';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const blog = await fetchBlogData(id);

  if (!id) {
    return <EmptyContainer text="존재하지 않는 블로그입니다." />;
  }

  if (!blog.blogDetailInfo.title) {
    return (
      <LoadingContainer
        className="mt-[20%]"
        text="블로그를 불러오는 중입니다.."
      />
    );
  }

  redirect(
    getBlogPathname({
      id,
      title: blog.blogDetailInfo.title,
    }),
  );
};

export default Page;
