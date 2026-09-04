import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import LiveMentoringEntryPage from '@/domain/live-mentoring/entry/LiveMentoringEntryPage';
import { parseLiveMentoringRoleParam } from '@/domain/live-mentoring/entry/hooks/liveMentoringRole';

/*
  알림톡으로만 진입하는 1대1 세션 입장 페이지 — 검색 색인 차단.

  `session/` 을 한 칸 끼워 둔 이유가 있다. 이 폴더를 `live-mentoring/[role]` 로
  되돌리면 web 앱이 통째로 부팅되지 않는다(LC-3242).

  `app/(user)/live-mentoring/[mentorId]` 가 공개 멘토 상세인데, `(user)` 는 라우트
  그룹이라 URL 세그먼트를 만들지 않는다. 그래서 두 폴더가 모두 `/live-mentoring/[슬러그]`
  라는 같은 자리를 차지하고, 슬러그 이름이 달라 Next 가 라우트 매니페스트를 만들지 못한다.

      Error: You cannot use different slug names for the same dynamic path
             ('mentorId' !== 'role').

  이름만 맞추는 방법도 있지만 그러면 `/live-mentoring/mentee` 가 "mentorId 가 mentee 인
  상세" 와 같은 자리를 다투게 된다. 한 슬러그가 두 의미를 갖는 셈이라 택하지 않았다.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ role: string; applicationId: string }>;
}

export default async function Page({ params }: Props) {
  const { role, applicationId } = await params;
  const parsedRole = parseLiveMentoringRoleParam(role);
  const parsedId = Number(applicationId);

  // 역할이 mentor/mentee 가 아니거나 id 가 유효하지 않으면 존재하지 않는 페이지.
  if (!parsedRole || !Number.isInteger(parsedId) || parsedId <= 0) {
    notFound();
  }

  return <LiveMentoringEntryPage applicationId={parsedId} role={parsedRole} />;
}
