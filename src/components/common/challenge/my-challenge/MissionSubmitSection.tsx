import { clsx } from 'clsx';
import MissionSubmitBonusSection from './MissionSubmitBonusSection';
import MissionSubmitRegularSection from './MissionSubmitRegularSection';
import MissionSubmitZeroSection from './MissionSubmitZeroSection';

interface MissionSubmitSectionProps {
  className?: string;
  todayTh: number;
  missionId?: number; // 0회차 미션 ID
  selectedMissionTh?: number;
  todayId?: number; // 선택된 미션의 ID
}

const MissionSubmitSection = ({
  className,
  todayTh,
  missionId,
  selectedMissionTh,
  todayId,
}: MissionSubmitSectionProps) => {
  const renderSection = () => {
    if (todayTh === 0) {
      return (
        <MissionSubmitZeroSection todayTh={todayTh} missionId={missionId} />
      );
    }

    if (todayTh === 100) {
      return (
        <MissionSubmitBonusSection
          todayTh={todayTh}
          missionId={missionId}
          todayId={todayId}
        />
      );
    }

    // 기본값
    return (
      <MissionSubmitRegularSection todayTh={todayTh} missionId={missionId} />
    );
  };

  return <div className={clsx('', className)}>{renderSection()}</div>;
};

export default MissionSubmitSection;
