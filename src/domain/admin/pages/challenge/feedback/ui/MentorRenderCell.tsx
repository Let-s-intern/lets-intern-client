'use client';

import { useAdminChallengeMentorListQuery } from '@/api/mentor/mentor';
import { useIsAdminQuery } from '@/api/user/user';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useParams } from 'next/navigation';
import type { AttendanceRow } from '../types';
import { getMentorColor } from '../../mentor-colors';

/** 제출현황에서 담당 멘토를 읽기 전용으로 표시합니다. */
const MentorRenderCell = (
  params: GridRenderCellParams<AttendanceRow, number>,
) => {
  const { programId } = useParams<{ programId: string }>();
  const { data: isAdmin } = useIsAdminQuery();
  const { data } = useAdminChallengeMentorListQuery(
    isAdmin === true ? programId : undefined,
  );

  // 멘토(비어드민)는 admin API를 호출하지 않고 row 데이터의 mentorName을 표시
  if (isAdmin !== true) {
    const name = params.row.mentorName;
    if (!name) {
      return <span className="text-xxsmall12 text-neutral-40">미배정</span>;
    }
    return (
      <span className="inline-flex items-center rounded-full bg-neutral-90 px-2 py-0.5 text-xxsmall12 font-medium text-neutral-40">
        {name}
      </span>
    );
  }

  const mentorList = data?.mentorList ?? [];
  const challengeMentorId = params.value;

  const idx = mentorList.findIndex(
    (m) => m.challengeMentorId === challengeMentorId,
  );
  const mentor = idx >= 0 ? mentorList[idx] : null;
  const color = idx >= 0 ? getMentorColor(idx) : null;

  if (!mentor) {
    return (
      <span className="text-xxsmall12 text-neutral-40">미배정</span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xxsmall12 font-medium ${color?.bg ?? 'bg-neutral-90'} ${color?.text ?? 'text-neutral-40'}`}
    >
      {mentor.name}
    </span>
  );
};

export default MentorRenderCell;
