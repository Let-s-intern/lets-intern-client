import { useMemo, useState } from 'react';

import type { Mentee } from '../schema';

interface MenteeListProps {
  mentees: Mentee[];
  activeMenteeId: string | null;
  onSelect: (menteeId: string) => void;
}

export default function MenteeList({
  mentees,
  activeMenteeId,
  onSelect,
}: MenteeListProps) {
  const [keyword, setKeyword] = useState('');

  const filtered = useMemo(() => {
    const q = keyword.trim();
    if (!q) return mentees;
    return mentees.filter(
      (m) =>
        m.name.includes(q) ||
        m.email.includes(q) ||
        m.challengeTitle.includes(q),
    );
  }, [mentees, keyword]);

  return (
    <div className="border-neutral-80 flex h-full flex-col border-r">
      {/* 헤더 */}
      <div className="border-neutral-80 border-b px-4 py-3">
        <h2 className="text-small16 text-neutral-10 font-semibold">
          멘티 목록
        </h2>
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="이름·이메일·챌린지 검색"
          aria-label="멘티 검색"
          className="border-neutral-80 text-neutral-10 mt-2 h-8 w-full rounded-md border bg-white px-3 text-xs placeholder:text-neutral-50"
        />
      </div>

      {/* 멘티 행 목록 */}
      <ul className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <li className="text-neutral-40 px-4 py-8 text-center text-xs">
            검색 결과 없음
          </li>
        ) : (
          filtered.map((mentee) => (
            <MenteeRow
              key={mentee.id}
              mentee={mentee}
              isActive={mentee.id === activeMenteeId}
              onSelect={onSelect}
            />
          ))
        )}
      </ul>
    </div>
  );
}

interface MenteeRowProps {
  mentee: Mentee;
  isActive: boolean;
  onSelect: (id: string) => void;
}

function MenteeRow({ mentee, isActive, onSelect }: MenteeRowProps) {
  const formattedTime = mentee.lastMessageAt
    ? formatRelativeTime(mentee.lastMessageAt)
    : '';

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(mentee.id)}
        className={`border-neutral-95 flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors ${
          isActive ? 'bg-primary-5' : 'hover:bg-neutral-95'
        }`}
        aria-pressed={isActive}
        aria-label={`${mentee.name} 멘티 대화 선택`}
      >
        {/* 아바타 */}
        <div className="bg-neutral-90 text-neutral-30 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
          {mentee.avatarInitial}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <span className="text-xsmall14 text-neutral-10 truncate font-semibold">
              {mentee.name}
            </span>
            <span className="text-xxsmall12 text-neutral-40 shrink-0">
              {formattedTime}
            </span>
          </div>
          <p className="text-xxsmall12 text-neutral-40 mt-0.5 truncate">
            {mentee.lastMessage}
          </p>
          <p className="text-xxsmall12 mt-0.5 truncate text-neutral-50">
            {mentee.challengeTitle}
          </p>
        </div>

        {mentee.unreadCount > 0 && (
          <span className="bg-primary mt-1 flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white">
            {mentee.unreadCount}
          </span>
        )}
      </button>
    </li>
  );
}

function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date('2025-05-03T12:00:00');
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}시간 전`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}일 전`;
}
