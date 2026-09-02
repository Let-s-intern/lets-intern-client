import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { useCancelLiveMentoringApplicationMutation } from '@/api/live-mentoring/liveMentoring';
import type {
  LiveMentoringRefundPreview,
  MyLiveMentoringApplication,
} from '@/api/live-mentoring/liveMentoringSchema';
import LiveMentoringCreditDeletePage from './LiveMentoringCreditDeletePage';
import LiveMentoringCreditDetailPage from './LiveMentoringCreditDetailPage';
import { useLiveMentoringRefund } from './hooks/useLiveMentoringRefund';

const push = jest.fn();
const back = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push, back }) }));

jest.mock('./hooks/useLiveMentoringRefund', () => {
  const actual = jest.requireActual('./hooks/useLiveMentoringRefund');
  return {
    __esModule: true,
    readServerError: actual.readServerError,
    useLiveMentoringRefund: jest.fn(),
  };
});

jest.mock('@/api/live-mentoring/liveMentoring', () => ({
  __esModule: true,
  useCancelLiveMentoringApplicationMutation: jest.fn(),
}));

jest.mock('@/api/user/user', () => ({
  __esModule: true,
  useUserQuery: () => ({
    data: {
      name: '로컬어드민',
      phoneNum: '010-0000-0000',
      email: 'local-admin@letscareer.test',
      contactEmail: 'local-admin@letscareer.test',
    },
  }),
}));

const useRefundMock = useLiveMentoringRefund as jest.Mock;
const useCancelMock = useCancelLiveMentoringApplicationMutation as jest.Mock;
const mutate = jest.fn();

const APPLICATION: MyLiveMentoringApplication = {
  applicationId: 10,
  paymentId: null,
  mentorName: '어드어드민닉네임',
  thumbnail: null,
  productName: '어드민 1대1 라이브 멘토링',
  durationMinutes: 60,
  reservationStartAt: '2026-09-13T10:00:00',
  reservationEndAt: '2026-09-13T11:00:00',
  status: 'CONFIRMED',
  questionWritten: true,
  questionEditable: true,
  entryLink: null,
};

/** 실측한 48시간 초과 구간 응답. */
function makePreview(
  overrides: Partial<LiveMentoringRefundPreview> = {},
): LiveMentoringRefundPreview {
  return {
    applicationId: 10,
    paymentId: null,
    orderId: 'GHiV6ewvHOw4',
    originalPrice: 60000,
    productDiscount: 0,
    couponDiscount: 0,
    paidAmount: 60000,
    cancelFeePercent: 0,
    cancelFee: 0,
    refundAmount: 60000,
    reservationStartAt: '2026-09-13T10:00:00',
    cancelable: true,
    ...overrides,
  };
}

function mockRefund(
  refundPreview: LiveMentoringRefundPreview | null,
  { error = null as { code: string; message: string } | null } = {},
) {
  useRefundMock.mockReturnValue({
    application: APPLICATION,
    refundPreview,
    isLoading: false,
    error,
  });
}

beforeEach(() => {
  push.mockClear();
  back.mockClear();
  mutate.mockReset();
  useRefundMock.mockReset();
  useCancelMock.mockReturnValue({ mutate, isPending: false });
});

