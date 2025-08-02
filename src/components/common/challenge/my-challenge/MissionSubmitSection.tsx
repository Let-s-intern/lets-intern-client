import { Schedule } from '@/schema';
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
  attendanceInfo?: Schedule['attendanceInfo'] | null;
}

const MissionSubmitSection = ({
  className,
  todayTh,
  missionId,
  selectedMissionTh, // eslint-disable-line @typescript-eslint/no-unused-vars
  todayId,
  attendanceInfo,
}: MissionSubmitSectionProps) => {
  const renderSection = () => {
    // OT 미션
    if (todayTh === 0) {
      return (
        <MissionSubmitZeroSection todayTh={todayTh} missionId={missionId} />
      );
    }

    // 보너스 미션
    if (todayTh === 100) {
      return (
        <MissionSubmitBonusSection
          todayTh={todayTh}
          missionId={missionId}
          todayId={todayId}
          attendanceInfo={attendanceInfo}
        />
      );
    }

    // 기본값
    return (
      <MissionSubmitRegularSection
        todayTh={todayTh}
        missionId={missionId}
        attendanceInfo={attendanceInfo}
      />
    );
  };

  return <div className={clsx('', className)}>{renderSection()}</div>;
};

export default MissionSubmitSection;
