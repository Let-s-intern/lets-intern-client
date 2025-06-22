import { useIsAdminQuery, useMentorChallengeListQuery } from '@/api/user';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function useMentorAccessControl() {
  const { programId } = useParams();
  const navigate = useNavigate();

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
    navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isValidMentor]);

  return isLoading;
}
