import { calendarChallengeFixtures } from '@/api/all-in-one-pass/mock/calendarChallengeFixtures';
import { PassCalendarEvent } from '@/domain/all-in-one-pass/types';
import dayjs from '@/lib/dayjs';
import { ChallengeType } from '@/schema';
import type { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import type { BarKind } from './calendarBarStyles';

export type BarItem = {
  id: string;
  title: string;
  kind: BarKind;
  challengeType?: ChallengeType; // 챌린지 타입별 색상
  start: Dayjs;
  end: Dayjs;
};

/** 월요일 시작 주의 첫날 */
const weekStartOf = (d: Dayjs) =>
  d.subtract((d.day() + 6) % 7, 'day').startOf('day');

interface Params {
  events: PassCalendarEvent[];
  purchaseStartDate?: string | null;
  purchaseEndDate?: string | null;
  passDays?: number | null;
  open: boolean;
}

/**
 * 캘린더 미리보기 로직: 2주(14일) 창을 계산한다. 이동 가능 범위,
 * 표시 항목(items), lane 패킹까지 계산하고 렌더는 Modal/WeekRow 가 담당.
 */
export function useCalendarPreview({
  events,
  purchaseStartDate,
  purchaseEndDate,
  passDays,
  open,
}: Params) {
  // 이동 가능 범위(주 단위): [구매 시작주] ~ [구매 종료 + 패스기간이 속한 주]
  const minWS = purchaseStartDate
    ? weekStartOf(dayjs(purchaseStartDate))
    : null;
  const maxDate = purchaseEndDate
    ? dayjs(purchaseEndDate).add(passDays ?? 0, 'day')
    : null;
  const maxWS = maxDate ? weekStartOf(maxDate) : null;
  const clampWS = (ws: Dayjs) => {
    if (minWS && ws.valueOf() < minWS.valueOf()) return minWS;
    if (maxWS && ws.valueOf() > maxWS.valueOf()) return maxWS;
    return ws;
  };
  const initialWS = () =>
    clampWS(
      weekStartOf(purchaseStartDate ? dayjs(purchaseStartDate) : dayjs()),
    );

  const [windowStart, setWindowStart] = useState<Dayjs>(initialWS);

  useEffect(() => {
    if (open) setWindowStart(initialWS());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const canPrev = !minWS || windowStart.valueOf() > minWS.valueOf();
  const canNext = !maxWS || windowStart.valueOf() < maxWS.valueOf();
  const goPrev = () =>
    canPrev && setWindowStart((ws) => clampWS(ws.subtract(14, 'day')));
  const goNext = () =>
    canNext && setWindowStart((ws) => clampWS(ws.add(14, 'day')));

  // 2주(2행 × 7일)
  const weeks = useMemo(
    () =>
      Array.from({ length: 2 }, (_, w) =>
        Array.from({ length: 7 }, (_, d) => windowStart.add(w * 7 + d, 'day')),
      ),
    [windowStart],
  );

  // 이 14일 창에서 날짜가 가장 많은 달 = "현재 달" (나머지 달은 흐리게)
  const mainMonthKey = useMemo(() => {
    const counts = new Map<string, number>();
    for (let i = 0; i < 14; i++) {
      const key = windowStart.add(i, 'day').format('YYYY-MM');
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    let best = windowStart.format('YYYY-MM');
    let bestCount = -1;
    for (const [key, count] of counts) {
      if (count > bestCount) {
        best = key;
        bestCount = count;
      }
    }
    return best;
  }, [windowStart]);

  // 표시 항목: (데모) 챌린지 막대 + 폼에 입력한 세미나/마일스톤
  const items = useMemo<BarItem[]>(() => {
    const challengeItems: BarItem[] = calendarChallengeFixtures.map((c) => ({
      id: c.id,
      title: c.title,
      kind: 'CHALLENGE',
      challengeType: c.challengeType,
      start: dayjs(c.startDate),
      end: dayjs(c.endDate),
    }));
    const eventItems: BarItem[] = events
      .filter((e) => e.date)
      .map((e) => ({
        id: e.id,
        title: e.title || (e.type === 'SEMINAR' ? '세미나' : '마일스톤'),
        kind: e.type,
        start: dayjs(e.date as string),
        end: dayjs(e.date as string),
      }));
    return [...challengeItems, ...eventItems].sort(
      (a, b) => a.start.valueOf() - b.start.valueOf(),
    );
  }, [events]);

  // lane 패킹: 겹치면 다른 줄, 안 겹치면 재사용
  const laneOf = useMemo(() => {
    const laneEnds: Dayjs[] = [];
    const map = new Map<string, number>();
    for (const it of items) {
      let lane = laneEnds.findIndex(
        (end) => it.start.valueOf() > end.valueOf(),
      );
      if (lane === -1) lane = laneEnds.length;
      laneEnds[lane] = it.end;
      map.set(it.id, lane);
    }
    return map;
  }, [items]);

  return {
    windowStart,
    windowEnd: windowStart.add(13, 'day'),
    mainMonthKey,
    weeks,
    items,
    laneOf,
    canPrev,
    canNext,
    goPrev,
    goNext,
  };
}
