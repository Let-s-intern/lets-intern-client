import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readGridState, usePersistedGridState } from '../usePersistedGridState';

const KEY = 'test:grid-state';

const makeApiRef = (state: Record<string, unknown>) =>
  ({ current: { exportState: () => state } }) as never;

describe('usePersistedGridState', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('정렬·필터·열 상태는 저장하고 페이지와 열린 메뉴는 뺀다', () => {
    const apiRef = makeApiRef({
      sorting: { sortModel: [{ field: 'createdAt', sort: 'desc' }] },
      filter: { filterModel: { items: [] } },
      columns: { dimensions: { title: { width: 420 } } },
      pagination: { paginationModel: { page: 3, pageSize: 50 } },
      preferencePanel: { open: true },
    });
    const { result } = renderHook(() => usePersistedGridState(KEY, apiRef));

    act(() => {
      result.current.saveLater();
      vi.runAllTimers();
    });

    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({
      sorting: { sortModel: [{ field: 'createdAt', sort: 'desc' }] },
      filter: { filterModel: { items: [] } },
      columns: { dimensions: { title: { width: 420 } } },
    });
  });

  it('새로고침(beforeunload) 때도 저장한다', () => {
    const apiRef = makeApiRef({ sorting: { sortModel: [] } });
    renderHook(() => usePersistedGridState(KEY, apiRef));

    window.dispatchEvent(new Event('beforeunload'));

    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({
      sorting: { sortModel: [] },
    });
  });

  it('저장된 상태를 initialState 로 돌려준다', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ columns: { dimensions: { title: { width: 300 } } } }),
    );
    const { result } = renderHook(() =>
      usePersistedGridState(KEY, makeApiRef({})),
    );

    expect(result.current.initialState).toEqual({
      columns: { dimensions: { title: { width: 300 } } },
    });
  });
});

describe('readGridState', () => {
  beforeEach(() => localStorage.clear());

  it('저장된 값이 없으면 undefined', () => {
    expect(readGridState(KEY)).toBeUndefined();
  });

  it('깨진 값이면 무시하고 undefined', () => {
    localStorage.setItem(KEY, '{not json');
    expect(readGridState(KEY)).toBeUndefined();
  });
});
