import { fetchPublicVodData } from '@/api/program';
import VodView from '@/domain/program/vod/VodView';
import VodCTAButtons from '@/domain/program/vod/ui/VodCTAButtons';
import { mapPublicVod } from '@/domain/program/vod/utils/publicVodMapping';
import { captureVodError } from '@/utils/captureError';
import {
  getCanonicalSiteUrl,
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
  try {
    const apiData = await fetchPublicVodData(id);
    const vod = mapPublicVod(apiData);
    const url =
      getCanonicalSiteUrl() +
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
  } catch (err) {
    captureVodError(err, { section: 'vodMetadata', extra: { vodId: id } });
    return {};
  }
}

const Page = async ({
  params,
}: {
  params: Promise<{ id: string; title: string }>;
}) => {
  const { id, title: _title } = await params;

  const vod = await fetchPublicVodData(id)
    .then(mapPublicVod)
    .catch((err) => {
      captureVodError(err, { section: 'vodDetailPage', extra: { vodId: id } });
      redirect('/');
    });

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
