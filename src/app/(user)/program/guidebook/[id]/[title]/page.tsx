import { fetchGuidebookData } from '@/api/program';
import GuidebookCTAButtons from '@/domain/program/guidebook/GuidebookCTAButtons';
import GuidebookView from '@/domain/program/guidebook/GuidebookView';
import {
  getBaseUrlFromServer,
  getGuidebookTitle,
  getProgramPathname,
} from '@/utils/url';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

// SSR 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const program = await fetchGuidebookData(id);
  const url =
    getBaseUrlFromServer() +
    getProgramPathname({
      id,
      programType: 'guidebook',
      title: program.title,
    });
  const title = getGuidebookTitle(program);

  return {
    title,
    description: program.desc ?? undefined,
    openGraph: {
      title,
      description: program.desc ?? undefined,
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
  const { id, title: _title } = await params;

  const [guidebook] = await Promise.all([fetchGuidebookData(id)]);

  // 올바른 경로 생성
  const correctPathname = getProgramPathname({
    id,
    programType: 'guidebook',
    title: guidebook.title,
  });

  // 슬러그 비교 및 리디렉션
  const correctSlug = (
    guidebook.title?.replace(/[ /]/g, '-') || ''
  ).toLowerCase();
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
      <GuidebookView guidebook={guidebook} id={id} />
      <GuidebookCTAButtons title={guidebook.title} />
    </>
  );
};

export default Page;
