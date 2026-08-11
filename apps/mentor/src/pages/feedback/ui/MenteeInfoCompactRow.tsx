'use client';

import type { ReactNode } from 'react';

interface MenteeInfoCompactRowProps {
  name: string;
  wishJob?: string | null;
  wishCompany?: string | null;
  /** 상태 배지 — 서면은 피드백 상태, 라이브는 세션 상태. */
  badge?: { label: string; badgeClass: string } | null;
  /** 배지 옆 보조 문구(예: "임시저장됨"). */
  badgeSuffix?: ReactNode;
  /** 우측 진입 버튼들(제출물·경험·사전 질문). */
  actions?: ReactNode;
}

/**
 * "크게 보기" 상태의 멘티 정보 한 줄 — 서면·라이브 공통.
 *
 * 확장 모드에서는 세로를 전부 에디터에 넘겨야 하므로 정보를 한 줄로 접는다.
 * 상세 정보는 우측 진입 버튼으로 여는 패널이 담당한다.
 */
const MenteeInfoCompactRow = ({
  name,
  wishJob,
  wishCompany,
  badge,
  badgeSuffix,
  actions,
}: MenteeInfoCompactRowProps) => (
  <div className="border-neutral-80 flex items-center gap-x-4 gap-y-1 rounded-[4px] border px-4 py-2.5">
    <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1">
      <span className="text-sm font-semibold text-neutral-900">{name}</span>
      {wishJob && (
        <span className="text-xs text-neutral-500">
          희망 직군:{' '}
          <span className="font-medium text-neutral-700">{wishJob}</span>
        </span>
      )}
      {wishCompany && (
        <span className="text-xs text-neutral-500">
          희망 기업:{' '}
          <span className="font-medium text-neutral-700">{wishCompany}</span>
        </span>
      )}
      {badge && (
        <span className="flex shrink-0 items-center gap-1.5">
          <span
            className={`rounded-[4px] px-2 py-0.5 text-xs font-medium ${badge.badgeClass}`}
          >
            {badge.label}
          </span>
          {badgeSuffix}
        </span>
      )}
    </div>
    {actions}
  </div>
);

export default MenteeInfoCompactRow;
