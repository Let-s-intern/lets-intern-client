import { clsx } from 'clsx';
import MissionGuideBonusSection from './MissionGuideBonusSection';
import MissionGuideRegularSection from './MissionGuideRegularSection';
import MissionGuideZeroSection from './MissionGuideZeroSection';

interface MissionGuideSectionProps {
  className?: string;
  todayTh: number;
  missionData?: any; // API 응답 데이터
}

const MissionGuideSection = ({
  className,
  todayTh,
  missionData,
}: MissionGuideSectionProps) => {
  const renderSection = () => {
    if (todayTh === 0) {
      return (
        <MissionGuideZeroSection todayTh={todayTh} missionData={missionData} />
      );
    }

    if (todayTh === 100) {
      return <MissionGuideBonusSection todayTh={todayTh} />;
    }

    // 기본값
    return <MissionGuideRegularSection todayTh={todayTh} />;
  };

  return (
    <div className={clsx('flex flex-col', className)}>{renderSection()}</div>
  );
};

export default MissionGuideSection;
