import { clsx } from 'clsx';
import MissionSubmitBonusSection from './MissionSubmitBonusSection';
import MissionSubmitRegularSection from './MissionSubmitRegularSection';
import MissionSubmitZeroSection from './MissionSubmitZeroSection';

interface MissionSubmitSectionProps {
  className?: string;
  todayTh: number;
  missionId?: number; // 0회차 미션 ID
}

const MissionSubmitSection = ({
  className,
  todayTh,
  missionId,
}: MissionSubmitSectionProps) => {
  const renderSection = () => {
    if (todayTh === 0) {
      return (
        <MissionSubmitZeroSection todayTh={todayTh} missionId={missionId} />
      );
    }

    if (todayTh === 100) {
      return <MissionSubmitBonusSection todayTh={todayTh} />;
    }

    // 기본값
    return <MissionSubmitRegularSection todayTh={todayTh} />;
  };

  return <div className={clsx('', className)}>{renderSection()}</div>;
};

export default MissionSubmitSection;
