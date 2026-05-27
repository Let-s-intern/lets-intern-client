import { useMemo, useState } from 'react';

import { useMenteeRoster } from './hooks/useMenteeRoster';
import MenteeList from './ui/MenteeList';

// 채팅 진입은 예약 모달의 "멘티와 대화하기"·전역 플로팅 버튼(@letscareer/chat)으로 일원화됐다.
// 이 페이지는 멘티 로스터 조회 용도이며, 우측 패널은 "준비 중" 플레이스홀더만 노출한다.

const FeedbackLiveMenteePage = () => {
  const { mentees, isLoading, isError } = useMenteeRoster();
  const [activeMenteeId, setActiveMenteeId] = useState<string | null>(null);

  const activeMentee = useMemo(
    () => mentees.find((m) => m.id === activeMenteeId) ?? null,
    [mentees, activeMenteeId],
  );

  return (
    <div className="border-neutral-80 flex h-[calc(100vh-120px)] flex-col overflow-hidden rounded-xl border bg-white">
      <div className="flex flex-1 overflow-hidden">
        {/* 좌측: 멘티 리스트 */}
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
              mentees={mentees}
              activeMenteeId={activeMenteeId}
              onSelect={setActiveMenteeId}
            />
          )}
        </div>

        {/* 우측: 대화창 (채팅 BE 미구현 — 준비 중 플레이스홀더) */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {activeMentee ? (
            <>
              {/* 대화 헤더 */}
              <div className="border-neutral-80 border-b px-4 py-3">
                <p className="text-xsmall14 text-neutral-10 font-semibold">
                  {activeMentee.name}
                </p>
                <p className="text-xxsmall12 text-neutral-40">
                  {activeMentee.challengeTitle}
                </p>
              </div>

              {/* 채팅 플레이스홀더 */}
              <div className="text-neutral-40 flex flex-1 flex-col items-center justify-center gap-2">
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
                <p className="text-sm font-medium">채팅 기능은 준비 중입니다</p>
                <p className="text-xs">
                  멘티와의 채팅 기능은 곧 제공될 예정입니다.
                </p>
              </div>
            </>
          ) : (
            <div className="text-neutral-40 flex flex-1 flex-col items-center justify-center gap-2">
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
              <p className="text-sm font-medium">멘티를 선택하세요</p>
              <p className="text-xs">
                좌측 목록에서 멘티를 선택하면 정보를 확인할 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackLiveMenteePage;
