import LiveMentoringDetailPage from '@/domain/live-mentoring/detail/LiveMentoringDetailPage';

const Page = async ({ params }: { params: Promise<{ mentorId: string }> }) => {
  const { mentorId } = await params;
  return <LiveMentoringDetailPage mentorId={mentorId} />;
};

export default Page;
