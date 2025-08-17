import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import dayjs from '@/lib/dayjs';
import { useMissionStore } from '@/store/useMissionStore';
import axios from '@/utils/axios';
import DailyMissionSection from '@components/common/challenge/dashboard/section/DailyMissionSection';
import MissionStatusMessage from '@components/common/challenge/my-challenge/mission/MissionStatusMessage';
import MissionCalendarSection from '@components/common/challenge/my-challenge/section/MissionCalendarSection';
import MissionGuideSection from '@components/common/challenge/my-challenge/section/MissionGuideSection';
import MissionSubmitSection from '@components/common/challenge/my-challenge/section/MissionSubmitSection';
import OtherMissionSection from '@components/common/challenge/my-challenge/section/OtherMissionSection';
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

  const [todayTh, setTodayTh] = useState(() => {
    const initialValue =
      myDailyMission?.dailyMission?.th ||
      schedules.reduce((th, schedule) => {
        return Math.max(th, schedule.missionInfo.th || 0);
      }, 0) + 1;
    return initialValue;
  });
  const isChallengeDone = getIsChallengeDone(programEndDate);
  const isChallengeSubmitDone = programEndDate
    ? getIsChallengeSubmitDone(programEndDate)
    : false;

  return (
    <main className="px-6">
      <header>
        <h1 className="text-2xl font-semibold">나의 미션</h1>
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
        <div className="mt-8">
          <MissionGuideSection todayTh={todayTh} />
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
            attendanceInfo={
              schedules.find(
                (schedule) => schedule.missionInfo.id === selectedMissionId,
              )?.attendanceInfo
            }
          />
        </div>
        {/* 멘토 피드백 여부에 따라 값 받고 노출 */}
        <div className="mt-11">
          {/* <MissionMentorCommentSection missionId={selectedMissionId} /> */}
        </div>
      </div>
      {modalOpen && (
        <>tst</>
        // <DashboardCreateReviewModal
        //   programId={params.programId ?? ''}
        //   applicationId={params.applicationId ?? ''}
        //   onClose={() => setModalOpen(false)}
        // />
      )}
      {/* 기존 코드 참고용 */}
      {/* <MissionCalendarSection
        schedules={schedules}
        todayTh={todayTh}
        isDone={isChallengeDone}
      /> */}
      {myDailyMission?.attendanceInfo && (
        <DailyMissionSection dailyMission={myDailyMission.dailyMission} />
      )}

      {typeof isChallengeSubmitDone === 'boolean' && (
        <OtherMissionSection todayTh={todayTh} isDone={isChallengeSubmitDone} />
      )}
    </main>
  );
};

export default MyChallengeDashboard;
