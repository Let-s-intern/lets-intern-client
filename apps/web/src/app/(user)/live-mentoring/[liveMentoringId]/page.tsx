import LiveMentoringDetailPage from '@/domain/live-mentoring/detail/LiveMentoringDetailPage';

const Page = async ({
  params,
}: {
  params: Promise<{ liveMentoringId: string }>;
}) => {
  const { liveMentoringId } = await params;
  return <LiveMentoringDetailPage liveMentoringId={liveMentoringId} />;
};

export default Page;
