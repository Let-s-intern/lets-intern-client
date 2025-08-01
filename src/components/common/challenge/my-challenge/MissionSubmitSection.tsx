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
  attendanceInfo?: {
    link: string | null;
    status: 'PRESENT' | 'UPDATED' | 'LATE' | 'ABSENT' | null;
    id: number | null;
    submitted: boolean | null;
    comments: string | null;
    result: 'WAITING' | 'PASS' | 'WRONG' | null;
    review?: string | null;
  } | null;
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
