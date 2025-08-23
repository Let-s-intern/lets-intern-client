import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { useMemo } from 'react';

export const useMissionCalculation = () => {
  const { schedules, myDailyMission } = useCurrentChallenge();

  // todayTh 계산을 useMemo로 최적화
  const todayTh = useMemo(() => {
    return (
      myDailyMission?.dailyMission?.th ??
      schedules.reduce((th, schedule) => {
        return Math.max(th, schedule.missionInfo.th ?? 0);
      }, 0)
    );
  }, [myDailyMission?.dailyMission?.th, schedules]);

  // 0회차 미션 찾기
  const zeroMission = useMemo(() => {
    return schedules.find((schedule) => schedule.missionInfo.th === 0);
  }, [schedules]);

  // 0회차 미션 성공 여부 확인
  const isZeroMissionPassed = useMemo(() => {
    return zeroMission?.attendanceInfo?.result === 'PASS';
  }, [zeroMission]);

  // todayTh 기반으로 미션 ID 찾기
  const todayMissionId = useMemo(() => {
    let todayId = schedules.find(
      (schedule) => schedule.missionInfo.th === todayTh,
    )?.missionInfo.id;

    if (!todayId) {
      todayId = schedules[schedules.length - 1]?.missionInfo.id;
    }

    return todayId ?? -1;
  }, [schedules, todayTh]);

  return {
    todayTh,
    zeroMission,
    isZeroMissionPassed,
    todayMissionId,
    schedules,
    myDailyMission,
  };
};
