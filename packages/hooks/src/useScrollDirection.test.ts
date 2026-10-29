import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import useScrollDirection from './useScrollDirection';

const scrollTo = (y: number) => {
  act(() => {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
    window.dispatchEvent(new Event('scroll'));
  });
};

describe('useScrollDirection', () => {
  afterEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it.each(['/mentor-join', '/mentor-apply', '/mentor-apply/status'])(
    '%s 에서는 아래로 스크롤하면 DOWN, 위로 올리면 UP 이다',
    (pathname) => {
      const { result } = renderHook(() => useScrollDirection(pathname));

      scrollTo(300);
      expect(result.current).toBe('DOWN');

      scrollTo(100);
      expect(result.current).toBe('UP');
    },
  );

  it('목록에 없는 경로는 스크롤해도 UP 그대로다', () => {
    const { result } = renderHook(() => useScrollDirection('/mypage'));

    scrollTo(300);
    expect(result.current).toBe('UP');
  });
});
