import { fetchPublicVodData } from '@/api/program';
import { mapPublicVod } from '@/domain/program/vod/utils/publicVodMapping';
import { getProgramPathname } from '@/utils/url';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const apiData = await fetchPublicVodData(id);
  const vod = mapPublicVod(apiData);

  const pathname = getProgramPathname({
    id,
    programType: 'vod',
    title: vod.title,
  });

  redirect(pathname);
};

export default Page;
