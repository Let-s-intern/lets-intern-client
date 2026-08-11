import useChallengeNav from '@/domain/challenge/hooks/useChallengeNav';
import { getMissionTimeState } from '@/domain/challenge/utils/missionTimeState';
import dayjs from '@/lib/dayjs';
import { Schedule, ScheduleMission } from '@/schema';
import { useMissionStore } from '@/store/useMissionStore';
import { BONUS_MISSION_TH, TALENT_POOL_MISSION_TH } from '@/utils/constants';
import { clsx } from 'clsx';
import MissionSubmitTalentPoolSection from '../talent/MissionSubmitTalentPoolSection';
import MissionSubmitBonusSection from './bonus/MissionSubmitBonusSection';
import MissionSubmitZeroSection from './MissionSubmitZeroSection';
import MissionSubmitRegularSection from './regular/MissionSubmitRegularSection';
import MissionSubmitNotOpenNotice from './ui/MissionSubmitNotOpenNotice';

interface MissionSubmitSectionProps {
  className?: string;
  attendanceInfo?: Schedule['attendanceInfo'] | null;
  /** 선택된 미션. 시작일 판정에 쓴다. */
  mission?: ScheduleMission | null;
  onRefreshMissionData?: () => void; // 미션 데이터 새로고침 callback
  onSubmitLastMission?: () => void;
}

const MissionSubmitSection = ({
  className,
  mission,
  attendanceInfo,
  onRefreshMissionData,
  onSubmitLastMission,
}: MissionSubmitSectionProps) => {
  const { selectedMissionTh, selectedMissionId } = useMissionStore();
  const { testDate } = useChallengeNav();

  // 어드민 미리보기(?testDate=)에서는 그 날짜를 '지금' 으로 본다.
  const now = testDate ? dayjs(testDate) : dayjs();
  const timeState = mission ? getMissionTimeState(mission, now) : null;

  const renderSection = () => {
    // 시작 전이면 회차 종류와 무관하게 제출 폼 대신 안내를 그린다.
    //
    // 예전에는 OT(0)·보너스(100)·인재풀(99)이 시작일 검사보다 앞에서 반환됐고
    // 세 섹션 내부에도 시작일 검사가 없어(마감일만 본다), 아직 열리지 않은 특수
    // 미션에도 제출 폼이 그려졌다. 미션을 전체 공개하면 미래 회차를 여는 일이
    // 늘어 더 자주 드러난다.
    //
    // 폼을 감추는 것은 UX 보조다. 감춰지지 않아도 서버가 400 으로 막는다.
    if (timeState === 'UPCOMING' && mission?.startDate) {
      return <MissionSubmitNotOpenNotice startDate={mission.startDate} />;
    }

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

    // 마감된 회차도 폼을 연다. 지각 제출은 챌린지 종료 +2일까지 유지된다.
    return (
      <MissionSubmitRegularSection
        selectedMissionTh={selectedMissionTh}
        missionId={selectedMissionId}
        attendanceInfo={attendanceInfo}
        onRefreshMissionData={onRefreshMissionData}
        onSubmitLastMission={onSubmitLastMission}
      />
    );
  };

  return <div className={clsx('', className)}>{renderSection()}</div>;
};

export default MissionSubmitSection;
