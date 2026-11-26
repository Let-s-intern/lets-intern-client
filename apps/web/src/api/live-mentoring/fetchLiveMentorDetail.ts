import { liveMentorDetailSchema } from './liveMentoringSchema';
import type { LiveMentorDetail } from './liveMentoringSchema';

/**
 * GET /live-mentoring/mentors/{mentorId} 를 서버에서 부른다. 없는 멘토는 `null`.
 *
 * 메타데이터와 페이지가 같은 주소를 부르지만 Next 가 같은 요청 안의 동일 GET 을 합쳐
 * 주므로 한 번만 나간다. 공개 상세라 인증이 필요 없다.
 * 5분 캐시 — 가격·마감 변화가 검색 결과에 늦게 반영되는 정도는 감수한다.
 */
export const fetchLiveMentorDetail = async (
  mentorId: string,
): Promise<LiveMentorDetail | null> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API}/live-mentoring/mentors/${encodeURIComponent(mentorId)}`,
    { next: { revalidate: 300 } },
  );

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Failed to fetch live mentor detail: ${res.status}`);
  }

  const body = await res.json();
  return liveMentorDetailSchema.parse(body.data);
};
