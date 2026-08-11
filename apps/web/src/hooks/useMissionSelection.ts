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
  //
  // 0회차 미션을 성공하지 않았으면 무조건 0회차로 이동한다(OT 선행).
  //
  // 예전에는 `!myDailyMission?.dailyMission?.th` 조건이 하나 더 있었다. 두 가지가 틀렸다.
  // falsy 검사라 오늘 회차가 0회차(OT)일 때도 참이었고, 진행 중인 미션이 없는 시간대에
  // 0회차로 튕겨 보냈다. 그 시간대에는 아래 todayMissionId(가장 최근에 마감된 회차)를 쓴다.
  const shouldMoveToZeroMission = !isZeroMissionPassed;

  // todayTh 가 null 인 시간대에는 todayMissionId 가 가장 최근에 마감된 회차를 가리킨다.
  // 스토어에는 그 미션의 회차 번호를 함께 넣어야 가이드·헤더가 맞는 회차를 그린다.
  const defaultMissionTh = useMemo(() => {
    const defaultSchedule = schedules.find(
      (schedule) => schedule.missionInfo.id === todayMissionId,
    );
    return defaultSchedule?.missionInfo.th ?? todayTh ?? 0;
  }, [schedules, todayMissionId, todayTh]);

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

    // 기본 로직: 오늘 회차, 없으면 가장 최근에 마감된 회차
    setSelectedMission(todayMissionId, defaultMissionTh);
  }, [
    defaultMissionTh,
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
