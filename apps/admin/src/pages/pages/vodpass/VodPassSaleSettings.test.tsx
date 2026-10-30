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

import VodPassSaleSettings from './VodPassSaleSettings';

const program = (
  id: number,
  programType: string,
  title: string,
  programStatusType = 'PROCEEDING',
) => ({
  programInfo: { id, programType, programStatusType, title },
  classificationList: [],
});

const mockApi = (enabled: { programType: string; programId: number }[]) => {
  get.mockImplementation((url: string) => {
    if (url === '/program/admin') {
      return Promise.resolve({
        data: {
          data: {
            programList: [
              program(31, 'CHALLENGE', '자소서 챌린지 31기'),
              program(5, 'LIVE', '면접 라이브'),
              program(9, 'VOD_PASS', 'VOD 이용권 상품'),
              program(30, 'CHALLENGE', '지난 챌린지 30기', 'POST'),
              program(32, 'CHALLENGE', '다음 챌린지 32기', 'PREV'),
            ],
            pageInfo: {
              pageNum: 0,
              pageSize: 1000,
              totalElements: 5,
              totalPages: 1,
            },
          },
        },
      });
    }
    return Promise.resolve({ data: { data: { programs: enabled } } });
  });
};

const renderPage = () =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <AdminSnackbarProvider>
        <VodPassSaleSettings />
      </AdminSnackbarProvider>
    </QueryClientProvider>,
  );

const saleSwitch = (title: string) =>
  screen.getByRole('checkbox', { name: `${title} VOD 이용권 판매` });

beforeEach(() => {
  get.mockReset();
  put.mockReset();
  put.mockResolvedValue({ data: {} });
});

describe('VOD 이용권 판매 설정', () => {
  it('프로그램마다 판매 여부를 보여주고 기본은 꺼짐이다', async () => {
    mockApi([{ programType: 'CHALLENGE', programId: 31 }]);

    renderPage();

    expect(await screen.findByText('자소서 챌린지 31기')).toBeInTheDocument();
    expect(saleSwitch('자소서 챌린지 31기')).toBeChecked();
    expect(saleSwitch('면접 라이브')).not.toBeChecked();
  });

  it('모집 마감 프로그램은 보이지 않고 모집 전, 모집 중만 보인다', async () => {
    mockApi([{ programType: 'CHALLENGE', programId: 30 }]);

    renderPage();

    expect(await screen.findByText('자소서 챌린지 31기')).toBeInTheDocument();
    expect(screen.getByText('다음 챌린지 32기')).toBeInTheDocument();
    expect(screen.getByText('모집 전')).toBeInTheDocument();
    expect(screen.queryByText('지난 챌린지 30기')).not.toBeInTheDocument();
    expect(screen.queryByText('모집 마감')).not.toBeInTheDocument();
  });

  it('판매 대상이 아닌 유형은 목록에 보이지 않는다', async () => {
    mockApi([]);

    renderPage();

    await screen.findByText('자소서 챌린지 31기');
    expect(screen.queryByText('VOD 이용권 상품')).not.toBeInTheDocument();
  });

  it('스위치를 켜면 유형과 id 로 켜기 요청을 보낸다', async () => {
    const user = userEvent.setup();
    mockApi([]);

    renderPage();
    await screen.findByText('면접 라이브');
    await user.click(saleSwitch('면접 라이브'));

    await waitFor(() =>
      expect(put).toHaveBeenCalledWith('/admin/vod-pass-sale', {
        programType: 'LIVE',
        programId: 5,
        enabled: true,
      }),
    );
  });

  it('켜진 스위치를 끄면 끄기 요청을 보낸다', async () => {
    const user = userEvent.setup();
    mockApi([{ programType: 'CHALLENGE', programId: 31 }]);

    renderPage();
    await screen.findByText('자소서 챌린지 31기');
    await user.click(saleSwitch('자소서 챌린지 31기'));

    await waitFor(() =>
      expect(put).toHaveBeenCalledWith('/admin/vod-pass-sale', {
        programType: 'CHALLENGE',
        programId: 31,
        enabled: false,
      }),
    );
  });

  it('유형 필터로 해당 유형만 남긴다', async () => {
    const user = userEvent.setup();
    mockApi([]);

    renderPage();
    await screen.findByText('면접 라이브');
    await user.selectOptions(screen.getByLabelText('프로그램 유형'), 'LIVE');

    expect(screen.queryByText('자소서 챌린지 31기')).not.toBeInTheDocument();
    expect(screen.getByText('면접 라이브')).toBeInTheDocument();
  });

  it('저장에 실패하면 서버 메시지를 알린다', async () => {
    const user = userEvent.setup();
    mockApi([]);
    put.mockRejectedValue(new Error('판매 대상이 아닙니다.'));

    renderPage();
    await screen.findByText('면접 라이브');
    await user.click(saleSwitch('면접 라이브'));

    expect(
      await screen.findByText('판매 대상이 아닙니다.'),
    ).toBeInTheDocument();
  });
});
