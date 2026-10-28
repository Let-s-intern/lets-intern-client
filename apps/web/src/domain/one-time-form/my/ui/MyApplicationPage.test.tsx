import {
  useMyOneTimeFormApplicationQuery,
  useOneTimeFormQuery,
} from '@/api/one-time-form/oneTimeForm';
import useAuthStore from '@/store/useAuthStore';
import axios from '@/utils/axios';
import { ApiError } from '@letscareer/api/errors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { paidFormFixture } from '../../__fixtures__/oneTimeFormFixtures';
import MyApplicationPage from './MyApplicationPage';

jest.mock('@/api/one-time-form/oneTimeForm', () => ({
  ONE_TIME_FORM_NOT_FOUND: 'ONE_TIME_FORM_NOT_FOUND',
  getOneTimeFormErrorCode: (error: { code?: string } | null) => error?.code,
  useOneTimeFormQuery: jest.fn(),
  useMyOneTimeFormApplicationQuery: jest.fn(),
  // 취소는 실제 훅으로 돌려 U5 요청과 U2 무효화까지 본다. 네트워크는 아래 axios 목이 막는다
  useCancelOneTimeFormApplicationMutation: jest.requireActual(
    '@/api/one-time-form/oneTimeForm',
  ).useCancelOneTimeFormApplicationMutation,
}));

// `@/utils/axios`, `@letscareer/api` 는 import.meta 때문에 jest 가 파싱하지 못한다
jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));
jest.mock('@letscareer/api', () => ({
  __esModule: true,
  ApiError: class ApiError extends Error {},
}));

jest.mock('@/store/useAuthStore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn() }),
}));

const mockedDelete = axios.delete as jest.Mock;

const refetch = jest.fn();

const mockAuth = (state: { isLoggedIn: boolean; isInitialized: boolean }) =>
  (useAuthStore as unknown as jest.Mock).mockImplementation(
    (selector: (s: typeof state) => unknown) => selector(state),
  );

const mockForm = (data: unknown, error: unknown = null) =>
  (useOneTimeFormQuery as jest.Mock).mockReturnValue({
    data,
    isLoading: false,
    isError: Boolean(error),
    error,
    refetch,
  });

const mockMyApplication = (data: unknown, error: unknown = null) =>
  (useMyOneTimeFormApplicationQuery as jest.Mock).mockReturnValue({
    data,
    isLoading: false,
    isError: Boolean(error),
    error,
    refetch,
  });

const NOT_FOUND = { code: 'ONE_TIME_FORM_NOT_FOUND' };

// 계약 U2 응답 예시 = 시드 신청 1042(유료, 취소 가능)
const APPLICATION_1042 = {
  applicationId: 1042,
  createDate: '2026-11-02T13:24:00',
  isCanceled: false,
  canceledAt: null,
  isCancelable: true,
  cancelDeadline: '2026-11-10T23:59:59',
  name: '김렛커',
  email: 'letscareer@example.com',
  phoneNum: '010-1234-5678',
  selectedOptions: [
    {
      optionGroupId: 31,
      groupTitle: '참여 방식을 골라 주세요',
      optionId: 311,
      optionName: '온라인 라이브',
      additionalPrice: 0,
    },
    {
      optionGroupId: 32,
      groupTitle: '함께 신청하면 좋아요',
      optionId: 321,
      optionName: '포트폴리오 1:1 첨삭',
      additionalPrice: 20000,
    },
  ],
  payment: { paidAmount: 49000, refundAmount: 0, paymentMethod: '카드' },
  answerItems: [
    {
      questionId: 101,
      type: 'RADIO',
      title: '희망 직무',
      isDeleted: false,
      value: '프론트엔드',
    },
    {
      questionId: 103,
      type: 'CHECKBOX',
      title: '참여 가능한 요일',
      isDeleted: false,
      value: ['월', '수'],
    },
    {
      questionId: 110,
      type: 'FILE',
      title: '이력서',
      isDeleted: false,
      value: {
        key: 'one-time-form/attachment/7/0b5c2f4e-9a61-4d1e-8f0a-3c2b7d9e1a44.pdf',
        name: '김렛커_이력서_최종.pdf',
      },
    },
  ],
};

// 시드 신청 1043(취소, 옵션 312 오프라인 10,000원)
const APPLICATION_1043 = {
  ...APPLICATION_1042,
  applicationId: 1043,
  name: '박서현',
  isCanceled: true,
  isCancelable: false,
  canceledAt: '2026-11-03T14:02:00',
  selectedOptions: [
    {
      optionGroupId: 31,
      groupTitle: '참여 방식을 골라 주세요',
      optionId: 312,
      optionName: '오프라인 현장 참여',
      additionalPrice: 10000,
    },
  ],
  payment: { paidAmount: 39000, refundAmount: 39000, paymentMethod: '카드' },
  answerItems: [
    {
      questionId: 100,
      type: 'SHORT_TEXT',
      title: '이전 질문',
      isDeleted: true,
      value: '삭제 전 답',
    },
  ],
};

