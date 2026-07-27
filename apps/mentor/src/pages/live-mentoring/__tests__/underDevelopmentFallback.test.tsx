import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import axios from '@/utils/axios';
import DetailSettingsPage from '../detail-settings/DetailSettingsPage';
import SettlementPage from '../settlement/SettlementPage';

vi.mock('@/utils/axios', () => ({
  default: { get: vi.fn(), put: vi.fn() },
}));

const axiosGet = vi.mocked(axios.get);

function renderPage(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
}

/** MSW 핸들러가 돌려주는 것과 같은 형태의 정산 응답. */
const settlementResponse = {
  data: {
    data: {
      settlementList: [
        {
          period: '2026-07',
          completedCount: 3,
          grossAmount: 105000,
          status: 'PENDING',
        },
      ],
      itemList: [],
    },
  },
};

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

  it('정산 현황 — 조회에 실패하면 빈 표 대신 개발 중 안내를 노출한다', async () => {
    axiosGet.mockRejectedValue(new Error('404'));

    renderPage(<SettlementPage />);

    await waitFor(() =>
      expect(screen.getByText('개발 중인 페이지입니다.')).toBeInTheDocument(),
    );
    expect(screen.getByText('담당자 임성빈')).toBeInTheDocument();
    expect(screen.queryByText('기간별 합계')).not.toBeInTheDocument();
  });

  it('정산 현황 — 목 데이터가 내려오면 안내 대신 실제 표를 렌더한다', async () => {
    axiosGet.mockResolvedValue(settlementResponse);

    renderPage(<SettlementPage />);

    // '기간별 합계'는 로딩 중에도 있는 정적 제목이라, 실제 행이 그려질 때까지 기다린다
    await waitFor(() =>
      expect(screen.getByText('정산 예정')).toBeInTheDocument(),
    );
    expect(screen.getByText('기간별 합계')).toBeInTheDocument();
    expect(
      screen.queryByText('개발 중인 페이지입니다.'),
    ).not.toBeInTheDocument();
  });
});
