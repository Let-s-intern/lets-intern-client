/// <reference types="vitest/globals" />
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/utils/axios', () => {
  const get = vi.fn();
  return { default: { get, post: vi.fn(), patch: vi.fn(), delete: vi.fn() } };
});
vi.mock('@/utils/auth', () => ({
  getAuthHeader: () => ({}),
  logoutAndRefreshPage: () => {},
}));

import axios from '@/utils/axios';
import ApplicantsTab from '../ApplicantsTab';

const get = axios.get as unknown as ReturnType<typeof vi.fn>;

function renderWithClient(node: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{node}</QueryClientProvider>,
  );
}

describe('ApplicantsTab', () => {
  beforeEach(() => {
    get.mockReset();
  });

  it('신청자 목록 행을 렌더한다', async () => {
    get.mockResolvedValue({
      data: {
        data: {
          applicationList: [
            {
              applicationId: 1,
              name: '홍길동',
              email: 'hong@example.com',
              phoneNumber: '010-1111-2222',
              createDate: '2026-05-01',
              isConfirmed: true,
            },
            {
              applicationId: 2,
              name: '김영희',
              email: 'kim@example.com',
              phoneNumber: '010-3333-4444',
              createDate: '2026-05-02',
              isConfirmed: false,
            },
          ],
        },
      },
    });

    renderWithClient(<ApplicantsTab liveId={11} />);

    expect(await screen.findByText('홍길동')).toBeInTheDocument();
    expect(screen.getByText('hong@example.com')).toBeInTheDocument();
    expect(screen.getByText('010-1111-2222')).toBeInTheDocument();
    expect(screen.getByText('결제완료')).toBeInTheDocument();
    expect(screen.getByText('김영희')).toBeInTheDocument();
    expect(screen.getByText('대기')).toBeInTheDocument();
    expect(get).toHaveBeenCalledWith('/live/11/applications');
  });

  it('빈 응답일 때 안내 문구를 표시한다', async () => {
    get.mockResolvedValue({ data: { data: { applicationList: [] } } });
    renderWithClient(<ApplicantsTab liveId={12} />);

    expect(await screen.findByText('신청자가 없습니다.')).toBeInTheDocument();
  });

  it('20건 초과 시 페이지네이션 컨트롤을 노출한다', async () => {
    const list = Array.from({ length: 25 }, (_, i) => ({
      applicationId: i + 1,
      name: `사용자${i + 1}`,
      email: `user${i + 1}@example.com`,
    }));
    get.mockResolvedValue({ data: { data: { applicationList: list } } });

    renderWithClient(<ApplicantsTab liveId={13} />);

    expect(await screen.findByText('사용자1')).toBeInTheDocument();
    expect(screen.queryByText('사용자21')).not.toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '다음' }));

    expect(screen.getByText('사용자21')).toBeInTheDocument();
    expect(screen.queryByText('사용자1')).not.toBeInTheDocument();
  });
});