let queryClient: QueryClient;

const renderPage = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MyApplicationPage slug="portfolio-1115" />
    </QueryClientProvider>,
  );

beforeEach(() => {
  jest.clearAllMocks();
  queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  mockAuth({ isLoggedIn: true, isInitialized: true });
  mockForm(paidFormFixture);
});

describe('MyApplicationPage', () => {
  it('취소 가능: 신청 완료 배지, 결제·신청 내용, 마감 안내, 신청 취소 버튼', () => {
    mockMyApplication(APPLICATION_1042);
    renderPage();

    expect(screen.getByText('신청 확인')).toBeInTheDocument();
    expect(screen.getByText('신청 완료')).toBeInTheDocument();
    expect(
      screen.getByText('현직자와 함께하는 포트폴리오 집중 클래스'),
    ).toBeInTheDocument();
    expect(screen.getByText('letscareer@example.com')).toBeInTheDocument();
    expect(screen.getByText('2026.11.02 13:24')).toBeInTheDocument();
    // 기본 금액 = 49,000 - 0 - 20,000
    expect(screen.getByText('29,000원')).toBeInTheDocument();
    expect(screen.getByText('+20,000원')).toBeInTheDocument();
    expect(screen.getByText('49,000원')).toBeInTheDocument();
    expect(screen.getByText('카드')).toBeInTheDocument();
    expect(screen.queryByText('환불 금액')).not.toBeInTheDocument();
    expect(screen.getByText('월, 수')).toBeInTheDocument();
    expect(
      screen.getByText(/11\.10\(화\) 23:59까지 취소할 수 있어요/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '신청 취소' }),
    ).toBeInTheDocument();
  });

  it('첨부 답은 파일명만 보이고 링크가 아니다', () => {
    mockMyApplication(APPLICATION_1042);
    renderPage();

    const fileName = screen.getByText('김렛커_이력서_최종.pdf');
    expect(fileName.closest('a')).toBeNull();
    expect(screen.queryByText(/one-time-form\/attachment/)).toBeNull();
  });

  it('마감 후: 안내만 보이고 신청 취소 버튼이 없다. 내용은 펼쳐서 본다', () => {
    mockMyApplication({ ...APPLICATION_1042, isCancelable: false });
    renderPage();

    expect(
      screen.getByText(/취소 기간\(11\.10까지\)이 지나 직접 취소할 수 없어요/),
    ).toBeInTheDocument();
    expect(screen.getByText('49,000원 결제')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '신청 취소' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('신청 내용')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '신청 내용 보기' }));
    expect(screen.getByText('신청 내용')).toBeInTheDocument();
    expect(screen.getByText('김렛커_이력서_최종.pdf')).toBeInTheDocument();
  });

  it('취소됨(신청 1043): 취소됨 배지, 취소 일시, 환불 금액, 삭제된 질문 표시', () => {
    mockMyApplication(APPLICATION_1043);
    renderPage();

    expect(screen.getByText('취소됨')).toBeInTheDocument();
    expect(screen.queryByText('신청 완료')).not.toBeInTheDocument();
    expect(
      screen.getByText(
        '2026.11.03 14:02에 취소했어요. 39,000원을 결제한 수단으로 돌려드려요.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('환불 금액')).toBeInTheDocument();
    // 기본 29,000 + 오프라인 10,000 = 결제 39,000 = 환불 39,000
    expect(screen.getByText('29,000원')).toBeInTheDocument();
    expect(screen.getAllByText('39,000원')).toHaveLength(2);
    expect(screen.getByText('(삭제된 질문)')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '신청 취소' }),
    ).not.toBeInTheDocument();
  });

  it('신청 없음(null): 안내와 신청 페이지 링크', () => {
    mockMyApplication(null);
    renderPage();

    expect(screen.getByText('신청 내역이 없어요')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '신청하러 가기' })).toHaveAttribute(
      'href',
      '/form/portfolio-1115',
    );
  });

  it('결제 수단이 null 이면 줄을 숨긴다', () => {
    mockMyApplication({
      ...APPLICATION_1042,
      payment: { paidAmount: 0, refundAmount: 0, paymentMethod: null },
      selectedOptions: [],
    });
    renderPage();

    expect(screen.getByText('결제 정보')).toBeInTheDocument();
    expect(screen.queryByText('결제 수단')).not.toBeInTheDocument();
  });

  it('무료 폼(payment null)은 결제 정보를 그리지 않는다', () => {
    mockMyApplication({ ...APPLICATION_1042, payment: null });
    renderPage();

    expect(screen.queryByText('결제 정보')).not.toBeInTheDocument();
    expect(screen.getByText('신청 내용')).toBeInTheDocument();
  });

  it('비로그인이면 로그인 안내, 로그인 후 /my 로 돌아온다', () => {
    mockAuth({ isLoggedIn: false, isInitialized: true });
    mockMyApplication(undefined);
    renderPage();

    expect(
      screen.getByRole('link', { name: '로그인하고 확인하기' }),
    ).toHaveAttribute(
      'href',
      `/login?redirect=${encodeURIComponent('/form/portfolio-1115/my')}`,
    );
  });

  it('로그인 상태여도 U2 가 403 이면 로그인 안내, 로그인 후 /my 로 돌아온다', () => {
    mockMyApplication(
      undefined,
      new ApiError({
        status: 403,
        code: 'API_ERROR',
        message: 'Request failed with status code 403',
        endpoint: '/one-time-form/portfolio-1115/my',
        method: 'GET',
      }),
    );
    renderPage();

    expect(
      screen.getByRole('link', { name: '로그인하고 확인하기' }),
    ).toHaveAttribute(
      'href',
      `/login?redirect=${encodeURIComponent('/form/portfolio-1115/my')}`,
    );
  });

  it('U1 404(비공개 폼)여도 U2 에 신청이 있으면 상품 카드 없이 그린다', () => {
    mockForm(undefined, NOT_FOUND);
    mockMyApplication(APPLICATION_1042);
    renderPage();

    expect(screen.getByText('신청 완료')).toBeInTheDocument();
    expect(
      screen.queryByText('현직자와 함께하는 포트폴리오 집중 클래스'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('김렛커_이력서_최종.pdf')).toBeInTheDocument();
  });

  it('U1 404 이고 신청도 없으면 없는 페이지', () => {
    mockForm(undefined, NOT_FOUND);
    mockMyApplication(null);
    renderPage();

    expect(
      screen.getByText('신청 페이지를 찾을 수 없어요'),
    ).toBeInTheDocument();
  });

  it('U2 404 면 없는 페이지', () => {
    mockForm(undefined, NOT_FOUND);
    mockMyApplication(undefined, NOT_FOUND);
    renderPage();

    expect(
      screen.getByText('신청 페이지를 찾을 수 없어요'),
    ).toBeInTheDocument();
  });
});

