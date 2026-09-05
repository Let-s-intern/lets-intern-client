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
import EntryUnavailableNotice from './ui/EntryUnavailableNotice';
import LoginGate from './ui/LoginGate';
import MentoringSummaryCard from './ui/MentoringSummaryCard';
import MenteeSubmissionModal from './ui/MenteeSubmissionModal';
import SubmissionButton from './ui/SubmissionButton';
import QuestionModal from '../question/QuestionModal';
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

  const {
    data: entry,
    isLoading,
    isError,
  } = useLiveMentoringEntryQuery(isLoggedIn ? applicationId : null);

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
  // 제출물(사전 질문·첨부) 모달. 멘토가 열면 읽기 전용이다.
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
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

  /*
    조회가 끝났는데 값이 없으면 더 그릴 것이 없다. 없는 신청과 남의 신청이 여기로
    함께 온다 — 서버가 둘 다 404 로 답하기 때문이고, 화면도 사유를 나누지 않는다.

    isError 만 보지 않는 이유는 스키마 파싱 실패도 같은 자리로 오기 때문이다. 어느
    쪽이든 화면이 그릴 수 있는 것은 없고, "일정 확인 중" 으로 멈춰 있는 것보다 낫다.
  */
  if (!isLoading && (isError || !entry)) {
    return (
      <main className="flex min-h-[80vh] w-full items-center justify-center px-5 py-10">
        <div className="w-full max-w-[400px]">
          <EntryUnavailableNotice />
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

  /*
    제출물이 있는지는 실제 내용으로 가른다. `questionDeferred` 는 "나중에 작성하기"로
    신청했다는 표시일 뿐이라, 그 뒤에 실제로 냈는지와 다르다.
  */
  const hasSubmission = Boolean(
    entry &&
    ((entry.questionContent && entry.questionContent.trim().length > 0) ||
      entry.attachmentType !== 'NONE'),
  );

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
          questionEditDeadline={entry?.questionEditDeadline}
          questionEditable={entry?.questionEditable}
          isMentorView={myRole === 'MENTOR'}
        />

        <SubmissionButton
          myRole={myRole}
          hasSubmission={hasSubmission}
          editable={entry?.questionEditable ?? false}
          isLoading={isLoading}
          onOpen={() => setIsSubmissionOpen(true)}
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
      {/*
        고칠 수 있을 때만 작성 모달을 연다. 그 밖에는 열람 뷰다.

        멘토는 마감과 무관하게 열람이고, 질문 조회 API 가 신청자 본인만 통과시켜
        작성 모달을 재사용하면 401 이 난다. 마감이 지난 멘티도 열람으로 보낸다 —
        작성 모달을 잠긴 채 띄우면 빈 입력칸만 남아 무엇을 냈는지 알 수 없다.

        열람 뷰는 입장 응답이 이미 들고 있는 값으로 그린다. 추가 호출이 없다.
      */}
      {isSubmissionOpen &&
        (myRole === 'MENTEE' && entry?.questionEditable ? (
          <QuestionModal
            applicationId={applicationId}
            onClose={() => setIsSubmissionOpen(false)}
          />
        ) : (
          <MenteeSubmissionModal
            isOwnSubmission={myRole === 'MENTEE'}
            menteeName={entry?.menteeName}
            questionContent={entry?.questionContent}
            attachmentType={entry?.attachmentType}
            attachmentUrl={entry?.attachmentUrl}
            onClose={() => setIsSubmissionOpen(false)}
          />
        ))}

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
