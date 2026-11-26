import { render, screen, waitFor } from '@testing-library/react';
import { postGuidebookPurchase } from '../api';
import { notifyPurchaseSuccess } from '../utils/purchaseWindow';
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
jest.mock('../utils/purchaseWindow', () => ({
  notifyPurchaseSuccess: jest.fn(),
}));
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

  it('이미 신청한 가이드북(409 CONFLICT_APPLICATION)이면 이미 구매했어요와 확인 버튼만 보인다', async () => {
    mockParams = new URLSearchParams(paidParams);
    jest
      .mocked(postGuidebookPurchase)
      .mockRejectedValue({ status: 409, code: 'CONFLICT_APPLICATION' });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<GuidebookPurchaseResult guidebookId={12} />);

    expect(await screen.findByText('이미 구매했어요')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '확인' })).toBeInTheDocument();
    expect(screen.queryByText('결제 실패')).toBeNull();
    expect(screen.queryByRole('link', { name: '다시 시도하기' })).toBeNull();
  });

  it('가격이 어긋난(400 INVALID_PRICE) 신청은 안내와 returnUrl 을 유지한 구매 화면 링크를 보인다', async () => {
    mockParams = new URLSearchParams(
      `${freeParams}&returnUrl=https%3A%2F%2Fogonggo.co.kr%2Fr`,
    );
    jest
      .mocked(postGuidebookPurchase)
      .mockRejectedValue({ status: 400, code: 'INVALID_PRICE' });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<GuidebookPurchaseResult guidebookId={12} />);

    expect(
      await screen.findByText('가격 정보가 바뀌었어요. 다시 시도해 주세요'),
    ).toBeInTheDocument();
    const back = screen.getByRole('link', { name: '다시 시도하기' });
    const url = new URL(back.getAttribute('href') ?? '', 'https://x.test');
    expect(url.pathname).toBe('/guidebook/purchase/12');
    expect(url.searchParams.get('returnUrl')).toBe('https://ogonggo.co.kr/r');
  });

  it('가격이 어긋나면 돌아온 구매 화면이 다시 조회하도록 혜택 조회 캐시를 무효화한다', async () => {
    mockParams = new URLSearchParams(freeParams);
    jest
      .mocked(postGuidebookPurchase)
      .mockRejectedValue({ status: 400, code: 'INVALID_PRICE' });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<GuidebookPurchaseResult guidebookId={12} />);

    await screen.findByText('가격 정보가 바뀌었어요. 다시 시도해 주세요');
    expect(mockInvalidate).toHaveBeenCalledWith({
      queryKey: ['membershipPrivilege', 'GUIDEBOOK', 12],
    });
  });

  it('다른 실패는 혜택 조회 캐시를 건드리지 않는다', async () => {
    mockParams = new URLSearchParams(paidParams);
    jest
      .mocked(postGuidebookPurchase)
      .mockRejectedValue({ status: 409, code: 'CONFLICT_APPLICATION' });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<GuidebookPurchaseResult guidebookId={12} />);

    await screen.findByText('이미 구매했어요');
    expect(mockInvalidate).not.toHaveBeenCalled();
  });

  it('그 밖의 오류(다른 코드, 네트워크 오류)는 기존 실패 문구를 보인다', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    for (const error of [
      { status: 500, code: 'API_ERROR' },
      new Error('Network Error'),
    ]) {
      mockParams = new URLSearchParams(paidParams);
      jest.mocked(postGuidebookPurchase).mockRejectedValue(error);

      const { unmount } = render(<GuidebookPurchaseResult guidebookId={12} />);

      expect(
        await screen.findByText(
          '결제가 완료되지 않았어요. 다시 시도해 주세요.',
        ),
      ).toBeInTheDocument();
      unmount();
    }
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

  it('신청에 성공하면 연 창에 성공을 알리고, 새로고침한 완료 화면은 알리지 않는다', async () => {
    mockParams = new URLSearchParams(paidParams);
    const { unmount } = render(<GuidebookPurchaseResult guidebookId={12} />);
    await screen.findByText('결제가 완료되었어요');
    expect(notifyPurchaseSuccess).toHaveBeenCalledWith(
      12,
      'https://ogonggo.co.kr/r',
    );
    unmount();

    jest.mocked(notifyPurchaseSuccess).mockClear();
    mockParams = new URLSearchParams(`${paidParams}&postDone=true`);
    render(<GuidebookPurchaseResult guidebookId={12} />);
    await screen.findByText('결제가 완료되었어요');
    expect(notifyPurchaseSuccess).not.toHaveBeenCalled();
  });

  describe('쿠폰', () => {
    it('유료 주소의 couponId 를 숫자로 신청 본문에 담는다', async () => {
      mockParams = new URLSearchParams(`${paidParams}&couponId=3`);

      render(<GuidebookPurchaseResult guidebookId={12} />);

      await screen.findByText('결제가 완료되었어요');
      expect(postGuidebookPurchase).toHaveBeenCalledWith(12, {
        paymentInfo: {
          couponId: 3,
          priceId: 7,
          paymentKey: 'key',
          orderId: 'order1',
          amount: '990',
        },
      });
    });

    it('무료 주소의 couponId 를 신청 본문에 담는다', async () => {
      mockParams = new URLSearchParams(`${freeParams}&couponId=4`);

      render(<GuidebookPurchaseResult guidebookId={12} />);

      await screen.findByText('신청이 완료되었어요');
      expect(postGuidebookPurchase).toHaveBeenCalledWith(12, {
        paymentInfo: {
          couponId: 4,
          priceId: 7,
          paymentKey: null,
          orderId: 'order1',
          amount: '0',
        },
      });
    });

    it.each(['', 'abc', '1.5', '-2'])(
      'couponId 가 숫자가 아니면(%p) null 로 신청한다',
      async (raw) => {
        mockParams = new URLSearchParams(paidParams);
        mockParams.set('couponId', raw);

        render(<GuidebookPurchaseResult guidebookId={12} />);

        await screen.findByText('결제가 완료되었어요');
        expect(
          jest.mocked(postGuidebookPurchase).mock.calls[0][1].paymentInfo
            .couponId,
        ).toBeNull();
      },
    );
  });
});