describe('LiveMentoringCreditDeletePage — 금액은 서버 값을 그대로 그린다', () => {
  /*
    수수료 50% 구간. 슬롯을 36시간 뒤로 옮겨 서버에서 실제로 받은 값이다.
    화면에서 60000 * 0.5 를 계산하지 않는다 — 계산이 두 곳에 있으면 어긋난다.
  */
  it('서버가 준 수수료율·수수료·환불액을 그대로 보여준다', () => {
    mockRefund(
      makePreview({
        cancelFeePercent: 50,
        cancelFee: 30000,
        refundAmount: 30000,
      }),
    );
    render(<LiveMentoringCreditDeletePage applicationId={10} />);

    expect(screen.getByText('취소 수수료 (50%)')).toBeInTheDocument();
    expect(screen.getByText('-30,000원')).toBeInTheDocument();
    // 예정 환불금액과 총 결제금액이 각각 한 번씩
    expect(screen.getByText('30,000원')).toBeInTheDocument();
    expect(screen.getAllByText('60,000원').length).toBeGreaterThanOrEqual(1);
  });

  /* 0% 면 뗄 것이 없다. "취소 수수료 0원" 은 읽는 사람에게 아무것도 알려주지 않는다. */
  it('수수료가 0 이면 수수료 행을 감춘다', () => {
    mockRefund(makePreview());
    render(<LiveMentoringCreditDeletePage applicationId={10} />);

    // 정책 안내 문구에도 "취소 수수료" 가 들어 있어 금액 행만 정확히 짚는다
    expect(screen.queryByText(/^취소 수수료 \(/)).not.toBeInTheDocument();
    expect(screen.getAllByText('60,000원').length).toBeGreaterThanOrEqual(2);
  });

  it('서버가 준 어떤 수수료율이든 그대로 표시한다', () => {
    mockRefund(
      makePreview({
        cancelFeePercent: 30,
        cancelFee: 18000,
        refundAmount: 42000,
      }),
    );
    render(<LiveMentoringCreditDeletePage applicationId={10} />);

    // 정책이 바뀌어도 화면 코드를 고칠 필요가 없다
    expect(screen.getByText('취소 수수료 (30%)')).toBeInTheDocument();
    expect(screen.getByText('42,000원')).toBeInTheDocument();
  });

  it('수수료 정책 안내 문구가 시안 원문과 같다', () => {
    mockRefund(makePreview());
    render(<LiveMentoringCreditDeletePage applicationId={10} />);

    expect(
      screen.getByText(
        '예약일시 24~48시간 전 취소 시, 멘토의 멘토링 사전 준비 시간이 반영되어 결제 금액의 50%가 취소 수수료로 부과됩니다.',
      ),
    ).toBeInTheDocument();
  });
});

describe('LiveMentoringCreditDeletePage — 취소 실행', () => {
  const cancelButton = () =>
    screen.getByRole('button', { name: /결제 취소하기|취소하는 중/ });

  /* 시안 4-1 — 확인 체크 전에는 실행할 수 없다. */
  it('확인 체크 전에는 버튼이 잠겨 있다', () => {
    mockRefund(makePreview());
    render(<LiveMentoringCreditDeletePage applicationId={10} />);

    expect(cancelButton()).toBeDisabled();

    fireEvent.click(screen.getByRole('checkbox'));
    expect(cancelButton()).toBeEnabled();
  });

  /*
    24시간 이내처럼 돌려줄 돈이 없는 구간은 서버가 cancelable=false 를 준다.
    화면이 경계를 다시 계산하면 시계 차이로 어긋난다.
  */
  it('서버가 취소 불가로 판단하면 체크해도 잠긴 채다', () => {
    mockRefund(
      makePreview({
        cancelFeePercent: 100,
        cancelFee: 60000,
        refundAmount: 0,
        cancelable: false,
      }),
    );
    render(<LiveMentoringCreditDeletePage applicationId={10} />);

    fireEvent.click(screen.getByRole('checkbox'));
    expect(cancelButton()).toBeDisabled();
  });

  it('취소에 성공하면 결제 목록으로 돌아간다', async () => {
    mutate.mockImplementation((_arg, options) => options.onSuccess());
    mockRefund(makePreview());
    render(<LiveMentoringCreditDeletePage applicationId={10} />);

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(cancelButton());

    await waitFor(() => expect(push).toHaveBeenCalledWith('/mypage/credit'));
  });

  /* 예약이 지났거나 이미 취소된 건이면 서버가 거절한다. 그 문구를 그대로 보여준다. */
  it('서버가 거부하면 사유를 보여주고 이동하지 않는다', async () => {
    mutate.mockImplementation((_arg, options) =>
      /* 인터셉터가 만든 ApiError 형태. `response` 가 없다. */
      options.onError(
        Object.assign(new Error('취소할 수 없는 라이브 멘토링입니다.'), {
          code: 'LIVE_MENTORING_CANCEL_NOT_ALLOWED',
          status: 409,
          serverMessage: '취소할 수 없는 라이브 멘토링입니다.',
        }),
      ),
    );
    mockRefund(makePreview());
    render(<LiveMentoringCreditDeletePage applicationId={10} />);

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(cancelButton());

    expect(
      await screen.findByText('취소할 수 없는 라이브 멘토링입니다.'),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it('조회 자체가 거부되면 취소 화면을 그리지 않는다', () => {
    useRefundMock.mockReturnValue({
      application: null,
      refundPreview: null,
      isLoading: false,
      error: {
        code: 'LIVE_MENTORING_INVALID_STATE',
        message: '요청한 라이브 멘토링 상태 전이를 수행할 수 없습니다.',
      },
    });
    render(<LiveMentoringCreditDeletePage applicationId={14} />);

    expect(
      screen.getByText('요청한 라이브 멘토링 상태 전이를 수행할 수 없습니다.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});

describe('LiveMentoringCreditDetailPage', () => {
  it('예약 일시·구매 플랜·결제 금액을 보여준다', () => {
    mockRefund(makePreview());
    render(<LiveMentoringCreditDetailPage applicationId={10} />);

    expect(screen.getByText('26.09.13 (일) 10:00 ~ 11:00')).toBeInTheDocument();
    expect(screen.getByText('60분')).toBeInTheDocument();
    expect(screen.getByText('GHiV6ewvHOw4')).toBeInTheDocument();
    expect(screen.getByText('총 결제금액')).toBeInTheDocument();
  });

  it('취소 가능하면 취소 화면 링크를 보여준다', () => {
    mockRefund(makePreview());
    render(<LiveMentoringCreditDetailPage applicationId={10} />);

    expect(screen.getByRole('link', { name: '결제 취소하기' })).toHaveAttribute(
      'href',
      '/mypage/credit/live-mentoring/10/delete',
    );
  });

  it('서버가 취소 불가로 판단하면 링크 대신 사유를 보여준다', () => {
    mockRefund(makePreview({ cancelable: false }));
    render(<LiveMentoringCreditDetailPage applicationId={10} />);

    expect(screen.queryByRole('link', { name: '결제 취소하기' })).toBeNull();
    expect(
      screen.getByText('예약 시간이 가까워 결제를 취소할 수 없습니다.'),
    ).toBeInTheDocument();
  });

  it('할인이 0 이면 할인 행을 감춘다', () => {
    mockRefund(makePreview());
    render(<LiveMentoringCreditDetailPage applicationId={10} />);

    expect(screen.queryByText('할인 금액')).not.toBeInTheDocument();
    expect(screen.queryByText('쿠폰 할인 금액')).not.toBeInTheDocument();
  });
});