describe('MyApplicationPage 신청 취소(계약 U5, 시안 5절)', () => {
  const cancelError = (status: number, code: string, message = '') =>
    new ApiError({
      status,
      code,
      message,
      endpoint: '/application/1042',
      method: 'DELETE',
    });

  const openSheet = () => {
    fireEvent.click(screen.getByRole('button', { name: '신청 취소' }));
    return screen.getByRole('dialog');
  };

  it('성공: 신청 ID 로 U5 를 부르고 U2 를 무효화한 뒤 취소 완료 화면을 보인다', async () => {
    mockMyApplication(APPLICATION_1042);
    mockedDelete.mockResolvedValue({ data: { data: null } });
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    renderPage();

    const sheet = openSheet();
    expect(within(sheet).getByText('신청을 취소할까요?')).toBeInTheDocument();
    expect(within(sheet).getAllByText('49,000원')).toHaveLength(2);
    expect(within(sheet).getByText('환불 금액')).toBeInTheDocument();
    fireEvent.click(within(sheet).getByRole('button', { name: '취소하기' }));

    expect(await screen.findByText('신청을 취소했어요')).toBeInTheDocument();
    expect(mockedDelete).toHaveBeenCalledWith('/application/1042', {
      params: { type: 'ONE_TIME_FORM' },
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ['MyOneTimeFormApplicationQueryKey', 'portfolio-1115'],
    });
    expect(
      screen.getByText(/49,000원을 결제한 수단으로 돌려드려요/),
    ).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('취소 완료 화면은 다시 불러온 U2 의 취소 일시를 보인다', async () => {
    mockMyApplication(APPLICATION_1042);
    mockedDelete.mockImplementation(async () => {
      // 훅의 무효화로 U2 가 취소 상태로 다시 온 것처럼 바꾼다
      mockMyApplication({ ...APPLICATION_1043, applicationId: 1042 });
      return { data: { data: null } };
    });
    renderPage();

    fireEvent.click(
      within(openSheet()).getByRole('button', { name: '취소하기' }),
    );

    expect(
      await screen.findByText(/2026\.11\.03 14:02 취소/),
    ).toBeInTheDocument();
  });

  it('마감 지남(400 APPLICATION_CANNOT_CANCELED): 안내를 보이고 U2 를 다시 부른다', async () => {
    mockMyApplication(APPLICATION_1042);
    mockedDelete.mockRejectedValue(
      cancelError(
        400,
        'APPLICATION_CANNOT_CANCELED',
        '환불이 불가능한 기간입니다.',
      ),
    );
    renderPage();

    const sheet = openSheet();
    fireEvent.click(within(sheet).getByRole('button', { name: '취소하기' }));

    expect(await within(sheet).findByRole('alert')).toHaveTextContent(
      '취소 기간이 지나 직접 취소할 수 없어요.',
    );
    expect(refetch).toHaveBeenCalled();
    expect(
      within(sheet).getByRole('button', { name: '취소하기' }),
    ).toBeDisabled();
    expect(screen.queryByText('신청을 취소했어요')).not.toBeInTheDocument();
  });

  it('이미 취소(409): U2 를 다시 불러 취소 상태를 보인다', async () => {
    mockMyApplication(APPLICATION_1042);
    mockedDelete.mockRejectedValue(
      cancelError(409, 'APPLICATION_ALREADY_CANCELED'),
    );
    renderPage();

    fireEvent.click(
      within(openSheet()).getByRole('button', { name: '취소하기' }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '이미 취소한 신청이에요.',
    );
    expect(refetch).toHaveBeenCalled();
  });

  it('401: 로그인 후 /my 로 돌아오게 로그인 페이지로 보낸다', async () => {
    mockMyApplication(APPLICATION_1042);
    mockedDelete.mockRejectedValue(cancelError(401, 'UNAUTHORIZED'));
    renderPage();

    fireEvent.click(
      within(openSheet()).getByRole('button', { name: '취소하기' }),
    );

    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(
        `/login?redirect=${encodeURIComponent('/form/portfolio-1115/my')}`,
      ),
    );
  });

  it('그 밖의 실패는 일반 안내를 보이고 다시 시도할 수 있다', async () => {
    mockMyApplication(APPLICATION_1042);
    mockedDelete.mockRejectedValue(cancelError(404, 'APPLICATION_NOT_FOUND'));
    renderPage();

    const sheet = openSheet();
    fireEvent.click(within(sheet).getByRole('button', { name: '취소하기' }));

    expect(await within(sheet).findByRole('alert')).toHaveTextContent(
      '취소하지 못했어요. 잠시 후 다시 시도해 주세요.',
    );
    expect(refetch).not.toHaveBeenCalled();
    expect(
      within(sheet).getByRole('button', { name: '취소하기' }),
    ).toBeEnabled();
  });

  it('0원 신청(시드 1050): 0원 환불, 환불 수단 안내 없이 취소된다', async () => {
    mockMyApplication({
      ...APPLICATION_1042,
      applicationId: 1050,
      selectedOptions: [],
      payment: { paidAmount: 0, refundAmount: 0, paymentMethod: null },
    });
    mockedDelete.mockResolvedValue({ data: { data: null } });
    renderPage();

    const sheet = openSheet();
    expect(within(sheet).getAllByText('0원')).toHaveLength(2);
    expect(within(sheet).queryByText(/결제한 수단/)).not.toBeInTheDocument();
    expect(within(sheet).queryByText(/카드사/)).not.toBeInTheDocument();
    fireEvent.click(within(sheet).getByRole('button', { name: '취소하기' }));

    expect(await screen.findByText('신청을 취소했어요')).toBeInTheDocument();
    expect(mockedDelete).toHaveBeenCalledWith('/application/1050', {
      params: { type: 'ONE_TIME_FORM' },
    });
    expect(screen.queryByText(/돌려드려요/)).not.toBeInTheDocument();
  });

  it('무료 폼(payment null): 환불 금액 줄이 없다', () => {
    mockMyApplication({ ...APPLICATION_1042, payment: null });
    renderPage();

    const sheet = openSheet();
    expect(within(sheet).queryByText('환불 금액')).not.toBeInTheDocument();
    expect(within(sheet).queryByText('결제 금액')).not.toBeInTheDocument();
  });

  it('유지하기: 시트를 닫고 U5 를 부르지 않는다', () => {
    mockMyApplication(APPLICATION_1042);
    renderPage();

    fireEvent.click(
      within(openSheet()).getByRole('button', { name: '유지하기' }),
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(mockedDelete).not.toHaveBeenCalled();
    expect(screen.getByText('신청 완료')).toBeInTheDocument();
  });
});
