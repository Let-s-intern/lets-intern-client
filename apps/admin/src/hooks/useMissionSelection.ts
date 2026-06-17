import { useMissionStore } from '@/store/useMissionStore';
import { useEffect, useMemo } from 'react';
import { useMissionCalculation } from './useMissionCalculation';

export const useMissionSelection = () => {
  const { setSelectedMission, selectedMissionId } = useMissionStore();
  const {
    todayTh,
    zeroMission,
    isZeroMissionPassed,
    todayMissionId,
    schedules,
    myDailyMission,
  } = useMissionCalculation();

  // 사용자가 선택한 미션의 스케줄 정보
  const selectedSchedule = useMemo(() => {
    if (selectedMissionId === -1 || selectedMissionId === 0) return null;
    return schedules.find(
      (schedule) => schedule.missionInfo.id === selectedMissionId,
    );
  }, [selectedMissionId, schedules]);

  // 사용자가 이미 선택한 미션이 유효한지 확인
  const isUserSelectedMissionValid = useMemo(() => {
    return selectedSchedule?.missionInfo.th !== undefined;
  }, [selectedSchedule]);

  // 0회차 미션으로 이동해야 하는지 확인
  const shouldMoveToZeroMission = useMemo(() => {
    // 0회차 미션을 성공하지 않았으면 무조건 0회차로 이동
    if (!isZeroMissionPassed) return true;

    // myDailyMission이 null인 경우 0회차 미션으로 이동
    if (!myDailyMission?.dailyMission?.th) return true;

    return false;
  }, [isZeroMissionPassed, myDailyMission?.dailyMission?.th]);

  // useEffect를 사용하여 todayTh가 변경될 때만 setSelectedMission 실행
  useEffect(() => {
    // 사용자가 이미 선택한 미션이 있고, 그 미션이 유효한 경우에는 덮어쓰지 않음
    if (isUserSelectedMissionValid) {
      return;
    }

    // 0회차 미션으로 이동해야 하는 경우
    if (shouldMoveToZeroMission && zeroMission?.missionInfo.id) {
      setSelectedMission(zeroMission.missionInfo.id, 0);
      return;
    }

    // 기본 로직: todayTh 기반으로 미션 설정
    const todayId = todayMissionId;
    setSelectedMission(todayId, todayTh);
  }, [
    todayTh,
    setSelectedMission,
    isUserSelectedMissionValid,
    shouldMoveToZeroMission,
    zeroMission,
    todayMissionId,
  ]);

  return {
    todayTh,
    zeroMission,
    isZeroMissionPassed,
    selectedSchedule,
    isUserSelectedMissionValid,
    shouldMoveToZeroMission,
    todayMissionId,
  };
};
