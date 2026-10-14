'use client';

// 캘린더 렌더 모델 Context — 리프에 파생값·선택일 전달(prop drilling 제거)
import { createContext, useContext } from 'react';
import type { NormalizedCalendarEvent } from '../../../types';
import type { PointPlacement } from './calendarModel';
import type { Day } from './calendarUtils';
export interface CalendarRenderModel {
  bars: NormalizedCalendarEvent[];
  barLaneOf: Map<number, number>;
  pointsByDate: Map<string, PointPlacement[]>;
  badgeByDate: Map<string, number>;
  today: Day;
  selected: Day;
  onSelect: (d: Day) => void;
  mainMonthKey: string;
  periodStart?: string;
  periodEnd?: string;
}

const CalendarContext = createContext<CalendarRenderModel | null>(null);

export const CalendarProvider = CalendarContext.Provider;

export function useCalendarRender(): CalendarRenderModel {
  const ctx = useContext(CalendarContext);
  if (!ctx) {
    throw new Error('useCalendarRender must be used within <CalendarProvider>');
  }
  return ctx;
}
