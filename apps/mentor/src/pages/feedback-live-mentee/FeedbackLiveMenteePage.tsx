import { useMemo, useState } from 'react';

import { MENTEE_CHAT_MOCK } from './mocks/menteeChatMock';
import type { Message } from './schema';
import ChatComposer from './ui/ChatComposer';
import ChatThread from './ui/ChatThread';
import MenteeList from './ui/MenteeList';

const FeedbackLiveMenteePage = () => {
  const [activeMenteeId, setActiveMenteeId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(
    MENTEE_CHAT_MOCK.messages,
  );

  const activeMentee = useMemo(
    () =>
      MENTEE_CHAT_MOCK.mentees.find((m) => m.id === activeMenteeId) ?? null,
    [activeMenteeId],
  );

  const threadMessages = useMemo(
    () => messages.filter((m) => m.menteeId === activeMenteeId),
    [messages, activeMenteeId],
  );

  const handleSend = (text: string) => {
    if (!activeMenteeId) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      menteeId: activeMenteeId,
      sender: 'mentor',
      text,
      sentAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col overflow-hidden rounded-xl border border-neutral-80 bg-white">
      <div className="flex flex-1 overflow-hidden">
        {/* 좌측: 멘티 리스트 */}
        <div className="w-72 shrink-0">
          <MenteeList
            mentees={MENTEE_CHAT_MOCK.mentees}
            activeMenteeId={activeMenteeId}
            onSelect={setActiveMenteeId}
          />
        </div>

        {/* 우측: 대화창 */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {activeMentee ? (
            <>
              {/* 대화 헤더 */}
              <div className="border-b border-neutral-80 px-4 py-3">
                <p className="text-xsmall14 font-semibold text-neutral-10">
                  {activeMentee.name}
                </p>
                <p className="text-xxsmall12 text-neutral-40">
                  {activeMentee.challengeTitle}
                </p>
              </div>

              {/* 메시지 스레드 */}
              <ChatThread
                messages={threadMessages}
                menteeName={activeMentee.name}
              />

              {/* 메시지 입력 */}
              <ChatComposer onSend={handleSend} />
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-neutral-40">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9.5L5.5 19.5a.6.6 0 0 1-1-.42V5Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-sm font-medium">대화할 멘티를 선택하세요</p>
              <p className="text-xs">
                좌측 목록에서 멘티를 선택하면 대화를 시작할 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackLiveMenteePage;
