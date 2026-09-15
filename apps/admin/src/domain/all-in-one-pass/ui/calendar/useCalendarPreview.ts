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

interface Params {
  events: PassCalendarEvent[];
  purchaseStartDate?: string | null;
  purchaseEndDate?: string | null;
  passMonths?: number | null;
  open: boolean;
}

export function useCalendarPreview({
  events,
  purchaseStartDate,
  purchaseEndDate,
  passMonths,
  open,
}: Params) {
  // 이동 가능한 월 범위: [구매 시작월] ~ [구매 종료월 + 패스기간]
  const minMonth = purchaseStartDate
    ? dayjs(purchaseStartDate).startOf('month')
    : null;
  const maxMonth = purchaseEndDate
    ? dayjs(purchaseEndDate)
        .add(passMonths ?? 0, 'month')
        .startOf('month')
    : null;
  const clampMonth = (m: Dayjs) => {
    if (minMonth && m.valueOf() < minMonth.valueOf()) return minMonth;
    if (maxMonth && m.valueOf() > maxMonth.valueOf()) return maxMonth;
    return m;
  };
  const initialMonth = () =>
    clampMonth(
      (purchaseStartDate ? dayjs(purchaseStartDate) : dayjs()).startOf('month'),
    );

  const [viewMonth, setViewMonth] = useState<Dayjs>(initialMonth);

  useEffect(() => {
    if (open) setViewMonth(initialMonth());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const canPrev = !minMonth || viewMonth.valueOf() > minMonth.valueOf();
  const canNext = !maxMonth || viewMonth.valueOf() < maxMonth.valueOf();
  const goPrev = () => canPrev && setViewMonth((m) => m.subtract(1, 'month'));
  const goNext = () => canNext && setViewMonth((m) => m.add(1, 'month'));

  const weeks = useMemo(() => {
    const monthStart = viewMonth.startOf('month');
    const offset = (monthStart.day() + 6) % 7; // 월요일 시작 오프셋
    const gridStart = monthStart.subtract(offset, 'day');
    const weekCount = Math.ceil((offset + monthStart.daysInMonth()) / 7);
    return Array.from({ length: weekCount }, (_, w) =>
      Array.from({ length: 7 }, (_, d) => gridStart.add(w * 7 + d, 'day')),
    );
  }, [viewMonth]);

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

  // lane 패킹
  const { laneOf, laneCount } = useMemo(() => {
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
    return { laneOf: map, laneCount: laneEnds.length };
  }, [items]);

  return {
    viewMonth,
    weeks,
    items,
    laneOf,
    laneCount,
    canPrev,
    canNext,
    goPrev,
    goNext,
  };
}
