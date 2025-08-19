import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';

const NEW_BADGE_DURATION_DAYS = 3;

export const useReadItems = (storageKey: string) => {
  const [readItems, setReadItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const savedReadItems = localStorage.getItem(storageKey);
      if (savedReadItems) {
        const parsedItems = JSON.parse(savedReadItems);
        setReadItems(new Set(parsedItems));
      }
    } catch (error) {
      throw error;
    }
  }, [storageKey]);

  const markAsRead = useCallback(
    (itemId: number) => {
      setReadItems((prev) => {
        const newReadItems = new Set(prev);
        newReadItems.add(itemId);
        try {
          localStorage.setItem(
            storageKey,
            JSON.stringify(Array.from(newReadItems)),
          );
        } catch (error) {
          throw error;
        }
        return newReadItems;
      });
    },
    [storageKey],
  );

  const isRead = useCallback(
    (itemId: number) => {
      return readItems.has(itemId);
    },
    [readItems],
  );

  const isNewItem = useCallback(
    (createDate: dayjs.Dayjs | Date | string | null, itemId: number) => {
      if (!createDate) return false;
      const isWithinDuration =
        dayjs().diff(dayjs(createDate), 'day') < NEW_BADGE_DURATION_DAYS;
      const isNotRead = !readItems.has(itemId);
      return isWithinDuration && isNotRead;
    },
    [readItems],
  );

  return {
    readItems,
    markAsRead,
    isRead,
    isNewItem,
  };
};

export const useReadNotices = () => useReadItems('readNotices');
export const useReadGuides = () => useReadItems('readGuides');
