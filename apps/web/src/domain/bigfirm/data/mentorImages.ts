import { MENTORS } from './mentors';

// 멘토 상세 API 의 profile.profileImage. 서버에서 받아 한 시간 동안 다시 쓴다
const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
const REVALIDATE_SECONDS = 60 * 60;

export type MentorImages = Record<number, string | null>;

// 비어 있거나 요청이 실패하면 null → 직무 배지로 대체
export async function getMentorImages(): Promise<MentorImages> {
  const entries = await Promise.all(
    MENTORS.map(async (mentor) => {
      try {
        const res = await fetch(
          `${SERVER_API}/live-mentoring/mentors/${mentor.id}`,
          { next: { revalidate: REVALIDATE_SECONDS } },
        );
        if (!res.ok) return [mentor.id, null] as const;
        const json = await res.json();
        const image: unknown = json?.data?.profile?.profileImage;
        return [
          mentor.id,
          typeof image === 'string' && image ? image : null,
        ] as const;
      } catch {
        return [mentor.id, null] as const;
      }
    }),
  );

  return Object.fromEntries(entries);
}
