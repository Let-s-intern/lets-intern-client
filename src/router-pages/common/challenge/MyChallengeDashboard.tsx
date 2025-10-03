import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { useChallengeProgram } from '@/hooks/useChallengeProgram';
import { useMissionSelection } from '@/hooks/useMissionSelection';
import { useMissionStore } from '@/store/useMissionStore';
import MissionCalendarSection from '@components/common/challenge/my-challenge/section/MissionCalendarSection';
import MissionGuideSection from '@components/common/challenge/my-challenge/section/MissionGuideSection';
import MissionMentorCommentSection from '@components/common/challenge/my-challenge/section/MissionMentorCommentSection';
import MissionSubmitSection from '@components/common/challenge/my-challenge/section/MissionSubmitSection';
import { Link, useParams } from 'react-router-dom';

const MyChallengeDashboard = () => {
  const { schedules } = useCurrentChallenge();
  const { selectedMissionId } = useMissionStore();
  const params = useParams();
  const applicationId = params.applicationId;
  // 미션 선택 관련 로직을 custom hook으로 분리
  const { todayTh } = useMissionSelection();

  // 챌린지 프로그램 정보 관련 로직을 custom hook으로 분리
  const { isChallengeDone } = useChallengeProgram();

  return (
    <main className="px-5 md:px-0 md:pl-12">
      <h2 className="mt-8 text-medium22 font-semibold">나의 미션</h2>
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
        <div className="mt-8">
          <MissionMentorCommentSection missionId={selectedMissionId} />
        </div>
      </div>
      <Link
        to={`/challenge/${applicationId}/${params.programId}`}
        className="flex gap-2 pb-10 text-neutral-35 md:hidden md:pb-0"
      >
        <img src="/icons/Arrow_Left.svg" alt="대시보드" />
        <span>대시보드로 돌아가기</span>
      </Link>
    </main>
  );
};

export default MyChallengeDashboard;
