import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const get = vi.fn();
const post = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
    post: (...args: unknown[]) => post(...args),
  },
}));

vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar: vi.fn() }),
}));

// 이용 이력은 환불 실행 조건이 아니다
vi.mock('@/domain/admin/usage/ui/RefundUsageSummary', () => ({
  default: () => null,
}));

import VodPassApplications from './VodPassApplications';

const pass = (over: Record<string, unknown> = {}) => ({
  applicationId: 1,
  userId: 100,
  name: '박서현',
  email: 'seohyun@example.com',
  phoneNum: '010-1111-2222',
  orderId: 'letsBX1',
  purchasedMonths: 3,
  startsAt: '2026-10-01T00:00:00',
  endsAt: '2026-12-30T00:00:00',
  status: 'ACTIVE',
  paidAmount: 59000,
  createDate: '2026-09-30T09:30:00',
  ...over,
});

const renderPage = () =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <VodPassApplications />
    </QueryClientProvider>,
  );

beforeEach(() => {
  get.mockReset();
  post.mockReset();
});

describe('VOD 이용권 구매자 목록', () => {
  it('구매자 정보와 개월 수, 이용 기간, 상태, 결제금액을 보여준다', async () => {
    get.mockResolvedValue({ data: { data: { passes: [pass()] } } });

    renderPage();

    const row = (await screen.findByText('박서현')).closest('tr')!;
    expect(get).toHaveBeenCalledWith('/admin/vod-pass/applications');
    expect(within(row).getByText('letsBX1')).toBeInTheDocument();
    expect(within(row).getByText('seohyun@example.com')).toBeInTheDocument();
    expect(within(row).getByText('010-1111-2222')).toBeInTheDocument();
    expect(within(row).getByText('3개월')).toBeInTheDocument();
    expect(within(row).getByText('2026-10-01 00:00')).toBeInTheDocument();
    expect(within(row).getByText('2026-12-30 00:00')).toBeInTheDocument();
    expect(within(row).getByText('이용 중')).toBeInTheDocument();
    expect(within(row).getByText('59,000원')).toBeInTheDocument();
    expect(screen.getByText('총 1건')).toBeInTheDocument();
  });

  it('날짜와 결제 정보가 없는 건은 대시로 보여주고 취소 상태를 구분한다', async () => {
    get.mockResolvedValue({
      data: {
        data: {
          passes: [
            pass({
              applicationId: 2,
              name: '김민수',
              orderId: null,
              purchasedMonths: null,
              startsAt: null,
              endsAt: null,
              status: 'CANCELED',
              paidAmount: null,
            }),
          ],
        },
      },
    });

    renderPage();

    const row = (await screen.findByText('김민수')).closest('tr')!;
    expect(within(row).getByText('취소')).toBeInTheDocument();
    expect(within(row).getAllByText('-').length).toBeGreaterThanOrEqual(5);
  });

  it('이름, 이메일, 휴대폰, 주문번호로 걸러 본다', async () => {
    const user = userEvent.setup();
    get.mockResolvedValue({
      data: {
        data: {
          passes: [
            pass(),
            pass({
              applicationId: 2,
              name: '김민수',
              email: 'minsu@example.com',
              phoneNum: '010-3333-4444',
              orderId: 'letsBX2',
            }),
          ],
        },
      },
    });

    renderPage();
    await screen.findByText('박서현');
    const search = screen.getByRole('searchbox', { name: '구매자 검색' });

    await user.type(search, 'minsu');
    expect(screen.queryByText('박서현')).not.toBeInTheDocument();
    expect(screen.getByText('김민수')).toBeInTheDocument();
    expect(screen.getByText('총 1건')).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, '없는사람');
    expect(
      screen.getByText('조건에 맞는 구매자가 없습니다.'),
    ).toBeInTheDocument();
  });

  it('조회에 실패하면 서버 메시지를 보여준다', async () => {
    get.mockRejectedValue(new Error('권한이 없습니다.'));

    renderPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '권한이 없습니다.',
    );
  });

  it('함께 결제한 프로그램을 보여주고 단독 구매를 구분한다', async () => {
    get.mockResolvedValue({
      data: {
        data: {
          passes: [
            pass({
              bundledProgramType: 'CHALLENGE',
              bundledProgramTitle: '서류 챌린지 42기',
            }),
            pass({
              applicationId: 2,
              name: '김민수',
              bundledProgramType: 'MEMBERSHIP',
              bundledProgramTitle: '마케팅 패스',
            }),
            pass({ applicationId: 3, name: '이지은' }),
          ],
        },
      },
    });

    renderPage();

    expect(
      await screen.findByText('챌린지 서류 챌린지 42기'),
    ).toBeInTheDocument();
    expect(screen.getByText('올인원패스 마케팅 패스')).toBeInTheDocument();
    expect(screen.getByText('단독 구매')).toBeInTheDocument();
  });

  it('취소 건과 결제 없는 건에는 환불 버튼을 그리지 않는다', async () => {
    get.mockResolvedValue({
      data: {
        data: {
          passes: [
            pass({ status: 'CANCELED' }),
            pass({ applicationId: 2, name: '김민수', paidAmount: null }),
          ],
        },
      },
    });

    renderPage();

    await screen.findByText('박서현');
    expect(screen.queryByRole('button', { name: '전체 환불' })).toBeNull();
  });

  it('부분 환불은 VOD 결제 금액 미만만 받고 지정한 금액을 요청한다', async () => {
    get.mockResolvedValue({
      data: {
        data: {
          passes: [
            pass({
              bundledProgramType: 'CHALLENGE',
              bundledProgramTitle: '서류 챌린지 42기',
            }),
          ],
        },
      },
    });
    post.mockResolvedValue({
      data: { data: { refundedAmount: 10000 } },
    });
    const user = userEvent.setup();

    renderPage();

    await user.click(await screen.findByRole('button', { name: '부분 환불' }));
    expect(screen.getByText('VOD 이용권')).toBeInTheDocument();
    expect(
      screen.getByText(/함께 결제한 챌린지 서류 챌린지 42기 금액은 환불되지/),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText('환불 금액'), '59000');
    expect(screen.getByText(/보다 적어야 합니다/)).toBeInTheDocument();

    await user.clear(screen.getByLabelText('환불 금액'));
    await user.type(screen.getByLabelText('환불 금액'), '10000');
    await user.type(
      screen.getByPlaceholderText('환불을 진행하는 담당자 이름'),
      '운영자',
    );
    await user.type(
      screen.getByPlaceholderText(/예\) 프로그램 오결제/),
      '오결제',
    );
    const sentence = screen.getByText(/환불합니다/, {
      selector: 'p.font-medium',
    });
    await user.type(screen.getByLabelText('확인 문장'), sentence.textContent!);
    await user.click(screen.getByRole('button', { name: '환불 실행' }));

    expect(post).toHaveBeenCalledWith('/admin/application/1/refund', {
      managerName: '운영자',
      reason: '오결제',
      sendNotification: true,
      refundAmount: 10000,
    });
  });
});
