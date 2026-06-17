import { useCallback, useMemo } from 'react';

interface UseMenteeNavigationParams {
  listLength: number;
  selectedIndex: number;
  onSelectByIndex: (index: number) => void;
}

interface UseMenteeNavigationReturn {
  hasPrevMentee: boolean;
  hasNextMentee: boolean;
  handlePrevMentee: () => void;
  handleNextMentee: () => void;
}

/**
 * Handles prev/next mentee navigation by index.
 */
export function useMenteeNavigation({
  listLength,
  selectedIndex,
  onSelectByIndex,
}: UseMenteeNavigationParams): UseMenteeNavigationReturn {
  const hasPrevMentee = selectedIndex > 0;
  const hasNextMentee = selectedIndex >= 0 && selectedIndex < listLength - 1;

  const handlePrevMentee = useCallback(() => {
    if (hasPrevMentee) onSelectByIndex(selectedIndex - 1);
  }, [hasPrevMentee, selectedIndex, onSelectByIndex]);

  const handleNextMentee = useCallback(() => {
    if (hasNextMentee) onSelectByIndex(selectedIndex + 1);
  }, [hasNextMentee, selectedIndex, onSelectByIndex]);

  return {
    hasPrevMentee,
    hasNextMentee,
    handlePrevMentee,
    handleNextMentee,
  };
}
