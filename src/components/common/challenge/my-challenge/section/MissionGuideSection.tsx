import { useChallengeMissionAttendanceInfoQuery } from '@/api/challenge';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { useMissionStore } from '@/store/useMissionStore';
import { clsx } from 'clsx';
import MissionGuideBonusSection from './MissionGuideBonusSection';
import MissionGuideRegularSection from './MissionGuideRegularSection';
import MissionGuideZeroSection from './MissionGuideZeroSection';

interface MissionGuideSectionProps {
  className?: string;
  todayTh: number;
}

const MissionGuideSection = ({
  className,
  todayTh,
}: MissionGuideSectionProps) => {
  const { selectedMissionTh, selectedMissionId } = useMissionStore();
  const {
    submittedMissions,
    remainingMissions,
    absentMissions,
    currentChallenge,
  } = useCurrentChallenge();

  // 선택된 미션의 ID 찾기
  const getMissionId = () => {
    // 제출된 미션에서 찾기
    const submittedMission = submittedMissions.find(
      (mission) => mission.th === selectedMissionTh,
    );
    if (submittedMission) return submittedMission.id;

    // 남은 미션에서 찾기
    const remainingMission = remainingMissions.find(
      (mission) => mission.th === selectedMissionTh,
    );
    if (remainingMission) return remainingMission.id;

    // 미제출 미션에서 찾기
    const absentMission = absentMissions.find(
      (mission) => mission.th === selectedMissionTh,
    );
    if (absentMission) return absentMission.id;

    return selectedMissionId;
  };

  const missionId = getMissionId();
  // 선택된 미션의 상세 정보 가져오기
  const { data: missionData, isLoading } =
    useChallengeMissionAttendanceInfoQuery({
      challengeId: currentChallenge?.id ?? 0,
      missionId: missionId ?? 0,
    });

  const renderSection = () => {
    if (selectedMissionTh === 0) {
      return (
        <MissionGuideZeroSection
          missionData={missionData}
          selectedMissionTh={selectedMissionTh}
          isLoading={isLoading}
        />
      );
    }

    if (selectedMissionTh >= 100) {
      return (
        <MissionGuideBonusSection
          todayTh={todayTh}
          missionData={missionData}
          selectedMissionTh={selectedMissionTh}
          isLoading={isLoading}
        />
      );
    }

    // 기본값
    return (
      <MissionGuideRegularSection
        todayTh={todayTh}
        missionData={missionData}
        selectedMissionTh={selectedMissionTh}
        isLoading={isLoading}
      />
    );
  };

  return (
    <div className={clsx('flex flex-col', className)}>{renderSection()}</div>
  );
};

export default MissionGuideSection;
