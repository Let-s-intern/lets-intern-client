import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import LiveMentoringEntryPage from '@/domain/live-mentoring/entry/LiveMentoringEntryPage';
import { parseLiveMentoringRoleParam } from '@/domain/live-mentoring/entry/hooks/liveMentoringRole';

// 알림톡으로만 진입하는 1대1 세션 입장 페이지 — 검색 색인 차단.
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
