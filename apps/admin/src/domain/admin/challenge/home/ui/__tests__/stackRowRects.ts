const ROW_HEIGHT = 40;

/**
 * jsdom 은 레이아웃이 없어 모든 사각형이 0 이다. dnd-kit 키보드 이동은 사각형 위치로
 * 옮길 대상을 찾으므로, li 를 순서대로 세로로 쌓은 사각형을 돌려주게 한다.
 * 반환값을 호출하면 원래대로 돌린다.
 */
export const stackRowRects = () => {
  const original = Element.prototype.getBoundingClientRect;

  Element.prototype.getBoundingClientRect = function (this: Element) {
    const li = this.closest('li');
    const index = li ? Array.from(li.parentElement!.children).indexOf(li) : 0;
    const top = index * ROW_HEIGHT;
    return {
      x: 0,
      y: top,
      top,
      left: 0,
      width: 200,
      height: ROW_HEIGHT,
      right: 200,
      bottom: top + ROW_HEIGHT,
      toJSON: () => ({}),
    } as DOMRect;
  };

  return () => {
    Element.prototype.getBoundingClientRect = original;
  };
};
