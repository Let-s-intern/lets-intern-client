import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { putMock, queryState } = vi.hoisted(() => ({
  putMock: vi.fn(),
  queryState: { data: undefined as number[] | undefined },
}));

vi.mock('./programCategoryApi', () => ({
  putProgramCategoriesOfProgram: putMock,
  useProgramCategoryIdsQuery: () => ({ data: queryState.data }),
}));

import { useProgramCategoryAssign } from './useProgramCategoryAssign';

describe('useProgramCategoryAssign', () => {
  beforeEach(() => {
    putMock.mockReset();
    queryState.data = undefined;
  });

  it('지정 목록을 받기 전에는 저장하지 않는다 (빈 목록으로 덮어쓰기 방지)', async () => {
    const { result } = renderHook(() => useProgramCategoryAssign('LIVE', 7));

    await act(() => result.current.save());

    expect(putMock).not.toHaveBeenCalled();
  });

  it('받은 지정 목록에서 체크를 바꾼 결과를 통째로 보낸다', async () => {
    queryState.data = [1, 2];
    const { result } = renderHook(() =>
      useProgramCategoryAssign('CHALLENGE', 10),
    );

    act(() => result.current.toggle(2));
    act(() => result.current.toggle(3));
    await act(() => result.current.save());

    expect(putMock).toHaveBeenCalledWith({
      programType: 'CHALLENGE',
      programId: 10,
      programCategoryIdList: [1, 3],
    });
  });
});
