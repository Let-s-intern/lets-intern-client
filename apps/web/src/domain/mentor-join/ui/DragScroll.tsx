'use client';

import { useRef, useState, type PointerEvent, type ReactNode } from 'react';

// 가로 스크롤 목록을 마우스로 잡아끌어 넘길 수 있게 한다. 터치·트랙패드는 기본 스크롤 그대로
export function DragScroll({
  className = '',
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  // 끌고 난 직후의 클릭은 링크 이동으로 처리하지 않는다
  const moved = useRef(false);
  const [dragging, setDragging] = useState(false);

  function onPointerDown(e: PointerEvent<HTMLUListElement>) {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !ref.current) return;
    drag.current = { x: e.clientX, left: ref.current.scrollLeft };
    moved.current = false;
  }

  function onPointerMove(e: PointerEvent<HTMLUListElement>) {
    if (!drag.current || !ref.current) return;
    const dx = e.clientX - drag.current.x;
    // 몇 px 움직이기 전까지는 클릭으로 본다
    if (!moved.current) {
      if (Math.abs(dx) < 5) return;
      moved.current = true;
      ref.current.setPointerCapture(e.pointerId);
      setDragging(true);
    }
    ref.current.scrollLeft = drag.current.left - dx;
  }

  function endDrag() {
    drag.current = null;
    setDragging(false);
  }

  return (
    <ul
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={(e) => {
        if (moved.current) e.preventDefault();
        moved.current = false;
      }}
      // 끄는 동안에는 스냅을 꺼야 움직임이 끊기지 않는다. 놓으면 가까운 카드로 스냅
      className={`${className} ${dragging ? 'cursor-grabbing select-none snap-none' : 'cursor-grab snap-x snap-mandatory'}`}
    >
      {children}
    </ul>
  );
}
