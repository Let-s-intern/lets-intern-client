import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ChallengeOperationOnboarding from './ChallengeOperationOnboarding';

const axiosGet = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: { get: (...args: unknown[]) => axiosGet(...args) },
}));

const challenge = (id: number) => ({
  id,
  title: `챌린지 ${id}`,
  startDate: '2026-01-05T00:00:00',
  endDate: '2026-02-01T23:59:59',
  beginning: '2025-12-01T00:00:00',
  deadline: '2026-01-04T23:59:59',
  createDate: '2025-11-01T00:00:00',
});

const Landed = () => <p data-testid="landed">{useLocation().pathname}</p>;

const renderAt = (entry: string) =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route
            path="/challenge/operation"
            element={<ChallengeOperationOnboarding />}
          />
          <Route
            path="/challenge/operation/:programId/*"
            element={<Landed />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

beforeEach(() => {
  axiosGet.mockResolvedValue({
    data: {
      data: {
        programList: [challenge(31), challenge(30)],
        pageInfo: {
          pageNum: 1,
          pageSize: 1000,
          totalElements: 2,
          totalPages: 1,
        },
      },
    },
  });
});

describe('챌린지 운영 첫 화면', () => {
  it('?tab= 이 운영 탭이면 첫 챌린지의 그 탭으로 보낸다', async () => {
    renderAt('/challenge/operation?tab=attendances');
    expect(await screen.findByTestId('landed')).toHaveTextContent(
      '/challenge/operation/31/attendances',
    );
  });

  it.each([
    ['tab 이 없으면', '/challenge/operation'],
    ['모르는 tab 이면', '/challenge/operation?tab=nope'],
  ])('%s 지금처럼 홈으로 보낸다', async (_, entry) => {
    renderAt(entry);
    expect(await screen.findByTestId('landed')).toHaveTextContent(
      '/challenge/operation/31/home',
    );
  });
});
