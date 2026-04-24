import { useGetChallengeAttendances } from '@/api/challenge/challenge';
import { useIsAdminQuery } from '@/api/user/user';
import { useParams } from 'react-router-dom';

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
    const submitted = list.filter((a) => !!a.attendance.link).length;
    return (
      <span>
        {submitted} / {total}
      </span>
    );
  }

  return <span className="text-neutral-40">-</span>;
}

export default SubmissionCountCell;
