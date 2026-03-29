import { useCallback, useMemo } from 'react';

interface AttendanceItem {
  id: number | null;
}

interface UseMenteeNavigationParams {
  attendanceList: AttendanceItem[];
  selectedAttendanceId: number | null;
  onSelectMentee: (attendanceId: number) => void;
}

interface UseMenteeNavigationReturn {
  currentMenteeIndex: number;
  hasPrevMentee: boolean;
  hasNextMentee: boolean;
  handlePrevMentee: () => void;
  handleNextMentee: () => void;
}

/**
 * Handles prev/next mentee navigation within an attendance list.
 */
export function useMenteeNavigation({
  attendanceList,
  selectedAttendanceId,
  onSelectMentee,
}: UseMenteeNavigationParams): UseMenteeNavigationReturn {
  const currentMenteeIndex = useMemo(
    () => attendanceList.findIndex((a) => a.id === selectedAttendanceId),
    [attendanceList, selectedAttendanceId],
  );

  const hasPrevMentee = currentMenteeIndex > 0;
  const hasNextMentee =
    currentMenteeIndex >= 0 &&
    currentMenteeIndex < attendanceList.length - 1;

  const handlePrevMentee = useCallback(() => {
    const prevId = attendanceList[currentMenteeIndex - 1]?.id;
    if (prevId != null) onSelectMentee(prevId);
  }, [currentMenteeIndex, attendanceList, onSelectMentee]);

  const handleNextMentee = useCallback(() => {
    const nextId = attendanceList[currentMenteeIndex + 1]?.id;
    if (nextId != null) onSelectMentee(nextId);
  }, [currentMenteeIndex, attendanceList, onSelectMentee]);

  return {
    currentMenteeIndex,
    hasPrevMentee,
    hasNextMentee,
    handlePrevMentee,
    handleNextMentee,
  };
}
