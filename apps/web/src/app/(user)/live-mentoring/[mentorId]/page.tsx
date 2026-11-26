import { fetchLiveMentorDetail } from '@/api/live-mentoring/fetchLiveMentorDetail';
import LiveMentoringDetailPage from '@/domain/live-mentoring/detail/LiveMentoringDetailPage';
import {
  buildMentoringDescription,
  buildMentoringTitle,
} from '@/domain/live-mentoring/detail/seo';
import { getCanonicalUrl } from '@/utils/url';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PageProps = { params: Promise<{ mentorId: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { mentorId } = await params;
  const mentor = await fetchLiveMentorDetail(mentorId);
  if (!mentor) return {};

  // 쿼리스트링(UTM 등)과 끝 슬래시가 없는 한 주소로 모은다
  const url = getCanonicalUrl(`/live-mentoring/${mentorId}`);
  const title = buildMentoringTitle(mentor);
  const description = buildMentoringDescription(mentor);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: '렛츠커리어',
      locale: 'ko_KR',
      title,
      description,
      url,
      images: mentor.thumbnail ? [{ url: mentor.thumbnail }] : undefined,
    },
  };
}

const Page = async ({ params }: PageProps) => {
  const { mentorId } = await params;
  const mentor = await fetchLiveMentorDetail(mentorId);
  // 없는 멘토는 로딩 화면이 아니라 404 로 답한다
  if (!mentor) notFound();

  return <LiveMentoringDetailPage mentorId={mentorId} initialData={mentor} />;
};

export default Page;
