import { arrayMove } from '@dnd-kit/sortable';

/**
 * activeId 항목을 overId 항목의 자리로 옮긴 새 배열을 돌려준다.
 * 같은 항목에 놓았거나 id 가 목록에 없으면 null (저장할 변경이 없다).
 */
export const moveItemById = <T extends { id?: number }>(
  items: T[],
  activeId: number,
  overId: number,
): T[] | null => {
  if (activeId === overId) return null;

  const from = items.findIndex((item) => item.id === activeId);
  const to = items.findIndex((item) => item.id === overId);
  if (from === -1 || to === -1) return null;

  return arrayMove(items, from, to);
};
