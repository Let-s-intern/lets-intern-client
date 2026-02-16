import { fetchGuidebookData } from '@/api/guidebook/guidebook';
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
    description: program.description ?? undefined,
    openGraph: {
      title,
      description: program.description ?? undefined,
      url,
      images: [
        {
          url: program.thumbnailDesktop ?? program.thumbnailMobile ?? '',
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

  return <GuidebookView guidebook={guidebook} id={id} />;
};

export default Page;
