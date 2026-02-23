export interface CarouselItemStyle {
  opacity: number;
  scale: number;
}

interface ContainerMetrics {
  left: number;
  right: number;
  width: number;
  center: number;
}

interface ItemMetrics {
  left: number;
  right: number;
  center: number;
}

export function getContainerMetrics(rect: DOMRect): ContainerMetrics {
  return {
    left: rect.left,
    right: rect.right,
    width: rect.width,
    center: rect.left + rect.width / 2,
  };
}

export function getItemMetrics(rect: DOMRect): ItemMetrics {
  return {
    left: rect.left,
    right: rect.right,
    center: rect.left + rect.width / 2,
  };
}

/**
 * 중앙에서의 거리에 따른 투명도와 크기 계산 (양방향 그라데이션)
 */
export function calculateItemStyle(
  container: ContainerMetrics,
  item: ItemMetrics,
): CarouselItemStyle {
  const distanceFromCenter = item.center - container.center;
  const absDistance = Math.abs(distanceFromCenter);

  let opacity = 1.0;
  let scale = 1.0;

  if (absDistance < 50) {
    // 중앙 카드 (거의 중앙)
    return { opacity: 1.0, scale: 1.0 };
  }

  const halfScreenWidth = container.width * 0.5;

  if (absDistance < halfScreenWidth * 0.5) {
    // 중앙에서 화면의 25% 이내 - 선명하게 유지
    opacity = 1.0;
    scale = 1.0;
  } else if (absDistance < halfScreenWidth) {
    // 중앙에서 25%~50% 사이 - 급격하게 페이드
    const fadeProgress =
      (absDistance - halfScreenWidth * 0.5) / (halfScreenWidth * 0.5);
    opacity = Math.max(0, 1 - Math.pow(fadeProgress, 1.8));
    scale = Math.max(0.85, 1 - fadeProgress * 0.15);
  } else {
    // 중앙에서 50% 이상 - 거의 보이지 않음
    opacity = 0;
    scale = 0.85;
  }

  // 양옆 끝에서 추가 페이드 (화면 끝에 가까울수록)
  const edgeFadeZone = container.width * 0.25;

  if (distanceFromCenter < 0) {
    // 왼쪽 카드
    const distanceFromLeftEdge = item.right - container.left;
    if (distanceFromLeftEdge < edgeFadeZone) {
      opacity = Math.min(
        opacity,
        Math.max(0, distanceFromLeftEdge / edgeFadeZone),
      );
    }
  } else {
    // 오른쪽 카드
    const distanceFromRightEdge = container.right - item.left;
    if (distanceFromRightEdge < edgeFadeZone) {
      opacity = Math.min(
        opacity,
        Math.max(0, distanceFromRightEdge / edgeFadeZone),
      );
    }
  }

  return { opacity, scale };
}

/**
 * 스크롤 컨테이너 중앙에 가장 가까운 아이템의 인덱스를 찾음
 */
export function findClosestItemIndex(
  containerCenter: number,
  items: (HTMLElement | null)[],
): number {
  let closestIndex = 0;
  let closestDistance = Infinity;

  items.forEach((item, index) => {
    if (item) {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2;
      const distance = Math.abs(containerCenter - itemCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    }
  });

  return closestIndex;
}

/**
 * 아이템을 컨테이너 중앙에 위치시키기 위한 scrollLeft 값 계산
 */
export function calculateCenterScrollLeft(
  container: HTMLElement,
  target: HTMLElement,
): number {
  const containerRect = container.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  return (
    targetRect.left -
    containerRect.left +
    container.scrollLeft -
    (containerRect.width - targetRect.width) / 2
  );
}
