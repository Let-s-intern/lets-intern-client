import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminSnackbarProvider } from '@/hooks/useAdminSnackbar';

const get = vi.fn();
const put = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
    put: (...args: unknown[]) => put(...args),
  },
}));

import VodPassSaleToggle from './VodPassSaleToggle';

const mockSale = (programs: { programType: string; programId: number }[]) =>
  get.mockResolvedValue({ data: { data: { programs } } });

const renderToggle = (passId = 3) =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <AdminSnackbarProvider>
        <VodPassSaleToggle passId={passId} />
      </AdminSnackbarProvider>
    </QueryClientProvider>,
  );

const toggle = () =>
  screen.getByRole('checkbox', { name: 'VOD 옵션 추가결제' });

beforeEach(() => {
  get.mockReset();
  put.mockReset();
  put.mockResolvedValue({ data: {} });
});

describe('올인원패스 VOD 옵션 추가결제 토글', () => {
  it('이 패스의 판매가 켜져 있으면 켜진 상태로 보인다', async () => {
    mockSale([{ programType: 'MEMBERSHIP', programId: 3 }]);

    renderToggle();

    await waitFor(() => expect(toggle()).toBeChecked());
  });

  it('같은 id 의 다른 유형이 켜져 있어도 이 패스는 꺼짐이다', async () => {
    mockSale([{ programType: 'CHALLENGE', programId: 3 }]);

    renderToggle();

    await waitFor(() => expect(toggle()).toBeEnabled());
    expect(toggle()).not.toBeChecked();
  });

  it('켜면 MEMBERSHIP 유형과 패스 id 로 켜기 요청을 보낸다', async () => {
    const user = userEvent.setup();
    mockSale([]);

    renderToggle();
    await waitFor(() => expect(toggle()).toBeEnabled());
    await user.click(toggle());

    await waitFor(() =>
      expect(put).toHaveBeenCalledWith('/admin/vod-pass-sale', {
        programType: 'MEMBERSHIP',
        programId: 3,
        enabled: true,
      }),
    );
  });

  it('끄면 끄기 요청을 보낸다', async () => {
    const user = userEvent.setup();
    mockSale([{ programType: 'MEMBERSHIP', programId: 3 }]);

    renderToggle();
    await waitFor(() => expect(toggle()).toBeChecked());
    await user.click(toggle());

    await waitFor(() =>
      expect(put).toHaveBeenCalledWith('/admin/vod-pass-sale', {
        programType: 'MEMBERSHIP',
        programId: 3,
        enabled: false,
      }),
    );
  });

  it('저장에 실패하면 서버 메시지를 스낵바로 알린다', async () => {
    const user = userEvent.setup();
    mockSale([]);
    put.mockRejectedValue(new Error('판매 대상이 아닙니다.'));

    renderToggle();
    await waitFor(() => expect(toggle()).toBeEnabled());
    await user.click(toggle());

    expect(
      await screen.findByText('판매 대상이 아닙니다.'),
    ).toBeInTheDocument();
  });
});
