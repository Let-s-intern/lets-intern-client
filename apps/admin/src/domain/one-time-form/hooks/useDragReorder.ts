import { type DragEvent, useRef } from 'react';

/**
 * HTML5 드래그로 목록 순서를 바꾼다. 손잡이에 `getHandleProps`, 놓을 자리에 `getDropProps` 를 붙인다.
 * 손잡이만 끌 수 있게 해서 입력 칸의 글자 선택과 겹치지 않게 한다.
 */
export const useDragReorder = (onMove: (from: number, to: number) => void) => {
  const dragIndex = useRef<number | null>(null);

  const getHandleProps = (index: number) => ({
    draggable: true,
    onDragStart: (e: DragEvent) => {
      dragIndex.current = index;
      e.dataTransfer.effectAllowed = 'move';
      // 파이어폭스는 데이터가 없으면 드래그를 시작하지 않는다
      e.dataTransfer.setData('text/plain', String(index));
    },
    onDragEnd: () => {
      dragIndex.current = null;
    },
  });

  const getDropProps = (index: number) => ({
    onDragOver: (e: DragEvent) => {
      if (dragIndex.current === null) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    },
    onDrop: (e: DragEvent) => {
      if (dragIndex.current === null) return;
      e.preventDefault();
      e.stopPropagation();
      onMove(dragIndex.current, index);
      dragIndex.current = null;
    },
  });

  return { getHandleProps, getDropProps };
};
