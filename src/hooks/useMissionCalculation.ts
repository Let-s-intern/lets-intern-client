import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { BONUS_MISSION_TH } from '@/utils/constants';
import { useMemo } from 'react';

export const useMissionCalculation = () => {
  const { schedules, myDailyMission } = useCurrentChallenge();

  const isLastMissionSubmitted = useMemo(() => {
    const lastSchedule = schedules[schedules.length - 1];
    const isBonus = lastSchedule?.missionInfo?.th === BONUS_MISSION_TH;

    if (isBonus) {
      // 보너스 회차가 있으면: 보너스 회차(100) + 마지막 미션 둘 다 제출되어야 함
      const lastMissionSchedule = schedules[schedules.length - 2];
      return (
        lastSchedule?.attendanceInfo?.submitted &&
        lastMissionSchedule?.attendanceInfo?.submitted
      );
    }
    // 보너스가 없으면: 마지막만 제출되면 됨
    return lastSchedule?.attendanceInfo?.submitted;
  }, [schedules]);

  /**
   * [구 대시보드 로직 문제점]
   * 현재 해당하는 미션이 없으면 (가장 큰 th + 1)을 todayTh로 사용 중인데,
   * 보너스가 아닌 일반 미션이 마지막 미션인 경우 현재 없는 회차가 표시되는 문제가 있음
   * @todo: 해당 미션이 없으면 null로 하든 가장 큰 th로 하든 로직 수정이 필요함
   */
  const todayTh = useMemo(() => {
    if (myDailyMission?.dailyMission?.th != null && !isLastMissionSubmitted) {
      return myDailyMission.dailyMission.th;
    }
    return (
      schedules.reduce((th, schedule) => {
        return Math.max(th, schedule.missionInfo.th ?? 0);
      }, 0) + 1
    );
  }, [myDailyMission?.dailyMission?.th, schedules, isLastMissionSubmitted]);

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
    isLastMissionSubmitted,
    schedules,
    myDailyMission,
  };
};
