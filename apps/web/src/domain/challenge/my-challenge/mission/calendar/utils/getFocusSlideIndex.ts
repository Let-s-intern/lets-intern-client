import { Schedule } from '@/schema';

/**
 * 캘린더가 `targetTh` 회차 카드를 화면 가운데에 두려면 몇 번째 슬라이드로 가야 하는가.
 * 첫 화면에 이미 보이거나 그 회차 카드가 없으면 null 이다(움직이지 않는다).
 *
 * 카드 자리는 회차 번호로 셈하지 않고 schedules 에서 찾는다. 예전의 `th` / `th - 1`
 * 계산은 회차가 1씩 이어진다고 전제해, 버전에 없는 회차가 빠진 편성(4회차가 B 에 없음)
 * 에서는 빠진 칸 수만큼 뒤 카드로 갔다.
 */
export const getFocusSlideIndex = (
  schedules: Schedule[],
  targetTh: number,
  visibleCount: number,
): number | null => {
  const index = schedules.findIndex(
    (schedule) => schedule.missionInfo.th === targetTh,
  );
  if (index === -1 || index < visibleCount) return null;

  return Math.max(index - Math.floor(visibleCount / 2), 0);
};
