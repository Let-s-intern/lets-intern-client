'use client';

import { useAuthStore } from '@letscareer/store';

import { useLiveFeedbackEntryQuery } from '@/api/feedback/feedback';

import { resolveMyRole } from './hooks/resolveMyRole';
import { useLiveEntry } from './hooks/useLiveEntry';
import EnterLiveButton from './ui/EnterLiveButton';
import InlineJitsi from './ui/InlineJitsi';
import LoginGate from './ui/LoginGate';
import ScheduleSummaryCard from './ui/ScheduleSummaryCard';

interface Props {
  feedbackId: number;
}

/**
 * 라이브 피드백 입장 진입 컨테이너.
 *
 * 흐름: 스토어 초기화 대기 → 비로그인(LoginGate) → 로그인(일정 요약 + 카운트다운 입장 버튼).
 * 입장 성공 시 인라인 Jitsi 를 같은 화면에 렌더한다.
 */
export default function LiveFeedbackEntryPage({ feedbackId }: Props) {
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const { data, isLoading } = useLiveFeedbackEntryQuery(
    isLoggedIn ? feedbackId : null,
  );
  const feedbackInfo = data?.feedbackInfo ?? null;

  // BE 역할판별 어댑터 — 확정 전엔 null 스텁(§0.1).
  const role = resolveMyRole(feedbackInfo);

  const { isOpen, isPreparing, enter, closeJitsi } = useLiveEntry({
    feedbackId,
    feedbackInfo,
    role,
  });

  // 스토어 초기화 전에는 깜빡임을 막기 위해 아무것도 렌더하지 않는다.
  if (!isInitialized) return null;

  if (!isLoggedIn) {
    return (
      <main className="mx-auto flex w-full max-w-[480px] flex-col gap-6 px-5 py-10">
        <LoginGate feedbackId={feedbackId} />
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-[480px] flex-col gap-6 px-5 py-10">
      <ScheduleSummaryCard
        counterpartLabel={role === 'MENTOR' ? '멘티' : '멘토'}
        startDate={feedbackInfo?.startDate}
        endDate={feedbackInfo?.endDate}
        role={role}
        isLoading={isLoading}
      />

      <EnterLiveButton
        startDate={feedbackInfo?.startDate}
        endDate={feedbackInfo?.endDate}
        disabled={!feedbackInfo}
        isPreparing={isPreparing}
        onEnter={enter}
      />

      {isOpen && (
        <InlineJitsi
          meetingUrl={feedbackInfo?.meetingUrl ?? null}
          spaceName={`live-feedback-${feedbackId}`}
          onClose={closeJitsi}
        />
      )}
    </main>
  );
}
