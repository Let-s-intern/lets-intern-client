/**
 * @jest-environment jsdom
 */
// `@/utils/axios`·`axiosV2` 는 packages/api 의 import.meta 때문에 jest 가 파싱하지 못한다. 목으로 막는다.
const mockPost = jest.fn();
jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { post: (...args: unknown[]) => mockPost(...args) },
}));
jest.mock('@/utils/axiosV2', () => ({ __esModule: true, default: {} }));

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { AxiosError, AxiosHeaders } from 'axios';
import { ReactNode } from 'react';
import { usePostTalentPoolAttendanceMutation } from './mission';

const axiosError = (status: number, data: unknown) =>
  new AxiosError('Request failed', String(status), undefined, null, {
    status,
    statusText: '',
    data,
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() },
  });

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

// LC-3552 — 0회차를 내지 않고 인재풀을 제출하면 서버가 400 으로 거절한다.
// 그 사유는 이 훅의 onError 가 alert 로 보여준다. 제출 섹션의 catch 는 console.error 만 하므로
// 사유 alert 는 여기 한 번이다. 섹션에서 다시 alert 하면 두 번 뜬다.
describe('usePostTalentPoolAttendanceMutation', () => {
  it('서버가 거절하면 서버 사유를 한 번 alert 한다', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    mockPost.mockRejectedValueOnce(
      axiosError(400, {
        status: 400,
        code: 'ATTENDANCE_OT_REQUIRED',
        message: 'OT를 먼저 완료해주세요',
      }),
    );
    const { result } = renderHook(usePostTalentPoolAttendanceMutation, {
      wrapper,
    });

    await act(async () => {
      await expect(
        result.current.mutateAsync({ missionId: 99, req: [] }),
      ).rejects.toThrow();
    });

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith(
      '인재풀 제출에 실패했습니다: OT를 먼저 완료해주세요',
    );
    alertSpy.mockRestore();
  });
});
