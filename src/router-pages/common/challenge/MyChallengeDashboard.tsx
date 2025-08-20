import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import dayjs from '@/lib/dayjs';
import { useMissionStore } from '@/store/useMissionStore';
import axios from '@/utils/axios';
import MissionCalendarSection from '@components/common/challenge/my-challenge/section/MissionCalendarSection';
import MissionGuideSection from '@components/common/challenge/my-challenge/section/MissionGuideSection';
import MissionMentorCommentSection from '@components/common/challenge/my-challenge/section/MissionMentorCommentSection';
import MissionSubmitSection from '@components/common/challenge/my-challenge/section/MissionSubmitSection';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const getIsChallengeDone = (endDate: string) => {
  return dayjs(new Date()).isAfter(dayjs(endDate));
};

const getIsChallengeSubmitDone = (endDate: string) => {
  return dayjs(new Date()).isAfter(dayjs(endDate).add(2, 'day'));
};

const MyChallengeDashboard = () => {
  const params = useParams<{ programId: string }>();

  const { schedules, myDailyMission } = useCurrentChallenge();
  const [modalOpen, setModalOpen] = useState(false);
  const { selectedMissionTh, setSelectedMission, selectedMissionId } =
    useMissionStore();

  // const todayTh = myDailyMission?.dailyMission?.th ?? schedules.length + 1;

  const { data: programData } = useQuery({
    queryKey: ['challenge', params.programId, 'application'],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(
        `/${queryKey[0]}/${queryKey[1]}/${queryKey[2]}`,
      );
      return res.data;
    },
  });

  const programEndDate = programData?.data?.endDate;

  const todayTh =
    myDailyMission?.dailyMission?.th ??
    schedules.reduce((th, schedule) => {
      return Math.max(th, schedule.missionInfo.th ?? 0);
    }, 0) + 1;

  const isChallengeDone = getIsChallengeDone(programEndDate);
  const isChallengeSubmitDone = programEndDate
    ? getIsChallengeSubmitDone(programEndDate)
    : false;

  return (
    <main className="pl-12">
      <h1 className="text-medium22 font-semibold">나의 미션</h1>
      <MissionCalendarSection
        schedules={schedules}
        todayTh={todayTh}
        isDone={isChallengeDone}
      />

      <div className="mt-10">
        <div>
          <MissionGuideSection todayTh={todayTh} />
        </div>
        <div className="mt-6">
          <MissionSubmitSection
            attendanceInfo={
              schedules.find(
                (schedule) => schedule.missionInfo.id === selectedMissionId,
              )?.attendanceInfo
            }
            startDate={schedules
              .find((schedule) => schedule.missionInfo.id === selectedMissionId)
              ?.missionInfo.startDate?.toString()}
          />
        </div>
        {/* 멘토 피드백 여부에 따라 값 받고 노출 */}
        <div className="mt-11">
          <MissionMentorCommentSection missionId={selectedMissionId} />
        </div>
      </div>
    </main>
  );
};

export default MyChallengeDashboard;
