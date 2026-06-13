import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import LiveFeedbackEntryPage from '@/domain/live-feedback/LiveFeedbackEntryPage';

// 알림톡으로만 진입하는 1:1 입장 페이지 — 검색 색인 차단.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ feedbackId: string }>;
}

export default async function Page({ params }: Props) {
  const { feedbackId } = await params;
  const parsed = Number(feedbackId);

  // 숫자가 아니거나 유효하지 않은 id 는 존재하지 않는 페이지로 처리.
  if (!Number.isInteger(parsed) || parsed <= 0) {
    notFound();
  }

  return <LiveFeedbackEntryPage feedbackId={parsed} />;
}
