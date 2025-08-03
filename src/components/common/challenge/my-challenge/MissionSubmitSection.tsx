import dayjs from '@/lib/dayjs';
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
  startDate?: string;
}

const MissionSubmitSection = ({
  className,
  todayTh,
  missionId,
  selectedMissionTh, // eslint-disable-line @typescript-eslint/no-unused-vars
  todayId,
  startDate,
  attendanceInfo,
}: MissionSubmitSectionProps) => {
  // 현재 시간이 startDate 이상인지 확인하는 함수
  const isMissionStarted = () => {
    if (!startDate) return false;
    const missionStartDate = dayjs(startDate);
    const now = dayjs();
    return now.isSameOrAfter(missionStartDate);
  };

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

    // 기본값 - startDate 이후에만 렌더링
    if (isMissionStarted()) {
      return (
        <MissionSubmitRegularSection
          todayTh={todayTh}
          missionId={missionId}
          attendanceInfo={attendanceInfo}
        />
      );
    }

    // startDate 이전이면 아무것도 렌더링하지 않음
    return null;
  };

  return <div className={clsx('', className)}>{renderSection()}</div>;
};

export default MissionSubmitSection;
