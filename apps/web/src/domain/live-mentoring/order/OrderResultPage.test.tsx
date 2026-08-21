import { render, screen, waitFor } from '@testing-library/react';

import { useConfirmLiveMentoringPaymentMutation } from '@/api/live-mentoring/liveMentoring';
import OrderFailPage from './OrderFailPage';
import OrderResultPage from './OrderResultPage';
import {
  useOrderDraftStore,
  type CreatedLiveMentoringApplication,
} from './hooks/useOrderDraft';

const push = jest.fn();
let searchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: jest.fn() }),
  useSearchParams: () => searchParams,
}));

const mutate = jest.fn();
let mutationState: Record<string, unknown> = {};

jest.mock('@/api/live-mentoring/liveMentoring', () => ({
  __esModule: true,
  useConfirmLiveMentoringPaymentMutation: jest.fn(),
}));

const useConfirmMock = useConfirmLiveMentoringPaymentMutation as jest.Mock;

const APPLICATION: CreatedLiveMentoringApplication = {
  applicationId: 15,
  orderId: 'gKEMQwWav2Lh',
  finalAmount: 60000,
  orderName: '어드민 1대1 라이브 멘토링',
  customerName: '로컬어드민',
  customerEmail: 'local-admin@letscareer.test',
  customerMobilePhone: '01000000000',
  expiresAt: '2026-08-21T16:23:16.283507',
};

const SUCCESS_PARAMS = new URLSearchParams({
  paymentKey: 'tviva20260821',
  orderId: 'gKEMQwWav2Lh',
  amount: '60000',
});

beforeEach(() => {
  push.mockClear();
  mutate.mockReset();
  searchParams = new URLSearchParams(SUCCESS_PARAMS);
  useOrderDraftStore.getState().clearDraft();
  mutationState = { isPending: false, isSuccess: false, data: undefined };
  useConfirmMock.mockImplementation(() => ({ mutate, ...mutationState }));
});

describe('OrderResultPage — 승인 호출', () => {
  it('Toss 가 준 값으로 승인을 요청한다', async () => {
    useOrderDraftStore.getState().setApplication(APPLICATION);
    render(<OrderResultPage />);

    await waitFor(() => expect(mutate).toHaveBeenCalledTimes(1));
    // 요청의 amount 는 문자열이다. 숫자로 보내면 서버가 400 을 준다.
    expect(mutate.mock.calls[0][0]).toEqual({
      paymentKey: 'tviva20260821',
      orderId: 'gKEMQwWav2Lh',
      amount: '60000',
    });
  });

  /*
    이미 승인된 결제를 다시 승인하려다 실패하면, 사용자에게는 성공한 결제가
    실패로 보인다. 리렌더로 두 번 부르지 않는다.
  */
  it('리렌더돼도 승인을 두 번 부르지 않는다', async () => {
    useOrderDraftStore.getState().setApplication(APPLICATION);
    const { rerender } = render(<OrderResultPage />);

    await waitFor(() => expect(mutate).toHaveBeenCalledTimes(1));
    rerender(<OrderResultPage />);
    rerender(<OrderResultPage />);

    expect(mutate).toHaveBeenCalledTimes(1);
  });

  /*
    신청 정보는 메모리에만 있다. 새로고침하면 사라지는데 이미 승인이 끝난 뒤일 수도
    있어, 승인을 다시 부르지 않고 신청 내역으로 안내한다.
  */
  it('새로고침으로 신청 정보가 사라지면 승인을 부르지 않고 안내한다', async () => {
    render(<OrderResultPage />);

    expect(
      await screen.findByText(/마이페이지에서 신청 내역을 확인/),
    ).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('Toss 파라미터가 빠져 있으면 승인을 부르지 않는다', async () => {
    useOrderDraftStore.getState().setApplication(APPLICATION);
    searchParams = new URLSearchParams({ orderId: 'gKEMQwWav2Lh' });
    render(<OrderResultPage />);

    expect(
      await screen.findByText('결제를 확인하지 못했습니다'),
    ).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });
});

describe('OrderResultPage — 결과 화면', () => {
  it('승인 전에는 완료로 보이지 않는다', () => {
    useOrderDraftStore.getState().setApplication(APPLICATION);
    mutationState = { isPending: true, isSuccess: false, data: undefined };
    render(<OrderResultPage />);

    expect(screen.getByText('결제를 확인하는 중…')).toBeInTheDocument();
    expect(screen.queryByText('결제가 완료되었습니다!')).toBeNull();
  });

  it('승인이 끝나면 서버가 확정한 금액으로 완료 화면을 보여준다', () => {
    useOrderDraftStore.getState().setApplication(APPLICATION);
    mutationState = {
      isPending: false,
      isSuccess: true,
      data: {
        applicationId: 15,
        paymentId: 501,
        orderId: 'gKEMQwWav2Lh',
        amount: 60000,
        applicationStatus: 'CONFIRMED',
      },
    };
    render(<OrderResultPage />);

    expect(screen.getByText('결제가 완료되었습니다!')).toBeInTheDocument();
    expect(screen.getByText('60,000원')).toBeInTheDocument();
    expect(screen.getByText('어드민 1대1 라이브 멘토링')).toBeInTheDocument();
  });
});

describe('OrderFailPage', () => {
  it('Toss 가 준 사유와 코드를 보여준다', () => {
    searchParams = new URLSearchParams({
      code: 'PAY_PROCESS_CANCELED',
      message: '사용자가 결제를 취소하였습니다.',
    });
    render(<OrderFailPage />);

    expect(
      screen.getByText('사용자가 결제를 취소하였습니다.'),
    ).toBeInTheDocument();
    expect(screen.getByText('오류 코드: PAY_PROCESS_CANCELED')).toBeInTheDocument();
  });

  /*
    신청은 이미 만들어졌고 슬롯은 10분간 선점돼 있다. 다시 신청을 만들면 같은
    슬롯을 두 번 잡으려다 실패하므로, 만들어 둔 신청의 결제창을 다시 연다.
  */
  it('신청이 남아 있으면 새로 만들지 않고 결제창을 다시 연다', () => {
    useOrderDraftStore.getState().setApplication(APPLICATION);
    render(<OrderFailPage />);

    expect(screen.getByRole('link', { name: '다시 결제하기' })).toHaveAttribute(
      'href',
      '/live-mentoring/order/payment',
    );
  });

  it('신청 정보가 없으면 상세로 되돌아가 다시 신청하게 한다', () => {
    render(<OrderFailPage />);

    expect(
      screen.getByRole('link', { name: '다시 신청하기' }),
    ).toBeInTheDocument();
  });

  it('사유가 없어도 빈 화면을 남기지 않는다', () => {
    searchParams = new URLSearchParams();
    render(<OrderFailPage />);

    expect(
      screen.getByText('결제가 완료되지 않았습니다. 다시 시도해 주세요.'),
    ).toBeInTheDocument();
  });
});
