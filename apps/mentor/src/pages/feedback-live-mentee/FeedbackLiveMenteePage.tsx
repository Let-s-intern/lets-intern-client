import { useEffect, useMemo, useRef, useState } from 'react';

import { useChatMessages } from '@letscareer/chat/hooks/useChatMessages';
import { useChatRoom } from '@letscareer/chat/hooks/useChatRoom';
import { chatRoomKey } from '@letscareer/chat/roomKey';
import ChatComposer from '@letscareer/chat/ui/ChatComposer';
import ChatThread from '@letscareer/chat/ui/ChatThread';

import { useFeedbackMentorListQuery } from '@/api/feedback/feedback';
import type { FeedbackMentor } from '@/api/feedback/feedbackSchema';

import MenteeList from './ui/MenteeList';
import type { Mentee } from './schema';

/**
 * 멘티 관리 = 라이브 피드백 멘티별 채팅.
 *
 * 방 단위는 `feedbackId`(세션)다. `GET /feedback/mentor` 응답에서 feedbackId를
 * 그대로 사용해 멘티↔멘토 공유 방(`feedback_{id}`)에 접속한다. 좌측 목록 선택 →
 * 우측 패널에 `@letscareer/chat` 패키지 채팅을 임베드한다.
 */
const FeedbackLiveMenteePage = () => {
  const { data: feedbacks, isLoading, isError } = useFeedbackMentorListQuery();
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null);

  // feedbackId 단위 행 (멘티명 + 챌린지명, 같은 멘티 다른 세션이면 별도 행).
  const rows: Mentee[] = useMemo(() => {
    const list = feedbacks ?? [];
    return list
      .map((fb) => ({
        id: String(fb.feedbackId),
        name: fb.menteeName,
        avatarInitial: fb.menteeName.slice(0, 1),
        challengeTitle: fb.programTitle,
        sessionLabel: formatSession(fb.startDate),
      }))
      .sort((a, b) => {
        const byChallenge = a.challengeTitle.localeCompare(
          b.challengeTitle,
          'ko',
        );
        return byChallenge !== 0
          ? byChallenge
          : a.name.localeCompare(b.name, 'ko');
      });
  }, [feedbacks]);

  const activeFeedback = useMemo(
    () =>
      (feedbacks ?? []).find(
        (fb) => String(fb.feedbackId) === activeFeedbackId,
      ) ?? null,
    [feedbacks, activeFeedbackId],
  );

  return (
    <div className="border-neutral-80 flex h-[calc(100vh-120px)] flex-col overflow-hidden rounded-xl border bg-white">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* 좌측: 멘티(세션) 목록 */}
        <div className="w-72 shrink-0">
          {isLoading ? (
            <div className="border-neutral-80 text-neutral-40 flex h-full items-center justify-center border-r text-xs">
              불러오는 중...
            </div>
          ) : isError ? (
            <div className="border-neutral-80 text-neutral-40 flex h-full items-center justify-center border-r px-4 text-center text-xs">
              멘티 목록을 불러오지 못했습니다.
            </div>
          ) : (
            <MenteeList
              mentees={rows}
              activeMenteeId={activeFeedbackId}
              onSelect={setActiveFeedbackId}
            />
          )}
        </div>

        {/* 우측: 채팅 */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {activeFeedback ? (
            <>
              <div className="border-neutral-80 border-b px-4 py-3">
                <p className="text-xsmall14 text-neutral-10 font-semibold">
                  {activeFeedback.menteeName}
                </p>
                <p className="text-xxsmall12 text-neutral-40">
                  {[
                    activeFeedback.programTitle,
                    formatSession(activeFeedback.startDate),
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
              <MentorChatPanel feedback={activeFeedback} />
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 라이브 피드백 세션 일시 라벨.
 * BE에 미션/회차 필드가 없어 같은 챌린지의 여러 세션을 일시로 구분한다.
 */
function formatSession(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** 선택된 멘티(feedbackId) 세션의 임베드 채팅 패널. */
function MentorChatPanel({ feedback }: { feedback: FeedbackMentor }) {
  const room = chatRoomKey(feedback.feedbackId);
  const { messages } = useChatMessages({ room });
  const { sendMessage, markRead } = useChatRoom({
    feedbackId: feedback.feedbackId,
    role: 'mentor',
    meta: {
      menteeName: feedback.menteeName,
      challengeTitle: feedback.programTitle,
    },
  });

  // 진입·신규 메시지 수신 시 읽음 처리.
  const markReadRef = useRef(markRead);
  markReadRef.current = markRead;
  useEffect(() => {
    void markReadRef.current();
  }, [feedback.feedbackId, messages.length]);

  return (
    <>
      <ChatThread
        messages={messages}
        myRole="mentor"
        counterpartName={feedback.menteeName}
      />
      <ChatComposer onSend={(text) => void sendMessage(text)} />
    </>
  );
}

function EmptyState() {
  return (
    <div className="text-neutral-40 flex flex-1 flex-col items-center justify-center gap-2">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9.5L5.5 19.5a.6.6 0 0 1-1-.42V5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      <p className="text-sm font-medium">멘티를 선택하세요</p>
      <p className="text-xs">좌측 목록에서 멘티를 선택하면 채팅이 열립니다.</p>
    </div>
  );
}

export default FeedbackLiveMenteePage;
