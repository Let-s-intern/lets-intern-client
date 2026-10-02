import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import LiveMentoringEntryPage from '@/domain/live-mentoring/entry/LiveMentoringEntryPage';
import { parseLiveMentoringRoleParam } from '@/domain/live-mentoring/entry/hooks/liveMentoringRole';

/*
  알림톡으로만 진입하는 1대1 세션 입장 페이지 — 검색 색인 차단.

  경로는 `/live-mentoring/{mentor|mentee}/{applicationId}` 다. 카카오 알림톡 템플릿의
  버튼 링크가 이 모양으로 등록돼 있어, 경로를 바꾸면 템플릿을 재심사받아야 한다.

  폴더 이름이 `[role]` 이 아니라 `[mentorId]` 인 이유가 있다.
  `app/(user)/live-mentoring/[mentorId]` 가 공개 멘토 상세인데, `(user)` 는 라우트 그룹이라
  URL 세그먼트를 만들지 않는다. 그래서 두 폴더가 `/live-mentoring/[슬러그]` 라는 같은 자리를
  차지하고, 슬러그 이름이 다르면 Next 가 라우트 매니페스트를 만들지 못한다(LC-3242).

      Error: You cannot use different slug names for the same dynamic path
             ('mentorId' !== 'role').

  그래서 이름만 맞추고 여기서는 그 값을 역할로 읽는다. 깊이가 달라 실제 주소는 겹치지 않는다 —
  `/live-mentoring/123` 은 멘토 상세, `/live-mentoring/mentor/123` 은 이 페이지다.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface Props {
  /** `mentorId` 자리에는 역할(mentor | mentee)이 온다. 이름은 위 주석 참고. */
  params: Promise<{ mentorId: string; applicationId: string }>;
}

export default async function Page({ params }: Props) {
  const { mentorId: role, applicationId } = await params;
  const parsedRole = parseLiveMentoringRoleParam(role);
  const parsedId = Number(applicationId);

  // 역할이 mentor/mentee 가 아니거나 id 가 유효하지 않으면 존재하지 않는 페이지.
  if (!parsedRole || !Number.isInteger(parsedId) || parsedId <= 0) {
    notFound();
  }

  return <LiveMentoringEntryPage applicationId={parsedId} role={parsedRole} />;
}
