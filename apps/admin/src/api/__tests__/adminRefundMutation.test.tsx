import { UseUserDetailAdminQueryKey } from '@/api/user/user';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useAdminRefundMutation } from '../adminRefund';

const post = vi.hoisted(() => vi.fn());
vi.mock('@/utils/axios', () => ({ default: { post } }));
vi.mock('@/utils/axiosV2', () => ({ default: {} }));

describe('useAdminRefundMutation', () => {
  it('환불에 성공하면 유저 상세 쿼리를 무효화한다', async () => {
    post.mockResolvedValue({ data: { data: { refundedAmount: 1000 } } });
    const queryClient = new QueryClient();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAdminRefundMutation(), { wrapper });
    result.current.mutate({
      applicationId: 5,
      body: { managerName: '담당', reason: '사유', sendNotification: false },
    });

    await waitFor(() =>
      expect(invalidate).toHaveBeenCalledWith({
        queryKey: [UseUserDetailAdminQueryKey],
      }),
    );
    expect(post).toHaveBeenCalledWith('/admin/application/5/refund', {
      managerName: '담당',
      reason: '사유',
      sendNotification: false,
    });
  });
});
