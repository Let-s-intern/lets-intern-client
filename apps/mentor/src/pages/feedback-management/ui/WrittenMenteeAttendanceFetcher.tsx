import { useEffect } from 'react';

import { useMentorAttendanceQuery } from '@/pages/feedback/hooks/useMentorAttendanceQuery';

import type { MentorFeedbackManagement } from '@/api/challenge/challengeSchema';
import type { WrittenMenteeAttendance } from '../hooks/useMergedFeedbackRows';

type Challenge = MentorFeedbackManagement['challengeList'][number];
type Mission = Challenge['feedbackMissions'][number];

/** `${challengeId}-${missionId}` 형태의 출석 맵 키 */
export function attendanceKey(challengeId: number, missionId: number): string {
  return `${challengeId}-${missionId}`;
}

/**
 * 단일 (challenge, mission) 의 멘티별 출석을 fetch 해 상위로 보고하는 fan-out 단위.
 * ChallengeDataFetcher 의 MissionAttendanceFetcher 패턴을 그대로 차용한다.
 */
const MissionMenteeFetcher = ({
  challengeId,
  mission,
  onData,
}: {
  challengeId: number;
  mission: Mission;
  onData: (key: string, list: WrittenMenteeAttendance[]) => void;
}) => {
  const { data } = useMentorAttendanceQuery({
    challengeId,
    missionId: mission.missionId,
    enabled: true,
  });

  useEffect(() => {
    const list = data?.attendanceList;
    if (!list) return;
    onData(
      attendanceKey(challengeId, mission.missionId),
      list.map((a) => ({
        id: a.id,
        name: a.name,
        status: a.status,
        feedbackStatus: a.feedbackStatus,
      })),
    );
  }, [data, challengeId, mission.missionId, onData]);

  return null;
};

interface WrittenMenteeAttendanceFetcherProps {
  challenges: Challenge[];
  onData: (key: string, list: WrittenMenteeAttendance[]) => void;
}

/**
 * 서면 피드백 행을 멘티별 1행으로 펼치기 위한 출석 fan-out.
 *
 * feedback-management 목록의 모든 (challenge, mission) 쌍에 대해 미션별 출석 API를
 * 병렬 조회(N+1 허용)하고, 멘티별 출석 리스트를 `onData(key, list)` 로 상위에 보고한다.
 * 상위(`FeedbackManagementPage`)는 이를 맵으로 모아 `useMergedFeedbackRows` 에 주입한다.
 */
const WrittenMenteeAttendanceFetcher = ({
  challenges,
  onData,
}: WrittenMenteeAttendanceFetcherProps) => {
  return (
    <>
      {challenges.flatMap((challenge) =>
        challenge.feedbackMissions.map((mission) => (
          <MissionMenteeFetcher
            key={attendanceKey(challenge.challengeId, mission.missionId)}
            challengeId={challenge.challengeId}
            mission={mission}
            onData={onData}
          />
        )),
      )}
    </>
  );
};

export default WrittenMenteeAttendanceFetcher;
