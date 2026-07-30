import MentorDetailPage from '@/domain/mentors/detail/MentorDetailPage';

const Page = async ({
  params,
}: {
  params: Promise<{ mentorId: string }>;
}) => {
  const { mentorId } = await params;
  return <MentorDetailPage mentorId={mentorId} />;
};

export default Page;
