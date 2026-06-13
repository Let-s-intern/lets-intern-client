'use client';

import { useAuthStore } from '@letscareer/store';

import {
  useLiveFeedbackEntryQuery,
  usePatchMentorFeedbackStatus,
} from '@/api/feedback/feedback';

import type { LiveRole } from './hooks/liveRole';
import { useLiveEntry } from './hooks/useLiveEntry';
import EnterLiveButton from './ui/EnterLiveButton';
import LiveFeedbackModal from './ui/LiveFeedbackModal';
import LoginGate from './ui/LoginGate';
import ScheduleSummaryCard from './ui/ScheduleSummaryCard';

interface Props {
  feedbackId: number;
  /** 이 세션에서의 역할 — 알림톡 링크 경로(/live-feedback/[role]/...)에서 전달. */
  role: LiveRole;
}

/**
 * 라이브 피드백 입장 진입 컨테이너.
 *
 * 흐름: 스토어 초기화 대기 → 비로그인(LoginGate) → 로그인(일정 요약 + 카운트다운 입장 버튼).
 * 입장 성공 시 인라인 Jitsi 를 같은 화면에 렌더한다.
 * 역할은 알림톡 링크 경로에서 받는다(BE myRole 불필요).
 */
export default function LiveFeedbackEntryPage({ feedbackId, role }: Props) {
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const { data, isLoading } = useLiveFeedbackEntryQuery(
    isLoggedIn ? feedbackId : null,
  );
  const feedbackInfo = data?.feedbackInfo ?? null;

  const { isOpen, isPreparing, enter, closeJitsi } = useLiveEntry({
    feedbackId,
    feedbackInfo,
    role,
  });

  // 멘티 출석은 멘토가 모달에서 기록(닫힘/종료 시 일괄 전송).
  const patchStatus = usePatchMentorFeedbackStatus(feedbackId);

  // 스토어 초기화 전에는 깜빡임을 막기 위해 아무것도 렌더하지 않는다.
  if (!isInitialized) return null;

  if (!isLoggedIn) {
    return (
      <main className="flex min-h-[80vh] w-full items-center justify-center px-5 py-10">
        <div className="w-full max-w-[400px]">
          <LoginGate feedbackId={feedbackId} role={role} />
        </div>
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

      <LiveFeedbackModal
        isOpen={isOpen}
        onClose={closeJitsi}
        meetingUrl={feedbackInfo?.meetingUrl ?? null}
        spaceName={`live-feedback-${feedbackId}`}
        role={role}
        menteeName={feedbackInfo?.menteeName ?? '멘티'}
        preQuestion={feedbackInfo?.preQuestion ?? undefined}
        submissionUrl={feedbackInfo?.attendanceUrl ?? undefined}
        startDate={feedbackInfo?.startDate}
        endDate={feedbackInfo?.endDate}
        menteeStatus={feedbackInfo?.menteeStatus ?? undefined}
        onSaveAttendance={(menteeStatus) => patchStatus.mutate({ menteeStatus })}
      />
    </main>
  );
}
