import dayjs from '@/lib/dayjs';
import { Schedule } from '@/schema';
import { useMissionStore } from '@/store/useMissionStore';
import { clsx } from 'clsx';
import MissionSubmitBonusSection from './MissionSubmitBonusSection';
import MissionSubmitRegularSection from './MissionSubmitRegularSection';
import MissionSubmitZeroSection from './MissionSubmitZeroSection';

interface MissionSubmitSectionProps {
  className?: string;
  missionId?: number; // 0회차 미션 ID
  todayId?: number; // 선택된 미션의 ID
  attendanceInfo?: Schedule['attendanceInfo'] | null;
  startDate?: string;
  onRefreshMissionData?: () => void; // 미션 데이터 새로고침 callback
  onSubmitLastMission?: () => void;
}

const MissionSubmitSection = ({
  className,
  missionId,
  todayId,
  startDate,
  attendanceInfo,
  onRefreshMissionData,
  onSubmitLastMission,
}: MissionSubmitSectionProps) => {
  const { selectedMissionTh, selectedMissionId } = useMissionStore();
  // 현재 시간이 startDate 이상인지 확인하는 함수
  const isMissionStarted = () => {
    console.log('startDate', startDate);
    if (!startDate) return false;
    const missionStartDate = dayjs(startDate);
    const now = dayjs();
    return now.isAfter(missionStartDate) || now.isSame(missionStartDate);
  };
  const renderSection = () => {
    // OT 미션
    if (selectedMissionTh === 0) {
      return (
        <MissionSubmitZeroSection
          selectedMissionTh={selectedMissionTh}
          missionId={selectedMissionId}
          isSubmitDone={attendanceInfo?.submitted ?? false}
        />
      );
    }

    // 보너스 미션
    if (selectedMissionTh === 100) {
      return (
        <MissionSubmitBonusSection
          selectedMissionTh={selectedMissionTh}
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
          selectedMissionTh={selectedMissionTh}
          missionId={missionId}
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
