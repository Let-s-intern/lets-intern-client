import { fetchLiveData } from '@/api/program';
import { isDeprecatedProgram } from '@/lib/isDeprecatedProgram';
import {
  getBaseUrlFromServer,
  getLiveTitle,
  getProgramPathname,
} from '@/utils/url';
import LiveCTAButtons from '@components/LiveCTAButtons';
import LiveView from '@components/LiveView';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

// SSR 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const program = await fetchLiveData(id);
  const url =
    getBaseUrlFromServer() +
    getProgramPathname({ id, programType: 'live', title: program.title });
  const title = getLiveTitle(program);

  return {
    title,
    description: program.shortDesc,
    openGraph: {
      title,
      description: program.shortDesc || undefined,
      url,
      images: [
        {
          url: program.thumbnail ?? '',
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
  const { id } = await params;

  const [live] = await Promise.all([fetchLiveData(id)]);

  const isDeprecated = isDeprecatedProgram(live);

  if (isDeprecated) {
    redirect(`/program/old/live/${id}`);
  }

  return (
    <>
      <LiveView live={live} />
      <LiveCTAButtons live={live} liveId={id} />
    </>
  );
};

export default Page;
