import { fetchPublicVodData } from '@/api/program';
import VodView from '@/domain/program/vod/VodView';
import VodCTAButtons from '@/domain/program/vod/ui/VodCTAButtons';
import { mapPublicVod } from '@/domain/program/vod/utils/publicVodMapping';
import {
  getBaseUrlFromServer,
  getVodTitle,
  getProgramPathname,
} from '@/utils/url';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const apiData = await fetchPublicVodData(id);
  const vod = mapPublicVod(apiData);
  const url =
    getBaseUrlFromServer() +
    getProgramPathname({
      id,
      programType: 'vod',
      title: vod.title,
    });
  const title = getVodTitle(vod);

  return {
    title,
    openGraph: {
      title,
      url,
      images: [
        {
          url: vod.thumbnail ?? '',
        },
      ],
    },
    alternates: {
      canonical: url,
    },
  };
}

const Page = async ({
  params,
}: {
  params: Promise<{ id: string; title: string }>;
}) => {
  const { id, title: _title } = await params;

  const apiData = await fetchPublicVodData(id);
  const vod = mapPublicVod(apiData);

  const correctPathname = getProgramPathname({
    id,
    programType: 'vod',
    title: vod.title,
  });

  const correctSlug = (vod.title?.replace(/[ /]/g, '-') || '').toLowerCase();
  let currentSlug = _title || '';
  try {
    currentSlug = decodeURIComponent(currentSlug);
  } catch {}
  currentSlug = currentSlug.toLowerCase();
  if (currentSlug !== correctSlug) {
    redirect(correctPathname);
  }

  return (
    <>
      <VodView vod={vod} id={id} />
      <VodCTAButtons vodId={id} title={vod.title} />
    </>
  );
};

export default Page;
