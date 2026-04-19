'use client';

import {
  ChallengeApplicationsQueryKey,
  ChallengeMissionFeedbackAttendanceQueryKey,
  MentorMissionFeedbackAttendanceQueryKey,
  useChallengeApplicationsQuery,
} from '@/api/challenge/challenge';
import { usePostAdminChallengeMentorMatch } from '@/api/mentor/mentor';
import { useIsAdminQuery } from '@/api/user/user';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

/**
 * 제출현황에서 담당 멘토를 변경하는 훅.
 * PATCH /attendance가 아니라 POST /mentor/{id}/match API를 사용하여
 * application 단위로 멘토를 매칭한다.
 */
const useFeedbackMentorAssignment = () => {
  const { programId, missionId } = useParams<{
    programId: string;
    missionId: string;
  }>();
  const { data: isAdmin } = useIsAdminQuery();
  const { snackbar } = useAdminSnackbar();
  const queryClient = useQueryClient();

  const { data: applicationsData } = useChallengeApplicationsQuery({
    challengeId: programId,
    enabled: !!programId && isAdmin === true,
  });
  const matchMutation = usePostAdminChallengeMentorMatch();

  const invalidateAttendance = async () => {
    const queryKey = isAdmin
      ? [ChallengeMissionFeedbackAttendanceQueryKey, programId, missionId]
      : [MentorMissionFeedbackAttendanceQueryKey, programId, missionId];

    await queryClient.invalidateQueries({ queryKey });
    await queryClient.invalidateQueries({
      queryKey: [
        'admin',
        'challenge',
        Number(programId),
        'attendances',
        Number(missionId),
      ],
    });
  };

  const assignMentor = async (params: {
    participantName: string;
    challengeMentorId: number;
  }) => {
    const app = applicationsData?.applicationList.find(
      (a) => a.application.name === params.participantName,
    );

    if (!app) {
      snackbar('해당 참여자의 신청 정보를 찾을 수 없습니다.');
      throw new Error('Application not found');
    }

    await matchMutation.mutateAsync({
      challengeId: Number(programId),
      challengeMentorId: params.challengeMentorId,
      challengeApplicationIdList: [app.application.id],
    });

    // attendance + applications 쿼리 모두 무효화 (fallback에서 멘토 정보 갱신)
    await invalidateAttendance();
    await queryClient.invalidateQueries({
      queryKey: [ChallengeApplicationsQueryKey, programId],
    });
  };

  return {
    assignMentor,
    isPending: matchMutation.isPending,
    applicationsLoaded: !!applicationsData,
  };
};

export default useFeedbackMentorAssignment;
