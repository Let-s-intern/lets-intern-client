import NoticeDetailPage from '@/domain/mentor/notice/NoticeDetailPage';

export default function Page({
  params,
}: {
  params: { noticeId: string };
}) {
  return <NoticeDetailPage noticeId={params.noticeId} />;
}
