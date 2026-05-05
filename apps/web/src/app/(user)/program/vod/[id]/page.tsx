import { fetchPublicVodData } from '@/api/program';
import { mapPublicVod } from '@/domain/program/vod/utils/publicVodMapping';
import { getProgramPathname } from '@/utils/url';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  let pathname: string;
  try {
    const apiData = await fetchPublicVodData(id);
    const vod = mapPublicVod(apiData);
    pathname = getProgramPathname({
      id,
      programType: 'vod',
      title: vod.title,
    });
  } catch {
    redirect('/');
  }

  redirect(pathname);
};

export default Page;
