import { useState } from 'react';
import { addDays, startOfWeek } from 'date-fns';

interface UseWeekNavigationReturn {
  weekStartDate: Date;
  setWeekStartDate: (date: Date) => void;
  goToPrevWeek: () => void;
  goToNextWeek: () => void;
  goToCurrentWeek: () => void;
}

/**
 * Manages week navigation state (current week start, prev/next/today).
 */
export function useWeekNavigation(): UseWeekNavigationReturn {
  const [weekStartDate, setWeekStartDate] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  const goToPrevWeek = () => {
    setWeekStartDate((prev) => addDays(prev, -7));
  };

  const goToNextWeek = () => {
    setWeekStartDate((prev) => addDays(prev, 7));
  };

  const goToCurrentWeek = () => {
    setWeekStartDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  return {
    weekStartDate,
    setWeekStartDate,
    goToPrevWeek,
    goToNextWeek,
    goToCurrentWeek,
  };
}
