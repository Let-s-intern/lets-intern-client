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

const ACTIVE =
  'rounded border border-neutral-0 bg-neutral-0 px-4 py-1.5 text-xsmall14 font-medium text-white hover:opacity-90';
const DISABLED =
  'rounded border border-neutral-80 bg-neutral-95 px-4 py-1.5 text-xsmall14 font-medium text-neutral-40 cursor-not-allowed';

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
  const isUnassignedActive = unassignedCount > 0;
  const isSelectActive = selectedCount > 0;
  const isAssignActive =
    bulkMentorId !== '' && selectedCount > 0 && !isPending;

  return (
    <div className="mb-4 flex flex-col gap-2">
      <h3 className="text-medium18 font-semibold">멘토 배정 현황</h3>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onSelectUnassigned}
          disabled={!isUnassignedActive}
          className={isUnassignedActive ? ACTIVE : DISABLED}
        >
          미배정 멘티 일괄 선택 ({unassignedCount}명)
        </button>
        <div className="flex items-center gap-2">
          <select
            disabled={!isSelectActive}
            className={`outline-none ${
              isSelectActive
                ? 'rounded border border-neutral-0 bg-white px-4 py-1.5 text-xsmall14 font-medium text-neutral-0'
                : DISABLED
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
            disabled={!isAssignActive}
            className={isAssignActive ? ACTIVE : DISABLED}
            onClick={onAssign}
          >
            일괄 지정 ({selectedCount}명)
          </button>
        </div>
      </div>
    </div>
  );
}
