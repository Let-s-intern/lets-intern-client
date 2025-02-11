import { fetchLiveData } from '@/api/program';
import { getProgramPathname } from '@/utils/url';
import { notFound, redirect } from 'next/navigation';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const live = await fetchLiveData(id);
  if (!live) {
    notFound();
  }

  const pathname = getProgramPathname({
    id,
    programType: 'live',
    title: live.title,
  });

  redirect(pathname);
};

export default Page;
