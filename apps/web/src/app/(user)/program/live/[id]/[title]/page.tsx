import {
  fetchLiveContent,
  fetchLiveData,
  fetchLiveThumbnail,
  fetchLiveTitle,
} from '@/api/program';
import LiveView from '@/domain/program/live-view/LiveView';
import LiveCTAButtons from '@/domain/program/live-view/ui/LiveCTAButtons';
import { isDeprecatedProgram } from '@/lib/isDeprecatedProgram';
import {
  getCanonicalSiteUrl,
  getLiveTitle,
  getProgramPathname,
} from '@/utils/url';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

// SSR 메타데이터 생성
//
// 기존: fetchLiveData() 한 번 호출로 라이브 전체 응답을 받아 title/shortDesc/thumbnail 사용
// 변경: 단건 API 3개 (/title, /thumbnail, /content) 를 Promise.all 로 병렬 fetch
//       → 메타 생성에 필요한 최소 페이로드만 받아 TTFB 개선
//       → 본문(content) 응답은 슬러그 redirect 검증용 title 외에는 메타에서 description 만 사용
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  // CRITICAL(Vercel async-parallel): 3개 단건 API 를 병렬 호출
  const [titleRes, thumbnailRes, contentRes] = await Promise.all([
    fetchLiveTitle(id),
    fetchLiveThumbnail(id),
    fetchLiveContent(id),
  ]);

  const programTitle = titleRes.title ?? '';
  const shortDesc = contentRes.shortDesc ?? null;
  const thumbnail =
    thumbnailRes.thumbnail ?? thumbnailRes.desktopThumbnail ?? '';

  const url =
    getCanonicalSiteUrl() +
    getProgramPathname({ id, programType: 'live', title: programTitle });
  const title = getLiveTitle({ title: programTitle });

  return {
    title,
    description: shortDesc,
    openGraph: {
      title,
      description: shortDesc || undefined,
      url,
      images: [
        {
          url: thumbnail,
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

  const [live] = await Promise.all([fetchLiveData(id)]);

  const isDeprecated = isDeprecatedProgram(live);

  if (isDeprecated) {
    redirect(`/program/old/live/${id}`);
  }

  // 올바른 경로 생성
  const correctPathname = getProgramPathname({
    id,
    programType: 'live',
    title: live.title,
  });

  // 슬러그 비교 및 리디렉션
  const correctSlug = (live.title?.replace(/[ /]/g, '-') || '').toLowerCase();
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
      <LiveView live={live} />
      <LiveCTAButtons live={live} liveId={id} />
    </>
  );
};

export default Page;
