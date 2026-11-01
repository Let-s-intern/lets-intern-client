import { render, screen, waitFor } from '@testing-library/react';
import { postVodPassPurchase } from '../api';
import VodPassPurchaseResult from './VodPassPurchaseResult';

const mockReplace = jest.fn();
let mockParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => mockParams,
}));
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: jest.fn() }),
}));
jest.mock('../api', () => ({ postVodPassPurchase: jest.fn() }));
jest.mock('@/common/loading/LoadingContainer', () => ({
  __esModule: true,
  default: () => null,
}));

const successParams =
  'productId=1&months=3&expectedPrice=49000&expectedDurationDays=90&paymentKey=key&orderId=order1&amount=49000';

describe('VodPassPurchaseResult', () => {
  beforeEach(() => jest.mocked(postVodPassPurchase).mockReset());

  it('토스 성공 쿼리로 구매를 만들고 이용 기간을 보여준다', async () => {
    mockParams = new URLSearchParams(successParams);
    jest.mocked(postVodPassPurchase).mockResolvedValue({
      data: {
        data: {
          vodPass: {
            startsAt: '2026-11-02T10:00:00+09:00',
            endsAt: '2027-01-31T10:00:00+09:00',
          },
        },
      },
    } as never);

    render(<VodPassPurchaseResult />);

    expect(await screen.findByText('결제가 완료되었어요')).toBeInTheDocument();
    expect(
      screen.getByText('이용 기간 2026.11.02 ~ 2027.01.31'),
    ).toBeInTheDocument();
    expect(postVodPassPurchase).toHaveBeenCalledWith({
      vodPassProductId: 1,
      vodPassMonths: 3,
      vodPassExpectedPrice: 49000,
      vodPassExpectedDurationDays: 90,
      paymentKey: 'key',
      orderId: 'order1',
      amount: '49000',
    });
    await waitFor(() =>
      expect(mockReplace.mock.calls.at(-1)?.[0]).toContain('postDone=true'),
    );
  });

  it('새로고침한 완료 화면은 구매를 다시 요청하지 않는다', async () => {
    mockParams = new URLSearchParams(`${successParams}&postDone=true`);

    render(<VodPassPurchaseResult />);

    expect(await screen.findByText('결제가 완료되었어요')).toBeInTheDocument();
    expect(postVodPassPurchase).not.toHaveBeenCalled();
  });

  it('토스 실패 쿼리면 구매를 요청하지 않고 다시 시도 링크를 보여준다', async () => {
    mockParams = new URLSearchParams('code=PAY_PROCESS_CANCELED');

    render(<VodPassPurchaseResult />);

    expect(await screen.findByText('결제 실패')).toBeInTheDocument();
    expect(postVodPassPurchase).not.toHaveBeenCalled();
    expect(screen.getByRole('link', { name: '다시 시도하기' })).toHaveAttribute(
      'href',
      '/vod-pass/purchase',
    );
  });

  it('판매가 꺼져 거절되면 사유를 보여준다', async () => {
    mockParams = new URLSearchParams(successParams);
    jest
      .mocked(postVodPassPurchase)
      .mockRejectedValue({ code: 'VOD_PASS_SALE_NOT_ENABLED' });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<VodPassPurchaseResult />);

    expect(
      await screen.findByText('VOD 이용권 판매가 종료되었어요.'),
    ).toBeInTheDocument();
  });
});
