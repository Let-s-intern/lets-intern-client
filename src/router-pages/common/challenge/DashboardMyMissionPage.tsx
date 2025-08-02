import { useChallengeMissionAttendanceInfoQuery } from '@/api/challenge';
import MissionGuideSection from '@/components/common/challenge/my-challenge/MissionGuideSection';
import MissionMentorCommentSection from '@/components/common/challenge/my-challenge/MissionMentorCommentSection';
import MissionStatusMessage from '@/components/common/challenge/my-challenge/MissionStatusMessage';
import MissionSubmitSection from '@/components/common/challenge/my-challenge/MissionSubmitSection';
import MissionCalendarSection from '@/components/common/challenge/my-challenge/section/MissionCalendarSection';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import dayjs from '@/lib/dayjs';
import { useMissionStore } from '@/store/useMissionStore';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const getIsChallengeSubmitDone = (endDate: string) => {
  return dayjs(new Date()).isAfter(dayjs(endDate).add(2, 'day'));
};

const DashboardMyMissionPage = () => {
  const params = useParams<{ programId: string; applicationId: string }>();

  const { schedules, myDailyMission } = useCurrentChallenge();

  const { data: programData } = useQuery({
    queryKey: ['challenge', params.programId, 'application'],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(
        `/${queryKey[0]}/${queryKey[1]}/${queryKey[2]}`,
      );
      return res.data;
    },
  });

  // todayTh를 useState로 관리
  const [todayTh, setTodayTh] = useState(() => {
    const initialValue =
      myDailyMission?.dailyMission?.th ||
      schedules.reduce((th, schedule) => {
        return Math.max(th, schedule.missionInfo.th || 0);
      }, 0) + 1;
    return initialValue;
  });

  // 선택된 미션 ID를 관리
  // const [selectedMissionId, setSelectedMissionId] = useState<number>(() => {
  //   // 기본값으로 0회차 미션 ID 설정 (schedules[0]의 missionInfo.id)
  //   return schedules[0]?.missionInfo?.id || 0;
  // });

  // 선택된 미션의 회차를 관리
  // const [selectedMissionTh, setSelectedMissionTh] = useState<number>(() => {
  //   // 기본값으로 0회차 설정
  //   return schedules[0]?.missionInfo?.th || 0;
  // });

  const { selectedMissionId, selectedMissionTh, setSelectedMission } =
    useMissionStore();

  useEffect(() => {
    // 상태가 초기화되지 않았고, 스케줄 데이터가 있을 때 첫 번째 미션으로 초기화
    if (selectedMissionId === 0 && schedules.length > 0) {
      const firstMission = schedules[0]?.missionInfo;
      if (firstMission) {
        setSelectedMission(firstMission.id, firstMission.th || 0);
      }
    }
  }, [schedules, selectedMissionId, setSelectedMission]);

  // 데이터가 로드된 후 todayTh 업데이트
  useEffect(() => {
    if (myDailyMission || schedules.length > 0) {
      const newTodayTh =
        myDailyMission?.dailyMission?.th ||
        schedules.reduce((th, schedule) => {
          return Math.max(th, schedule.missionInfo.th || 0);
        }, 0) + 1;

      setTodayTh(newTodayTh);
    }
  }, [myDailyMission, schedules]);

  const programEndDate = programData?.data?.endDate;
  const isChallengeDone = getIsChallengeSubmitDone(programEndDate);

  const { data: missionData, isError } = useChallengeMissionAttendanceInfoQuery(
    {
      challengeId: Number(params.programId),
      missionId: selectedMissionId,
      enabled: !!selectedMissionId && selectedMissionId > 0,
    },
  );

  // 팝업 표시 조건 관리
  const [showPopup, setShowPopup] = useState(true);
  const closePopup = () => setShowPopup(false);

  // 팝업 클릭 시 selectedMissionId와 selectedMissionTh를 100으로 변경하는 함수
  // const handlePopupClick = () => {
  //   setSelectedMissionId(100);
  //   setSelectedMissionTh(100);
  // };
  const handlePopupClick = () => {
    setSelectedMission(100, 100);
  };

  useEffect(() => {
    /** 0회차 미션 미제출 처리 */
    if (!isError) return;

    alert('0회차 미션을 먼저 제출해주세요.');
    const zeroThMissionInfo = schedules[0]?.missionInfo;
    setSelectedMission(zeroThMissionInfo.id, 0);
  }, [isError, schedules, setSelectedMission]);

  return (
    <main>
      <header>
        <h1 className="text-2xl font-bold">나의 미션</h1>
      </header>
      <div className="mb-4 mt-6">
        <MissionStatusMessage todayTh={todayTh} />
      </div>
      <MissionCalendarSection
        schedules={schedules}
        todayTh={todayTh}
        isDone={isChallengeDone}
        onMissionClick={(missionId: number) => {
          const selectedSchedule = schedules.find(
            (schedule) => schedule.missionInfo.id === missionId,
          );
          const missionTh = selectedSchedule?.missionInfo?.th || 0;
          setSelectedMission(missionId, missionTh);
        }}
        selectedMissionId={selectedMissionId}
      />
      <div>
        <div className="mt-8">
          <MissionGuideSection
            todayTh={todayTh}
            missionData={missionData}
            selectedMissionTh={selectedMissionTh}
          />
        </div>
        {/* 보너스 미션 팝업 (다음 배포) */}
        {/* <div className="relative">
          <BonusMissionPopup
            isVisible={
              selectedMissionTh == 4 || selectedMissionTh == 6 || showPopup
            }
            onClose={closePopup}
            onPopupClick={handlePopupClick}
          />
        </div> */}
        <div className="mt-6">
          <MissionSubmitSection
            todayTh={selectedMissionTh}
            missionId={selectedMissionId}
            selectedMissionTh={selectedMissionTh}
            attendanceInfo={
              schedules.find(
                (schedule) => schedule.missionInfo.id === selectedMissionId,
              )?.attendanceInfo
            }
            todayId={
              schedules.find((schedule) => schedule.missionInfo.th === todayTh)
                ?.missionInfo.id
            }
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

export default DashboardMyMissionPage;
