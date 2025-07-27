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
  todayTh = 1;
  const renderSection = () => {
    if (todayTh === 0) {
      return <MissionGuideZeroSection todayTh={todayTh} />;
    }

    if (todayTh >= 1 && todayTh <= 8) {
      return <MissionGuideRegularSection todayTh={todayTh} />;
    }

    if (todayTh === 100) {
      return <MissionGuideBonusSection todayTh={todayTh} />;
    }

    // 기본값
    return <MissionGuideZeroSection todayTh={todayTh} />;
  };

  return (
    <div className={clsx('flex flex-col', className)}>{renderSection()}</div>
  );
};

export default MissionGuideSection;
