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

  // CRITICAL(Vercel async-parallel): 라이브 메타/스케줄 응답과 본문 응답을 병렬 fetch.
  // 메타에 들어가는 필드(title/thumbnail) 는 generateMetadata 가 이미 단건 API 로 처리한다.
  // 본 RSC 단계에서는 LiveView/LiveCTAButtons 가 사용하는 전체 응답(live)과
  // 본문(content) 응답을 동시에 시작해 TTFB 를 줄인다.
  const [live, content] = await Promise.all([
    fetchLiveData(id),
    fetchLiveContent(id),
  ]);

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

  // /content 응답이 본문 desc 를 가지고 있으면 우선 사용 (단건 API 로 본문 전환 일환).
  // 기존 LiveView 는 props 의 `live.desc` 를 JSON.parse 하여 본문을 렌더하므로,
  // 본문 데이터만 새 응답으로 덮어써 LiveView 자체 변경을 최소화한다.
  const liveWithFreshContent =
    typeof content.desc === 'string' ? { ...live, desc: content.desc } : live;

  return (
    <>
      <LiveView live={liveWithFreshContent} />
      <LiveCTAButtons live={liveWithFreshContent} liveId={id} />
    </>
  );
};

export default Page;
