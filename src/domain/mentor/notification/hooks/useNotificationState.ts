import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'mentor_read_notice_ids';

function getReadIds(): number[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function setReadIds(ids: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

/** 공지 읽음/안읽음 상태를 localStorage로 관리 */
export function useNotificationState() {
  const [readIds, setReadIdsState] = useState<number[]>([]);

  useEffect(() => {
    setReadIdsState(getReadIds());
  }, []);

  const markAsRead = useCallback((noticeId: number) => {
    setReadIdsState((prev) => {
      if (prev.includes(noticeId)) return prev;
      const next = [...prev, noticeId];
      setReadIds(next);
      return next;
    });
  }, []);

  const isRead = useCallback(
    (noticeId: number) => readIds.includes(noticeId),
    [readIds],
  );

  return { readIds, markAsRead, isRead };
}
