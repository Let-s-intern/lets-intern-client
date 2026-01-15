import { fetchChallengeData } from '@/api/challenge/challenge';
import { getProgramPathname } from '@/utils/url';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const challenge = await fetchChallengeData(id);

  const pathname = getProgramPathname({
    id,
    programType: 'challenge',
    title: challenge.title,
  });

  redirect(pathname);
};

export default Page;
