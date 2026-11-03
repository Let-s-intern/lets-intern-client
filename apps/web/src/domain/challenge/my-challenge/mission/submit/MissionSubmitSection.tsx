import useChallengeNav from '@/domain/challenge/hooks/useChallengeNav';
import { getMissionTimeState } from '@/domain/challenge/utils/missionTimeState';
import { useMissionCalculation } from '@/hooks/useMissionCalculation';
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
import MissionSubmitOTRequiredNotice from './ui/MissionSubmitOTRequiredNotice';

interface MissionSubmitSectionProps {
  className?: string;
  attendanceInfo?: Schedule['attendanceInfo'] | null;
  /** 레벨로 걸러진 목록에서 찾은 선택 미션. 시작일 판정과 일반 폼 표시 여부에 쓴다. */
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
  const { zeroMission, isZeroMissionPassed } = useMissionCalculation();

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

    // 0회차를 내지 않았으면 1회차 이상(보너스·인재풀 포함)은 서버가 제출을 거절한다.
    // 0회차가 없는 챌린지는 isZeroMissionPassed 가 false 라 zeroMission 을 같이 본다.
    if (selectedMissionTh >= 1 && zeroMission && !isZeroMissionPassed) {
      return <MissionSubmitOTRequiredNotice />;
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

    // 선택된 미션이 레벨로 걸러진 목록에 없으면 폼을 그리지 않는다. 다른 레벨 경험정리
    // 미션이 선택된 채로 그리면 화면과 다른 미션으로 제출된다(LC-3555). 선택은 /me 에서
    // 레벨에 맞춰지므로, 맞춰지기 전 한 순간이나 맞출 짝이 없을 때의 방어선이다.
    if (!mission) return null;

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
