import {
  useMyOneTimeFormApplicationQuery,
  useOneTimeFormQuery,
} from '@/api/one-time-form/oneTimeForm';
import useAuthStore from '@/store/useAuthStore';
import { ApiError } from '@letscareer/api/errors';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  freeFormFixture,
  paidFormFixture,
} from '../../__fixtures__/oneTimeFormFixtures';
import CompletePage from './CompletePage';

jest.mock('@/api/one-time-form/oneTimeForm', () => ({
  ONE_TIME_FORM_NOT_FOUND: 'ONE_TIME_FORM_NOT_FOUND',
  getOneTimeFormErrorCode: (error: { code?: string } | null) => error?.code,
  useOneTimeFormQuery: jest.fn(),
  useMyOneTimeFormApplicationQuery: jest.fn(),
}));

jest.mock('@/store/useAuthStore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const push = jest.fn();
const replace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace }),
}));

const refetch = jest.fn();

const mockAuth = (state: { isLoggedIn: boolean; isInitialized: boolean }) =>
  (useAuthStore as unknown as jest.Mock).mockImplementation(
    (selector: (s: typeof state) => unknown) => selector(state),
  );

const mockForm = (data: unknown) =>
  (useOneTimeFormQuery as jest.Mock).mockReturnValue({
    data,
    isLoading: false,
    error: null,
    refetch,
  });

const mockMyApplication = (data: unknown) =>
  (useMyOneTimeFormApplicationQuery as jest.Mock).mockReturnValue({
    data,
    isSuccess: true,
    isError: false,
    refetch,
  });

// 계약 13.3 신청 1042(유료 49,000원)
const PAID_APPLICATION = {
  applicationId: 1042,
  createDate: '2026-11-02T13:24:00',
  isCanceled: false,
  canceledAt: null,
  isCancelable: true,
  cancelDeadline: '2026-11-10T23:59:59',
  name: '김렛커',
  email: 'letscareer@example.com',
  phoneNum: '010-1234-5678',
  selectedOptions: [],
  payment: { paidAmount: 49000, refundAmount: 0, paymentMethod: '카드' },
  answerItems: [],
};

// 계약 13.3 신청 1044(무료)
const FREE_APPLICATION = {
  ...PAID_APPLICATION,
  applicationId: 1044,
  name: '이유저',
  cancelDeadline: '2026-11-30T23:59:59',
  payment: null,
};

const originalClose = window.close;

beforeEach(() => {
  jest.clearAllMocks();
  mockAuth({ isLoggedIn: true, isInitialized: true });
});

afterEach(() => {
  window.close = originalClose;
});

describe('CompletePage', () => {
  it('유료 신청은 결제 완료 문구, 결제 금액, 안내 문구, 취소 마감을 보여 준다', () => {
    mockForm(paidFormFixture);
    mockMyApplication(PAID_APPLICATION);
    render(<CompletePage slug="portfolio-1115" />);

    expect(
      screen.getByRole('heading', { name: '신청과 결제가 완료됐어요' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('포트폴리오 집중 클래스 · 49,000원'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /수업 하루 전에 입력하신 이메일로 참여 링크를 보내드려요/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        '신청 내용 확인과 취소는 11.10(화)까지 신청 확인 페이지에서 할 수 있어요.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '신청 확인·취소' }),
    ).toHaveAttribute('href', '/form/portfolio-1115/my');
  });

  it('무료 신청은 금액 없이 제목만 보이고 안내 문구가 없으면 안내 상자를 그리지 않는다', () => {
    mockForm(freeFormFixture);
    mockMyApplication(FREE_APPLICATION);
    render(<CompletePage slug="seminar-1130" />);

    expect(
      screen.getByRole('heading', { name: '신청이 완료됐어요' }),
    ).toBeInTheDocument();
    expect(screen.getByText('11월 무료 세미나 사전 질문')).toBeInTheDocument();
    expect(screen.queryByText(/원$/)).not.toBeInTheDocument();
    expect(screen.queryByText('안내')).not.toBeInTheDocument();
    expect(screen.getByText(/11\.30\(월\)까지/)).toBeInTheDocument();
  });

  it('0원 신청은 0원으로 보여 준다', () => {
    mockForm(paidFormFixture);
    mockMyApplication({
      ...PAID_APPLICATION,
      payment: { paidAmount: 0, refundAmount: 0, paymentMethod: null },
    });
    render(<CompletePage slug="portfolio-1115" />);

    expect(
      screen.getByText('포트폴리오 집중 클래스 · 0원'),
    ).toBeInTheDocument();
  });

  describe('닫기', () => {
    it('창이 닫히면 이동하지 않는다', () => {
      mockForm(paidFormFixture);
      mockMyApplication(PAID_APPLICATION);
      window.close = jest.fn(() => {
        Object.defineProperty(window, 'closed', {
          configurable: true,
          get: () => true,
        });
      });
      render(<CompletePage slug="portfolio-1115" />);

      fireEvent.click(screen.getByText('닫기', { selector: 'button' }));

      expect(window.close).toHaveBeenCalled();
      expect(push).not.toHaveBeenCalled();
      // jsdom 기본값으로 되돌린다
      Object.defineProperty(window, 'closed', {
        configurable: true,
        get: () => false,
      });
    });

    it('브라우저가 닫기를 막으면 홈으로 보낸다', () => {
      mockForm(paidFormFixture);
      mockMyApplication(PAID_APPLICATION);
      window.close = jest.fn();
      render(<CompletePage slug="portfolio-1115" />);

      fireEvent.click(screen.getByText('닫기', { selector: 'button' }));

      expect(window.close).toHaveBeenCalled();
      expect(push).toHaveBeenCalledWith('/');
    });
  });

  it('신청이 없으면 신청 페이지로 보낸다', () => {
    mockForm(paidFormFixture);
    mockMyApplication(null);
    render(<CompletePage slug="portfolio-1115" />);

    expect(replace).toHaveBeenCalledWith('/form/portfolio-1115');
  });

  it('취소한 신청이면 신청 페이지로 보낸다', () => {
    mockForm(paidFormFixture);
    mockMyApplication({ ...PAID_APPLICATION, isCanceled: true });
    render(<CompletePage slug="portfolio-1115" />);

    expect(replace).toHaveBeenCalledWith('/form/portfolio-1115');
  });

  it('로그인하지 않았으면 신청 페이지로 보낸다', () => {
    mockAuth({ isLoggedIn: false, isInitialized: true });
    mockForm(paidFormFixture);
    (useMyOneTimeFormApplicationQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isSuccess: false,
      isError: false,
      refetch,
    });
    render(<CompletePage slug="portfolio-1115" />);

    expect(replace).toHaveBeenCalledWith('/form/portfolio-1115');
    expect(useMyOneTimeFormApplicationQuery).toHaveBeenCalledWith(
      'portfolio-1115',
      { enabled: false },
    );
  });

  it('U2 가 403 이면 다시 시도 대신 신청 페이지로 보낸다', () => {
    mockForm(paidFormFixture);
    (useMyOneTimeFormApplicationQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isSuccess: false,
      isError: true,
      error: new ApiError({
        status: 403,
        code: 'API_ERROR',
        message: 'Request failed with status code 403',
        endpoint: '/one-time-form/portfolio-1115/my',
        method: 'GET',
      }),
      refetch,
    });
    render(<CompletePage slug="portfolio-1115" />);

    expect(replace).toHaveBeenCalledWith('/form/portfolio-1115');
    expect(
      screen.queryByRole('button', { name: '다시 시도' }),
    ).not.toBeInTheDocument();
  });
});
