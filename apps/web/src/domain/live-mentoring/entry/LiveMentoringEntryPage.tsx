'use client';

import { useRef, useState } from 'react';

import { useAuthStore } from '@letscareer/store';

import {
  useLiveMentoringEntryQuery,
  useUpdateLiveMentoringEntryAttendanceMutation,
} from '@/api/live-mentoring/liveMentoring';

import type { LiveMentoringRoleParam } from './hooks/liveMentoringRole';
import { useLiveMentoringEntry } from './hooks/useLiveMentoringEntry';
import AddToCalendarButton from './ui/AddToCalendarButton';
import EnterLiveButton from './ui/EnterLiveButton';
import LiveMentoringReviewModal from './ui/LiveMentoringReviewModal';
import LiveMentoringSessionModal from './ui/LiveMentoringSessionModal';
import LoginGate from './ui/LoginGate';
import MentoringSummaryCard from './ui/MentoringSummaryCard';
import { isOpenableUrl } from './utils/url';

interface Props {
  applicationId: number;
  /** 알림톡 링크 경로에서 받은 역할 — 로그인 전 문구·리다이렉트 표시용. */
  role: LiveMentoringRoleParam;
}

/**
 * 1대1 세션 입장 진입 컨테이너.
 *
 * 흐름: 스토어 초기화 대기 → 비로그인(LoginGate) → 로그인(일정 요약 + 카운트다운
 * 입장 버튼). 입장 성공 시 인라인 Jitsi 를 같은 화면에 렌더한다.
 *
 * 라이브 피드백의 `LiveFeedbackEntryPage` 와 흐름이 같지만 합치지 않는다. 식별자와
 * 권한 판정이 다르다 — 피드백 id 대 신청 id, 피드백 멘토·멘티 대 신청 멘토·멘티다.
 * 대신 화면 모양은 같은 디자인 토큰으로 맞춘다.
 */
export default function LiveMentoringEntryPage({ applicationId, role }: Props) {
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const { data: entry, isLoading } = useLiveMentoringEntryQuery(
    isLoggedIn ? applicationId : null,
  );

  const {
    isOpen,
    isPreparing,
    enter,
    closeJitsi,
    baseCandidates,
    registerBaseUrl,
  } = useLiveMentoringEntry({ applicationId, entry: entry ?? null });

  // 멘티 출석은 멘토가 모달에서 기록(닫힘/종료 시 일괄 전송).
  const updateAttendance =
    useUpdateLiveMentoringEntryAttendanceMutation(applicationId);

  // 종료 직후 정리 모달 — 멘티만, 실제로 참가했던 세션만.
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const hasJoinedRef = useRef(false);

  /**
   * Jitsi 닫기 — hangup 과 우상단 닫기 버튼이 모두 여기로 온다.
   * 멘토에게는 정리 모달을 띄우지 않는다(작성 권한이 멘티 본인에게만 있다).
   * 재입장 시에도 매번 재평가한다 — 추가 dedup 없이 `!alreadyReviewed`만 본다.
   */
  const handleCloseJitsi = () => {
    closeJitsi();

    const alreadyReviewed = entry?.reviewId != null;
    if (
      entry?.myRole === 'MENTEE' &&
      hasJoinedRef.current &&
      !alreadyReviewed
    ) {
      setIsReviewOpen(true);
    }
    hasJoinedRef.current = false;
  };

  // 스토어 초기화 전에는 깜빡임을 막기 위해 아무것도 렌더하지 않는다.
  if (!isInitialized) return null;

  if (!isLoggedIn) {
    return (
      <main className="flex min-h-[80vh] w-full items-center justify-center px-5 py-10">
        <div className="w-full max-w-[400px]">
          <LoginGate applicationId={applicationId} role={role} />
        </div>
      </main>
    );
  }

  // 화면 분기는 서버가 판정한 entry.myRole 을 쓴다. URL 의 role 세그먼트는
  // 로그인 전 문구에만 쓰고 여기서는 참조하지 않는다.
  const myRole = entry?.myRole ?? null;
  const counterpartLabel = myRole === 'MENTOR' ? '멘티' : '멘토';
  const counterpartName =
    (myRole === 'MENTOR' ? entry?.menteeName : entry?.mentorName) ?? undefined;

  const calendarTitle = [
    '[렛츠커리어]',
    counterpartName ? `${counterpartName} ${counterpartLabel}` : null,
    '1대1 라이브 멘토링',
    entry?.productName ? `· ${entry.productName}` : null,
  ]
    .filter(Boolean)
    .join(' ');

  // 첨부는 URL 유형이고 http(s) 로 열 수 있을 때만 자료 패널에 실어 보낸다.
  // href 로 그대로 나가는 값이라 스킴을 거르지 않으면 javascript: 를 실행시킬 수 있다.
  const submissionUrl =
    entry?.attachmentType === 'URL' &&
    entry.attachmentUrl &&
    isOpenableUrl(entry.attachmentUrl)
      ? entry.attachmentUrl
      : undefined;
  const preQuestion =
    entry && !entry.questionDeferred && entry.questionContent
      ? entry.questionContent
      : undefined;

  return (
    <main className="flex min-h-[80vh] w-full items-center justify-center px-5 py-10">
      <div className="flex w-full max-w-[420px] flex-col gap-5">
        <MentoringSummaryCard
          productName={entry?.productName}
          durationMinutes={entry?.durationMinutes}
          counterpartLabel={counterpartLabel}
          counterpartName={counterpartName}
          startDate={entry?.reservationStartAt}
          endDate={entry?.reservationEndAt}
          role={role}
          isLoading={isLoading}
        />

        <EnterLiveButton
          startDate={entry?.reservationStartAt}
          endDate={entry?.reservationEndAt}
          disabled={!entry}
          isPreparing={isPreparing}
          onEnter={enter}
        />

        <AddToCalendarButton
          title={calendarTitle}
          startDate={entry?.reservationStartAt}
          endDate={entry?.reservationEndAt}
        />
      </div>

      <LiveMentoringSessionModal
        isOpen={isOpen}
        onClose={handleCloseJitsi}
        onJoined={() => {
          hasJoinedRef.current = true;
        }}
        meetingUrl={entry?.meetingUrl ?? null}
        spaceName={`live-mentoring-${applicationId}`}
        myRole={myRole ?? 'MENTEE'}
        menteeName={entry?.menteeName ?? '멘티'}
        preQuestion={preQuestion}
        submissionUrl={submissionUrl}
        startDate={entry?.reservationStartAt}
        endDate={entry?.reservationEndAt}
        menteeStatus={entry?.menteeStatus ?? undefined}
        onSaveAttendance={(menteeStatus) =>
          updateAttendance.mutate({ menteeStatus })
        }
        baseCandidates={baseCandidates}
        registerBaseUrl={registerBaseUrl}
        onExhausted={() =>
          window.alert(
            '회의실 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
          )
        }
      />

      {/* 정리 모달은 Jitsi 모달의 형제로 둔다 — BaseModal 은 isOpen=false 에서 언마운트되므로
          안에 중첩하면 부모가 닫히는 순간 함께 사라진다. */}
      <LiveMentoringReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        applicationId={applicationId}
        productName={entry?.productName ?? undefined}
        mentorName={entry?.mentorName ?? undefined}
      />
    </main>
  );
}
