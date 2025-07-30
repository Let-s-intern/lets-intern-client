import { useChallengeMissionAttendanceInfoQuery } from '@/api/challenge';
import MissionGuideSection from '@/components/common/challenge/my-challenge/MissionGuideSection';
import MissionMentorCommentSection from '@/components/common/challenge/my-challenge/MissionMentorCommentSection';
import MissionStatusMessage from '@/components/common/challenge/my-challenge/MissionStatusMessage';
import MissionSubmitSection from '@/components/common/challenge/my-challenge/MissionSubmitSection';
import MissionCalendarSection from '@/components/common/challenge/my-challenge/section/MissionCalendarSection';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import dayjs from '@/lib/dayjs';
import axios from '@/utils/axios';
import BonusMissionPopup from '@components/common/challenge/my-challenge/BonusMissionPopup';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const getIsChallengeDone = (endDate: string) => {
  return dayjs(new Date()).isAfter(dayjs(endDate));
};

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

  // 데이터가 로드된 후 todayTh 업데이트
  useEffect(() => {
    if (myDailyMission || schedules.length > 0) {
      const newTodayTh =
        myDailyMission?.dailyMission?.th ||
        schedules.reduce((th, schedule) => {
          return Math.max(th, schedule.missionInfo.th || 0);
        }, 0) + 1;

      setTodayTh(newTodayTh);
      setTodayTh(0);
    }
  }, [myDailyMission, schedules]);

  const programEndDate = programData?.data?.endDate;
  const isChallengeDone = getIsChallengeDone(programEndDate);
  const isChallengeSubmitDone = programEndDate
    ? getIsChallengeSubmitDone(programEndDate)
    : undefined;

  const response = useChallengeMissionAttendanceInfoQuery({
    challengeId: Number(params.programId),
    missionId: myDailyMission?.dailyMission?.id ?? 0,
    enabled:
      !!myDailyMission?.dailyMission?.id && myDailyMission.dailyMission.id > 0,
  });

  console.log(JSON.stringify(response.data, null, 2));

  // 팝업 표시 조건 관리
  const [showPopup, setShowPopup] = useState(true);
  const closePopup = () => setShowPopup(false);

  // 팝업 클릭 시 todayTh를 100으로 변경하는 함수
  const handlePopupClick = () => {
    setTodayTh(100);
  };

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
      />
      <div>
        {/* 보너스 미션 팝업 */}

        <div className="mt-8">
          <MissionGuideSection todayTh={todayTh} />
        </div>
        <div className="relative">
          <BonusMissionPopup
            isVisible={showPopup && (todayTh === 4 || todayTh === 6)}
            onClose={closePopup}
            onPopupClick={handlePopupClick}
          />
        </div>
        <div className="mt-6">
          <MissionSubmitSection todayTh={todayTh} />
        </div>
        {/* 멘토 피드백 여부에 따라 값 받고 노출 */}
        <div className="mt-11">
          <MissionMentorCommentSection />
        </div>
      </div>

      {/* {myDailyMission?.attendanceInfo && myDailyMission.dailyMission && (
        <DailyMissionSection myDailyMission={myDailyMission} />
      )}
      {typeof isChallengeSubmitDone === 'boolean' && (
        <OtherMissionSection todayTh={todayTh} isDone={isChallengeSubmitDone} />
      )} */}
    </main>
  );
};

export default DashboardMyMissionPage;
