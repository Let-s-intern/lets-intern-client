import { render, screen, waitFor } from '@testing-library/react';
import { postGuidebookPurchase } from '../api';
import GuidebookPurchaseResult from './GuidebookPurchaseResult';

const mockReplace = jest.fn();
const mockInvalidate = jest.fn();
let mockParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => mockParams,
}));
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidate }),
}));
jest.mock('@/api/application', () => ({
  useProgramApplicationQueryKey: 'useProgramApplicationQueryKey',
}));
jest.mock('../api', () => ({ postGuidebookPurchase: jest.fn() }));
jest.mock('@/common/loading/LoadingContainer', () => ({
  __esModule: true,
  default: () => null,
}));

const paidParams =
  'priceId=7&orderId=order1&paymentKey=key&amount=990&returnUrl=https%3A%2F%2Fogonggo.co.kr%2Fr';
const freeParams = 'priceId=7&orderId=order1&amount=0&free=true';

describe('GuidebookPurchaseResult', () => {
  beforeEach(() => {
    jest.mocked(postGuidebookPurchase).mockReset();
    mockReplace.mockClear();
    mockInvalidate.mockClear();
    jest
      .mocked(postGuidebookPurchase)
      .mockResolvedValue({ data: { data: {} } } as never);
  });

  it('토스 성공 쿼리로 신청을 한 번 만들고 성공 문구와 확인 버튼을 보인다', async () => {
    mockParams = new URLSearchParams(paidParams);

    render(<GuidebookPurchaseResult guidebookId={12} />);

    expect(await screen.findByText('결제가 완료되었어요')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '확인' })).toBeInTheDocument();
    expect(postGuidebookPurchase).toHaveBeenCalledTimes(1);
    expect(postGuidebookPurchase).toHaveBeenCalledWith(12, {
      paymentInfo: {
        couponId: null,
        priceId: 7,
        paymentKey: 'key',
        orderId: 'order1',
        amount: '990',
      },
    });
    await waitFor(() =>
      expect(mockReplace.mock.calls.at(-1)?.[0]).toContain('postDone=true'),
    );
  });

  it('새로고침한 완료 화면은 신청을 다시 요청하지 않는다', async () => {
    mockParams = new URLSearchParams(`${paidParams}&postDone=true`);

    render(<GuidebookPurchaseResult guidebookId={12} />);

    expect(await screen.findByText('결제가 완료되었어요')).toBeInTheDocument();
    expect(postGuidebookPurchase).not.toHaveBeenCalled();
  });

  it('결제 키가 없으면 신청하지 않고 실패 화면을 보인다', async () => {
    mockParams = new URLSearchParams('priceId=7&orderId=order1&amount=990');

    render(<GuidebookPurchaseResult guidebookId={12} />);

    expect(await screen.findByText('결제 실패')).toBeInTheDocument();
    expect(postGuidebookPurchase).not.toHaveBeenCalled();
  });

  it('신청이 거절되면 실패 화면에서 returnUrl 을 유지한 채 다시 시도하게 한다', async () => {
    mockParams = new URLSearchParams(paidParams);
    jest.mocked(postGuidebookPurchase).mockRejectedValue(new Error('400'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<GuidebookPurchaseResult guidebookId={12} />);

    expect(await screen.findByText('결제 실패')).toBeInTheDocument();
    const retry = screen.getByRole('link', { name: '다시 시도하기' });
    const url = new URL(retry.getAttribute('href') ?? '', 'https://x.test');
    expect(url.pathname).toBe('/guidebook/purchase/12');
    expect(url.searchParams.get('returnUrl')).toBe('https://ogonggo.co.kr/r');
  });

  it('신청에 성공하면 신청 조회 캐시를 비워 다음 구매 화면이 구매 상태를 읽게 한다', async () => {
    mockParams = new URLSearchParams(paidParams);

    render(<GuidebookPurchaseResult guidebookId={12} />);

    await screen.findByText('결제가 완료되었어요');
    expect(mockInvalidate).toHaveBeenCalledWith({
      queryKey: ['useProgramApplicationQueryKey'],
    });
  });

  it('0원 신청은 결제 키 없이 신청하고 신청 완료 문구를 보인다', async () => {
    mockParams = new URLSearchParams(freeParams);

    render(<GuidebookPurchaseResult guidebookId={12} />);

    expect(await screen.findByText('신청이 완료되었어요')).toBeInTheDocument();
    expect(postGuidebookPurchase).toHaveBeenCalledWith(12, {
      paymentInfo: {
        couponId: null,
        priceId: 7,
        paymentKey: null,
        orderId: 'order1',
        amount: '0',
      },
    });
  });

  it('free 쿼리라도 금액이 0이 아니면 신청하지 않는다', async () => {
    mockParams = new URLSearchParams(
      'priceId=7&orderId=order1&amount=990&free=true',
    );

    render(<GuidebookPurchaseResult guidebookId={12} />);

    expect(await screen.findByText('결제 실패')).toBeInTheDocument();
    expect(postGuidebookPurchase).not.toHaveBeenCalled();
  });
});
