import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import {
  findLastFinishedSchedule,
  getMissionTimeState,
} from '@/domain/challenge/utils/missionTimeState';
import dayjs from '@/lib/dayjs';
import { Schedule } from '@/schema';
import { BONUS_MISSION_TH, TALENT_POOL_MISSION_TH } from '@/utils/constants';
import { useMemo } from 'react';

export const useMissionCalculation = () => {
  const { schedules, myDailyMission } = useCurrentChallenge();

  const isLastMissionSubmitted = useMemo(() => {
    if (schedules.length === 0) return false;

    const lastSchedule = schedules[schedules.length - 1];
    const secondLastSchedule = schedules[schedules.length - 2];
    const thirdLastSchedule = schedules[schedules.length - 3];

    const isSpecialMission = (schedule: Schedule | undefined) => {
      const th = schedule?.missionInfo?.th;
      return th === BONUS_MISSION_TH || th === TALENT_POOL_MISSION_TH;
    };

    const isLastSpecial = isSpecialMission(lastSchedule);
    const isSecondLastSpecial = isSpecialMission(secondLastSchedule);

    // N회차
    if (!isLastSpecial) {
      return lastSchedule?.attendanceInfo?.submitted ?? false;
    }

    // 인재풀+보너스+N회차
    if (isSecondLastSpecial) {
      return [lastSchedule, secondLastSchedule, thirdLastSchedule].every(
        (schedule) => schedule?.attendanceInfo?.submitted,
      );
    }

    // 보너스+N회차
    return [lastSchedule, secondLastSchedule].every(
      (schedule) => schedule?.attendanceInfo?.submitted,
    );
  }, [schedules]);

  /**
   * 오늘 진행 중인 회차. **없으면 null 이다.**
   *
   * 진행 중인 미션이 없는 시간대는 오류가 아니라 정상 상태다. 미션이 매일 08:00 에 열리고
   * 23:59 에 닫히는 편성이면 매일 00:00~08:00 여덟 시간 동안 오늘 회차가 없다.
   * 예전에는 그때 (가장 큰 th + 1)로 채웠는데, 소비처가 전부 `th < todayTh` 로 "지나간 회차"
   * 를 가리다 보니 전 회차가 마감된 것으로 판정되어 '미제출'(빨강)로 그려졌다(LC-3207).
   *
   * `isLastMissionSubmitted` 가 참일 때도 null 이다. "완주했다" 와 "오늘이 101회차다" 는 다르다.
   * 값을 지어내지 않고 null 로 두면 각 소비처가 "오늘 회차 없음" 을 제 뜻대로 해석한다.
   */
  const todayTh = useMemo(() => {
    if (myDailyMission?.dailyMission?.th != null && !isLastMissionSubmitted) {
      return myDailyMission.dailyMission.th;
    }
    return null;
  }, [myDailyMission?.dailyMission?.th, isLastMissionSubmitted]);

  // 0회차 미션 찾기
  const zeroMission = useMemo(() => {
    return schedules.find((schedule) => schedule.missionInfo.th === 0);
  }, [schedules]);

  // 0회차 미션 성공 여부 확인
  const isZeroMissionPassed = useMemo(() => {
    return zeroMission?.attendanceInfo?.result === 'PASS';
  }, [zeroMission]);

  /**
   * 나의 기록장에서 기본으로 열 미션.
   *
   * 오늘 회차가 있으면 그 회차다. 없으면 가장 최근에 마감된 회차를 연다.
   * 예전에는 schedules 의 마지막 항목으로 떨어뜨렸는데, 그건 대개 보너스 미션이라
   * 새벽에 나의 기록장을 열면 보너스 미션이 선택되어 있었다.
   */
  const todayMissionId = useMemo(() => {
    if (todayTh !== null) {
      const todayId = schedules.find(
        (schedule) => schedule.missionInfo.th === todayTh,
      )?.missionInfo.id;
      if (todayId) return todayId;
    }

    const now = dayjs();

    const lastFinished = findLastFinishedSchedule(schedules, now);
    if (lastFinished) return lastFinished.missionInfo.id;

    // 챌린지 시작 전이라 마감된 회차가 없으면 가장 이른 회차를 연다.
    const firstUpcoming = schedules
      .filter(
        (schedule) =>
          getMissionTimeState(schedule.missionInfo, now) === 'UPCOMING' &&
          schedule.missionInfo.startDate,
      )
      .sort(
        (a, b) =>
          (a.missionInfo.startDate?.valueOf() ?? 0) -
          (b.missionInfo.startDate?.valueOf() ?? 0),
      )[0];

    return firstUpcoming?.missionInfo.id ?? -1;
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
