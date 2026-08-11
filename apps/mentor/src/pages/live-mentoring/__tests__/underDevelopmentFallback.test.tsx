import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import axios from '@/utils/axios';
import DetailSettingsPage from '../detail-settings/DetailSettingsPage';

vi.mock('@/utils/axios', () => ({
  default: { get: vi.fn(), put: vi.fn() },
}));

const axiosGet = vi.mocked(axios.get);

function renderPage(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  axiosGet.mockReset();
});

describe('백엔드 미구현 화면의 개발 중 안내', () => {
  it('상세 페이지 설정 — 조회에 실패하면 담당자와 함께 개발 중 안내를 노출한다', async () => {
    axiosGet.mockRejectedValue(new Error('404'));

    renderPage(<DetailSettingsPage />);

    await waitFor(() =>
      expect(screen.getByText('개발 중인 페이지입니다.')).toBeInTheDocument(),
    );
    expect(screen.getByText('담당자 임성빈')).toBeInTheDocument();
    // 페이지 제목은 유지해 어느 화면인지 알 수 있게 한다
    expect(screen.getByText('상세 페이지 설정')).toBeInTheDocument();
  });
});
