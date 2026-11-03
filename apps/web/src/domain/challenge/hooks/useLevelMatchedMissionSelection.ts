import { findLevelCounterpartMission } from '@/domain/challenge/utils/experienceLevelMission';
import { Schedule } from '@/schema';
import { useMissionStore } from '@/store/useMissionStore';
import { useEffect } from 'react';

/**
 * 선택된 경험정리 미션을 레벨에 맞는 같은 회차 미션으로 바꾼다.
 *
 * 기본 선택(useMissionSelection)은 레벨을 보지 않고 서버 오늘 미션(경험정리1)을 고른다.
 * 그 뒤에 얹어 기본 선택과 스토어에 남은 선택을 함께 맞춘다. 판정 전 LV1 기본값으로는
 * 바꾸지 않고, 판정이 끝나거나 레벨·선택이 바뀔 때마다 다시 맞춘다(LC-3555).
 */
export const useLevelMatchedMissionSelection = (
  schedules: Schedule[],
  level: 'LV1' | 'LV2',
  isLevelReady: boolean,
) => {
  const { selectedMissionId, setSelectedMission } = useMissionStore();

  useEffect(() => {
    if (!isLevelReady) return;

    const counterpart = findLevelCounterpartMission(
      schedules,
      selectedMissionId,
      level,
    );
    if (counterpart) setSelectedMission(counterpart.id, counterpart.th ?? 0);
  }, [schedules, selectedMissionId, level, isLevelReady, setSelectedMission]);
};
