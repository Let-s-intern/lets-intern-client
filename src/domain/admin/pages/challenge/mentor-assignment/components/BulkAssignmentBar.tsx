'use client';

import type { MentorItem } from '../types';
import { getMentorLabel } from '../utils';

interface BulkAssignmentBarProps {
  mentors: MentorItem[];
  bulkMentorId: number | '';
  onBulkMentorChange: (value: number | '') => void;
  selectedCount: number;
  unassignedCount: number;
  isPending: boolean;
  onAssign: () => void;
  onSelectUnassigned: () => void;
}

export default function BulkAssignmentBar({
  mentors,
  bulkMentorId,
  onBulkMentorChange,
  selectedCount,
  unassignedCount,
  isPending,
  onAssign,
  onSelectUnassigned,
}: BulkAssignmentBarProps) {
  return (
    <div className="mb-4 flex flex-col gap-2">
      <h3 className="text-medium18 font-semibold">멘토 배정 현황</h3>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onSelectUnassigned}
          disabled={unassignedCount === 0}
          className="rounded border border-neutral-80 px-4 py-1.5 text-xsmall14 hover:bg-neutral-95 disabled:opacity-50"
        >
          미배정 멘티 일괄 선택 ({unassignedCount}명)
        </button>
        <div className="flex items-center gap-2">
          <select
            disabled={selectedCount === 0}
            className={`rounded border px-2 py-1.5 text-xsmall14 outline-none ${
              selectedCount > 0
                ? 'border-neutral-0 text-neutral-0'
                : 'border-neutral-80 text-neutral-40 opacity-50'
            }`}
            value={bulkMentorId}
            onChange={(e) => {
              const v = e.target.value;
              onBulkMentorChange(v === '' ? '' : Number(v));
            }}
          >
            <option value="">멘토 선택</option>
            {mentors.map((m) => (
              <option key={m.challengeMentorId} value={m.challengeMentorId}>
                {getMentorLabel(m)}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="rounded border border-neutral-80 px-4 py-1.5 text-xsmall14 hover:bg-neutral-95 disabled:opacity-50"
            disabled={bulkMentorId === '' || selectedCount === 0 || isPending}
            onClick={onAssign}
          >
            일괄 지정 ({selectedCount}명)
          </button>
        </div>
      </div>
    </div>
  );
}
