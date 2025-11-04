import dayjs from '@/lib/dayjs';
import { Schedule } from '@/schema';
import { useMissionStore } from '@/store/useMissionStore';
import { BONUS_MISSION_TH, TALENT_POOL_MISSION_TH } from '@/utils/constants';
import { clsx } from 'clsx';
import MissionSubmitBonusSection from './MissionSubmitBonusSection';
import MissionSubmitRegularSection from './MissionSubmitRegularSection';
import MissionSubmitTalentPoolSection from './MissionSubmitTalentPoolSection';
import MissionSubmitZeroSection from './MissionSubmitZeroSection';

interface MissionSubmitSectionProps {
  className?: string;
  attendanceInfo?: Schedule['attendanceInfo'] | null;
  startDate?: string;
  onRefreshMissionData?: () => void; // 미션 데이터 새로고침 callback
  onSubmitLastMission?: () => void;
}

const MissionSubmitSection = ({
  className,
  startDate,
  attendanceInfo,
  onRefreshMissionData,
  onSubmitLastMission,
}: MissionSubmitSectionProps) => {
  const { selectedMissionTh, selectedMissionId } = useMissionStore();
  // 현재 시간이 startDate 이상인지 확인하는 함수
  const isMissionStarted = () => {
    if (!startDate) return false;
    const missionStartDate = dayjs(startDate);
    const now = dayjs();
    return now.isAfter(missionStartDate) || now.isSame(missionStartDate);
  };
  const renderSection = () => {
    // OT 미션
    if (selectedMissionTh === 0) {
      return <MissionSubmitZeroSection missionId={selectedMissionId} />;
    }

    // 보너스 미션
    if (selectedMissionTh >= BONUS_MISSION_TH) {
      return (
        <MissionSubmitBonusSection
          selectedMissionTh={selectedMissionTh}
          missionId={selectedMissionId}
          attendanceInfo={attendanceInfo}
        />
      );
    }

    if (selectedMissionTh === TALENT_POOL_MISSION_TH) {
      return (
        <MissionSubmitTalentPoolSection
          missionId={selectedMissionId}
          attendanceInfo={attendanceInfo}
        />
      );
    }

    // 기본값 - startDate 이후에만 렌더링
    if (isMissionStarted()) {
      return (
        <MissionSubmitRegularSection
          selectedMissionTh={selectedMissionTh}
          missionId={selectedMissionId}
          attendanceInfo={attendanceInfo}
          onRefreshMissionData={onRefreshMissionData}
          onSubmitLastMission={onSubmitLastMission}
        />
      );
    }

    // startDate 이전이면 아무것도 렌더링하지 않음
    return null;
  };

  return <div className={clsx('', className)}>{renderSection()}</div>;
};

export default MissionSubmitSection;
