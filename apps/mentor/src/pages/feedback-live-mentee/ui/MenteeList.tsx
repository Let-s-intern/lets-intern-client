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
      (m) => m.name.includes(q) || m.challengeTitle.includes(q),
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
          placeholder="이름·챌린지 검색"
          aria-label="멘티 검색"
          className="border-neutral-80 text-neutral-10 mt-2 h-8 w-full rounded-md border bg-white px-3 text-xs placeholder:text-neutral-50"
        />
      </div>

      {/* 멘티 행 목록 */}
      <ul className="flex-1 overflow-y-auto">
        {mentees.length === 0 ? (
          <li className="text-neutral-40 px-4 py-8 text-center text-xs">
            멘티가 없습니다.
          </li>
        ) : filtered.length === 0 ? (
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
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(mentee.id)}
        className={`border-neutral-95 flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors ${
          isActive ? 'bg-primary-5' : 'hover:bg-neutral-95'
        }`}
        aria-pressed={isActive}
        aria-label={`${mentee.name} 멘티 선택`}
      >
        {/* 아바타 */}
        <div className="bg-neutral-90 text-neutral-30 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
          {mentee.avatarInitial}
        </div>

        <div className="min-w-0 flex-1">
          <span className="text-xsmall14 text-neutral-10 block truncate font-semibold">
            {mentee.name}
          </span>
          <p className="text-xxsmall12 mt-0.5 truncate text-neutral-50">
            {mentee.challengeTitle}
          </p>
          {mentee.sessionLabel && (
            <p className="text-xxsmall12 text-neutral-40 mt-0.5 truncate">
              {mentee.sessionLabel}
            </p>
          )}
        </div>
      </button>
    </li>
  );
}
