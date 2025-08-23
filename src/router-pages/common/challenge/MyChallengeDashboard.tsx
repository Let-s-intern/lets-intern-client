import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import dayjs from '@/lib/dayjs';
import { useMissionStore } from '@/store/useMissionStore';
import axios from '@/utils/axios';
import MissionCalendarSection from '@components/common/challenge/my-challenge/section/MissionCalendarSection';
import MissionGuideSection from '@components/common/challenge/my-challenge/section/MissionGuideSection';
import MissionMentorCommentSection from '@components/common/challenge/my-challenge/section/MissionMentorCommentSection';
import MissionSubmitSection from '@components/common/challenge/my-challenge/section/MissionSubmitSection';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
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
  const { setSelectedMission, selectedMissionId, selectedMissionTh } =
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

  // todayTh 계산을 useMemo로 최적화
  const todayTh = useMemo(() => {
    return (
      myDailyMission?.dailyMission?.th ??
      schedules.reduce((th, schedule) => {
        return Math.max(th, schedule.missionInfo.th ?? 0);
      }, 0)
    );
  }, [myDailyMission?.dailyMission?.th, schedules]);

  console.log('테스', myDailyMission, schedules, todayTh, selectedMissionTh);
  // useEffect를 사용하여 to dayTh가 변경될 때만 setSelectedMission 실행
  useEffect(() => {
    // 사용자가 이미 선택한 미션이 있고, 그 미션이 유효한 경우에는 덮어쓰지 않음
    if (selectedMissionId !== -1 && selectedMissionId !== 0) {
      const selectedSchedule = schedules.find(
        (schedule) => schedule.missionInfo.id === selectedMissionId,
      );
      if (selectedSchedule?.missionInfo.th !== undefined) {
        return; // 이미 선택된 미션이 있으면 덮어쓰지 않음
      }
    }

    // 0회차 미션을 성공하지 않았으면 무조건 0회차로 이동
    const zeroMission = schedules.find(
      (schedule) => schedule.missionInfo.th === 0,
    );
    if (zeroMission?.missionInfo.id) {
      const isZeroMissionPassed = zeroMission.attendanceInfo?.result === 'PASS';
      if (!isZeroMissionPassed) {
        setSelectedMission(zeroMission.missionInfo.id, 0);
        return;
      }
    }

    // myDailyMission이 null인 경우 0회차 미션을 찾아서 설정
    if (!myDailyMission?.dailyMission?.th) {
      if (zeroMission?.missionInfo.id) {
        setSelectedMission(zeroMission.missionInfo.id, 0);
        return;
      }
    }

    let todayId = schedules.find(
      (schedule) => schedule.missionInfo.th === todayTh,
    )?.missionInfo.id;
    if (!todayId) {
      todayId = schedules[schedules.length - 1]?.missionInfo.id;
    }
    setSelectedMission(todayId ?? -1, todayTh);
  }, [
    todayTh,
    setSelectedMission,
    selectedMissionId,
    schedules,
    myDailyMission?.dailyMission?.th,
  ]);
  const isChallengeDone = getIsChallengeDone(programEndDate);
  // const isChallengeSubmitDone = programEndDate
  //   ? getIsChallengeSubmitDone(programEndDate)
  //   : false;

  return (
    <main className="pl-12">
      <h1 className="text-medium22 font-semibold">나의 미션</h1>
      <MissionCalendarSection
        schedules={schedules}
        todayTh={todayTh}
        isDone={isChallengeDone}
      />

      <div className="mt-10">
        <MissionGuideSection todayTh={todayTh} />
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
