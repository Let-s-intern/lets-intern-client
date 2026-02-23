import { useCallback, useEffect, useRef, useState } from 'react';

import {
  calculateCenterScrollLeft,
  calculateItemStyle,
  type CarouselItemStyle,
  findClosestItemIndex,
  getContainerMetrics,
  getItemMetrics,
} from '../model/carouselAnimation';

interface UseInfiniteCarouselOptions<T> {
  items: T[];
  repeatCount?: number;
}

export function useInfiniteCarousel<T>({
  items,
  repeatCount = 31,
}: UseInfiniteCarouselOptions<T>) {
  const totalItems = items.length;
  const infiniteItems = Array(repeatCount).fill(items).flat() as T[];

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [, setScrollTrigger] = useState(0);

  const setItemRef = useCallback((index: number, el: HTMLDivElement | null) => {
    itemRefs.current[index] = el;
  }, []);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const target = itemRefs.current[index];
      const container = scrollContainerRef.current;
      if (!target || !container) return;

      container.scrollTo({
        left: calculateCenterScrollLeft(container, target),
        behavior,
      });
    },
    [],
  );

  const handleNavigation = useCallback(
    (direction: 'left' | 'right') => {
      const newIndex = activeIndex + (direction === 'right' ? 1 : -1);
      setActiveIndex(newIndex);
      scrollToIndex(newIndex);
    },
    [activeIndex, scrollToIndex],
  );

  const scrollToAndActivate = useCallback(
    (index: number) => {
      setActiveIndex(index);
      scrollToIndex(index);
    },
    [scrollToIndex],
  );

  const getItemStyle = useCallback((index: number): CarouselItemStyle => {
    const container = scrollContainerRef.current;
    const item = itemRefs.current[index];
    if (!container || !item) return { opacity: 0, scale: 0.85 };

    return calculateItemStyle(
      getContainerMetrics(container.getBoundingClientRect()),
      getItemMetrics(item.getBoundingClientRect()),
    );
  }, []);

  // 초기 중앙 위치로 스크롤
  useEffect(() => {
    const middleSet = Math.floor(repeatCount / 2);
    const initialIndex = middleSet * totalItems;
    setActiveIndex(initialIndex);
    setTimeout(() => {
      scrollToIndex(initialIndex);
    }, 100);
  }, [totalItems, repeatCount, scrollToIndex]);

  // 스크롤 이벤트 감지하여 activeIndex 업데이트 및 무한 스크롤 처리
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let isRelocating = false;

    const handleScroll = () => {
      if (isRelocating) return;

      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      const closestIndex = findClosestItemIndex(
        containerCenter,
        itemRefs.current,
      );

      setActiveIndex(closestIndex);
      setScrollTrigger((prev) => prev + 1);

      // 경계에 가까워지면 중간으로 순간 이동
      const safeZoneStart = totalItems * 3;
      const safeZoneEnd = totalItems * (repeatCount - 3);

      if (closestIndex < safeZoneStart) {
        const equivalentIndex =
          closestIndex + totalItems * Math.floor(repeatCount / 2);
        const targetRef = itemRefs.current[equivalentIndex];
        if (targetRef) {
          isRelocating = true;
          container.scrollTo({
            left: calculateCenterScrollLeft(container, targetRef),
            behavior: 'auto',
          });
          setActiveIndex(equivalentIndex);
          setTimeout(() => {
            isRelocating = false;
          }, 100);
        }
      } else if (closestIndex >= safeZoneEnd) {
        const offsetInSet = closestIndex % totalItems;
        const equivalentIndex =
          totalItems * Math.floor(repeatCount / 2) + offsetInSet;
        const targetRef = itemRefs.current[equivalentIndex];
        if (targetRef) {
          isRelocating = true;
          container.scrollTo({
            left: calculateCenterScrollLeft(container, targetRef),
            behavior: 'auto',
          });
          setActiveIndex(equivalentIndex);
          setTimeout(() => {
            isRelocating = false;
          }, 100);
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [totalItems, repeatCount]);

  return {
    infiniteItems,
    scrollContainerRef,
    setItemRef,
    activeIndex,
    handleNavigation,
    getItemStyle,
    scrollToAndActivate,
  };
}
