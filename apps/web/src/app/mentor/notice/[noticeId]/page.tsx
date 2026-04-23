import NoticeDetailPage from '@/domain/mentor/notice/NoticeDetailPage';

const Page = async ({
  params,
}: {
  params: Promise<{ noticeId: string }>;
}) => {
  const { noticeId } = await params;
  return <NoticeDetailPage noticeId={noticeId} />;
};

export default Page;
