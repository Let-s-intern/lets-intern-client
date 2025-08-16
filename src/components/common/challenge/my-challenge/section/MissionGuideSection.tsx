import { useChallengeMissionAttendanceInfoQuery } from '@/api/challenge';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { clsx } from 'clsx';
import MissionGuideBonusSection from './MissionGuideBonusSection';
import MissionGuideRegularSection from './MissionGuideRegularSection';
import MissionGuideZeroSection from './MissionGuideZeroSection';

interface MissionGuideSectionProps {
  className?: string;
  todayTh: number;
  selectedMissionTh?: number; // 선택된 미션의 회차
}

const MissionGuideSection = ({
  className,
  todayTh,
  selectedMissionTh,
}: MissionGuideSectionProps) => {
  const {
    submittedMissions,
    remainingMissions,
    absentMissions,
    currentChallenge,
  } = useCurrentChallenge();

  // 선택된 미션의 ID 찾기
  const getMissionId = () => {
    if (!selectedMissionTh) return undefined;

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

    return undefined;
  };

  const missionId = getMissionId();

  // 선택된 미션의 상세 정보 가져오기
  const { data: missionData } = useChallengeMissionAttendanceInfoQuery({
    challengeId: currentChallenge?.id ?? 0,
    missionId: missionId ?? 0,
  });

  const renderSection = () => {
    if (selectedMissionTh === 0) {
      return (
        <MissionGuideZeroSection
          todayTh={todayTh}
          missionData={missionData}
          selectedMissionTh={selectedMissionTh}
        />
      );
    }

    if (selectedMissionTh === 100) {
      return (
        <MissionGuideBonusSection
          todayTh={todayTh}
          missionData={missionData}
          selectedMissionTh={selectedMissionTh}
        />
      );
    }

    // 기본값
    return (
      <MissionGuideRegularSection
        todayTh={todayTh}
        missionData={missionData}
        selectedMissionTh={selectedMissionTh}
      />
    );
  };

  return (
    <div className={clsx('flex flex-col', className)}>{renderSection()}</div>
  );
};

export default MissionGuideSection;
