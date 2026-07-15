import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import LiveFeedbackEntryPage from '@/domain/live-feedback/LiveFeedbackEntryPage';
import { parseRoleParam } from '@/domain/live-feedback/hooks/liveRole';

// 알림톡으로만 진입하는 1:1 입장 페이지 — 검색 색인 차단.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ role: string; feedbackId: string }>;
}

export default async function Page({ params }: Props) {
  const { role, feedbackId } = await params;
  const parsedRole = parseRoleParam(role);
  const parsedId = Number(feedbackId);

  // 역할이 mentor/mentee 가 아니거나 id 가 유효하지 않으면 존재하지 않는 페이지.
  if (!parsedRole || !Number.isInteger(parsedId) || parsedId <= 0) {
    notFound();
  }

  return <LiveFeedbackEntryPage feedbackId={parsedId} role={parsedRole} />;
}
