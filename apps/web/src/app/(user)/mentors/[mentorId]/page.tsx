import { fetchLiveMentorDetail } from '@/api/live-mentoring/fetchLiveMentorDetail';
import MentorDetailPage from '@/domain/mentors/mentor-detail/MentorDetailPage';
import { getCanonicalUrl } from '@/utils/url';
import type { Metadata } from 'next';

type PageProps = { params: Promise<{ mentorId: string }> };

/**
 * 같은 멘토 ID 로 `/live-mentoring/{id}` 가 있으면 그쪽이 대표 주소다. 두 주소로
 * 검색 신호가 갈라지고 구글이 중복 페이지로 판정하기 때문이다. 라이브 멘토링이
 * 없는 멘토는 갈 곳이 없으니(404) 자기 주소를 대표로 둔다.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { mentorId } = await params;
  const hasLiveMentoring = (await fetchLiveMentorDetail(mentorId)) !== null;
  const path = hasLiveMentoring
    ? `/live-mentoring/${mentorId}`
    : `/mentors/${mentorId}`;

  return { alternates: { canonical: getCanonicalUrl(path) } };
}

const Page = async ({ params }: PageProps) => {
  const { mentorId } = await params;
  return <MentorDetailPage mentorId={mentorId} />;
};

export default Page;
