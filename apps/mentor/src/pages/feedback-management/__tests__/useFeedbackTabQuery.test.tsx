import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactNode } from 'react';

import { useFeedbackTabQuery } from '../hooks/useFeedbackTabQuery';

const wrapper =
  (initial = '/feedback-management') =>
  ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[initial]}>{children}</MemoryRouter>
  );

describe('useFeedbackTabQuery', () => {
  it('기본값은 all이다', () => {
    const { result } = renderHook(() => useFeedbackTabQuery(), {
      wrapper: wrapper('/feedback-management'),
    });
    expect(result.current[0]).toBe('all');
  });

  it('?tab=written URL은 written으로 복원된다', () => {
    const { result } = renderHook(() => useFeedbackTabQuery(), {
      wrapper: wrapper('/feedback-management?tab=written'),
    });
    expect(result.current[0]).toBe('written');
  });

  it('?tab=live URL은 live로 복원된다', () => {
    const { result } = renderHook(() => useFeedbackTabQuery(), {
      wrapper: wrapper('/feedback-management?tab=live'),
    });
    expect(result.current[0]).toBe('live');
  });

  /*
    탭 키는 FeedbackRow['type'] 과 같은 값을 쓴다. 여기에 키가 없으면 그 행은
    "전체 내역" 에서만 보인다 — 1대1 라이브 멘토링이 그 상태였다(LC-3257).
  */
  it('?tab=live-mentoring URL은 live-mentoring으로 복원된다', () => {
    const { result } = renderHook(() => useFeedbackTabQuery(), {
      wrapper: wrapper('/feedback-management?tab=live-mentoring'),
    });
    expect(result.current[0]).toBe('live-mentoring');
  });

  it('잘못된 ?tab=foo는 all로 폴백한다', () => {
    const { result } = renderHook(() => useFeedbackTabQuery(), {
      wrapper: wrapper('/feedback-management?tab=foo'),
    });
    expect(result.current[0]).toBe('all');
  });

  it('setActiveTab(live) 호출 시 활성 탭이 갱신된다', () => {
    const { result } = renderHook(() => useFeedbackTabQuery(), {
      wrapper: wrapper('/feedback-management'),
    });
    act(() => {
      result.current[1]('live');
    });
    expect(result.current[0]).toBe('live');
  });

  it('setActiveTab(all) 호출 시 query 파라미터가 제거된다', () => {
    const { result } = renderHook(() => useFeedbackTabQuery(), {
      wrapper: wrapper('/feedback-management?tab=live'),
    });
    act(() => {
      result.current[1]('all');
    });
    expect(result.current[0]).toBe('all');
  });
});
