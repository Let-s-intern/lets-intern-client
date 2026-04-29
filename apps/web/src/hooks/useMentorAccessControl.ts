import { useIsAdminQuery, useMentorChallengeListQuery } from '@/api/user/user';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function useMentorAccessControl() {
  const { programId } = useParams<{ programId: string }>();
  const router = useRouter();

  const { data, isLoading: isChallengeLoading } = useMentorChallengeListQuery();
  const { data: isAdmin } = useIsAdminQuery();

  const isLoading = isChallengeLoading || !programId;
  const mentorChallengeIds = data?.myChallengeMentorVoList.map(
    (item) => item.challengeId,
  );
  const isValidMentor =
    isAdmin || mentorChallengeIds?.includes(Number(programId));

  useEffect(() => {
    if (isLoading || isValidMentor) return;
    router.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isValidMentor]);

  return isLoading;
}
