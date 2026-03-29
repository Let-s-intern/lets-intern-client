'use client';

import { useGetChallengeAttendances } from '@/api/challenge/challenge';
import { useIsAdminQuery } from '@/api/user/user';
import { useParams } from 'next/navigation';

function SubmissionCountCell({ missionId }: { missionId: number | string }) {
  const { programId } = useParams<{ programId: string }>();
  const { data: isAdmin } = useIsAdminQuery();

  const { data: adminAttendances } = useGetChallengeAttendances({
    challengeId: isAdmin === true ? Number(programId) : undefined,
    detailedMissionId: isAdmin === true ? Number(missionId) : undefined,
  });

  if (isAdmin) {
    const list = adminAttendances ?? [];
    const total = list.length;
    // 멘티제출: link가 있는 항목
    const submitted = list.filter((a) => !!a.attendance.link).length;
    // 진행전: 제출확인 완료(status !== ABSENT) + 피드백 아직 진행 전
    const waiting = list.filter((a) => {
      const s = a.attendance.status;
      const fs = a.attendance.feedbackStatus;
      return s !== 'ABSENT' && s != null && fs === 'WAITING';
    }).length;
    // 확인완료: 미션 완전히 완료
    const confirmed = list.filter(
      (a) => a.attendance.feedbackStatus === 'CONFIRMED',
    ).length;
    return (
      <span>
        {submitted} / {waiting} / {confirmed} / {total}
      </span>
    );
  }

  return <span className="text-neutral-40">-</span>;
}

export default SubmissionCountCell;
