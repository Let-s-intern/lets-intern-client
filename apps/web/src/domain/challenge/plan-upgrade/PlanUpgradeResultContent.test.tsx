import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { StrictMode } from 'react';

// 패키지 entry(@letscareer/api) 는 import.meta 때문에 jest 에서 로드되지 않는다.
// 에러 판별이 실제 ApiError 클래스를 보도록 errors 서브경로에서 가져온다.
import { ApiError } from '@letscareer/api/errors';
import { AxiosError, AxiosHeaders } from 'axios';
import type { Dayjs } from 'dayjs';

import dayjs from '@/lib/dayjs';
import useAuthStore from '@/store/useAuthStore';
import axios from '@/utils/axios';
import axiosV2 from '@/utils/axiosV2';

import PlanUpgradeResultContent from './PlanUpgradeResultContent';

const replace = jest.fn();
let search = '';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace }),
  useSearchParams: () => new URLSearchParams(search),
}));
jest.mock('@letscareer/api', () => ({
  ApiError: jest.requireActual('@letscareer/api/errors').ApiError,
  createDefaultAxios: jest.fn(() => ({})),
  createV2Axios: jest.fn(() => ({})),
  fetchJson: jest.fn(),
}));
jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));
jest.mock('@/utils/axiosV2', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));
jest.mock('@/store/useAuthStore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const axiosPost = axios.post as jest.Mock;
const axiosV2Get = axiosV2.get as jest.Mock;
const useAuthStoreMock = useAuthStore as unknown as jest.Mock;

const RESULT_SEARCH =
  'plan=STANDARD&paymentKey=tgen_payment_key&orderId=plan-upgrade-7-1760000000000&amount=85000&paymentType=NORMAL';

const confirmResponse = {
  applicationId: 7,
  programId: 3,
  fromPlan: 'BASIC',
  toPlan: 'STANDARD',
  additionalAmount: 85000,
  paidAt: '2026-09-20T10:00:00',
  receiptUrl: 'https://dashboard.tosspayments.com/receipt',
  method: '카드',
};

const mypageApplications = (startDate: Dayjs) => ({
  data: {
    data: {
      applicationList: [
        {
          id: 7,
          programId: 3,
          programType: 'CHALLENGE',
          programTitle: '경험정리 챌린지 20기',
          programStartDate: startDate.format('YYYY-MM-DDTHH:mm:ss'),
        },
      ],
    },
  },
});

const apiError = (code: string, serverMessage: string) =>
  new ApiError({
    code,
    message: serverMessage,
    status: 400,
    endpoint: '/plan-upgrade/7/confirm',
    method: 'POST',
    serverMessage,
  });

const renderPage = (query: string) => {
  search = query;
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const ui = (
    <StrictMode>
      <PlanUpgradeResultContent applicationId="7" />
    </StrictMode>
  );
  const view = render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
  return { ...view, rerenderPage: () => view.rerender(ui) };
};

beforeEach(() => {
  replace.mockReset();
  axiosPost.mockReset();
  axiosV2Get
    .mockReset()
    .mockResolvedValue(mypageApplications(dayjs().subtract(1, 'day')));
  useAuthStoreMock.mockReturnValue({ isLoggedIn: true, isInitialized: true });
  window.dataLayer = [];
  window.history.pushState({}, '', '/plan-upgrade/7/result');
});

describe('PlanUpgradeResultContent - 승인 호출', () => {
  it('승인을 한 번만 부르고 쿼리 amount 는 숫자로 넘긴다', async () => {
    axiosPost.mockResolvedValue({ data: { data: confirmResponse } });

    const { rerenderPage } = renderPage(RESULT_SEARCH);

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: '플랜 업그레이드 완료' }),
      ).toBeInTheDocument(),
    );
    expect(axiosPost).toHaveBeenCalledTimes(1);
    expect(axiosPost).toHaveBeenCalledWith('/plan-upgrade/7/confirm', {
      toPlan: 'STANDARD',
      paymentKey: 'tgen_payment_key',
      orderId: 'plan-upgrade-7-1760000000000',
      amount: 85000,
    });

    // 끝나면 done=true 를 붙인 주소로 바꾼다. 바뀐 쿼리로 다시 그려도 부르지 않는다
    expect(replace).toHaveBeenCalledWith(
      `/plan-upgrade/7/result?${RESULT_SEARCH}&done=true`,
    );
    search = `${RESULT_SEARCH}&done=true`;
    rerenderPage();
    expect(axiosPost).toHaveBeenCalledTimes(1);
    expect(replace).not.toHaveBeenCalledWith('/mypage/application');
  });

  it('done=true 로 다시 들어오면 승인을 부르지 않고 마이페이지로 보낸다', async () => {
    renderPage(`${RESULT_SEARCH}&done=true`);

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith('/mypage/application'),
    );
    expect(axiosPost).not.toHaveBeenCalled();
  });

  it('비로그인이면 승인을 부르지 않고 쿼리를 포함해 로그인으로 보낸다', async () => {
    useAuthStoreMock.mockReturnValue({
      isLoggedIn: false,
      isInitialized: true,
    });
    window.history.pushState({}, '', `/plan-upgrade/7/result?${RESULT_SEARCH}`);

    renderPage(RESULT_SEARCH);

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith(
        `/login?redirect=${encodeURIComponent(`/plan-upgrade/7/result?${RESULT_SEARCH}`)}`,
      ),
    );
    expect(axiosPost).not.toHaveBeenCalled();
  });
});

describe('PlanUpgradeResultContent - 성공 화면', () => {
  it('시작한 챌린지는 마이페이지와 대시보드 입장 버튼을 보이고 결제 상세를 채운다', async () => {
    axiosPost.mockResolvedValue({ data: { data: confirmResponse } });

    renderPage(RESULT_SEARCH);

    expect(
      await screen.findByRole('link', { name: '대시보드 입장' }),
    ).toHaveAttribute('href', '/challenge/7/3');
    expect(screen.getByRole('link', { name: '마이페이지로' })).toHaveAttribute(
      'href',
      '/mypage/application',
    );
    expect(screen.getByText('경험정리 챌린지 20기')).toBeInTheDocument();
    expect(screen.getByText('STANDARD')).toHaveClass('text-primary');
    expect(screen.getByText('85,000원')).toBeInTheDocument();
    expect(screen.getByText('9월 20일 10:00')).toBeInTheDocument();
    expect(screen.getByText('카드')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '영수증 보기' })).toHaveAttribute(
      'target',
      '_blank',
    );
    expect(window.dataLayer).toContainEqual({
      event: 'plan_upgrade_success',
      program_id: 3,
      from_plan: 'BASIC',
      to_plan: 'STANDARD',
      payment_amount: 85000,
      order_id: 'plan-upgrade-7-1760000000000',
    });
  });

  it('시작 전 챌린지는 마이페이지 버튼 하나만 보인다', async () => {
    axiosPost.mockResolvedValue({ data: { data: confirmResponse } });
    axiosV2Get.mockResolvedValue(mypageApplications(dayjs().add(3, 'day')));

    renderPage(RESULT_SEARCH);

    expect(await screen.findByText('경험정리 챌린지 20기')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: '마이페이지로' })).toHaveLength(
      1,
    );
    expect(
      screen.queryByRole('link', { name: '대시보드 입장' }),
    ).not.toBeInTheDocument();
  });
});

describe('PlanUpgradeResultContent - 승인 실패', () => {
  it('서버 문구를 보이고 고른 플랜으로 다시 시도하게 한다', async () => {
    axiosPost.mockRejectedValue(
      apiError(
        'PLAN_UPGRADE_AMOUNT_MISMATCH',
        '결제 금액이 올바르지 않습니다. 화면을 새로고침해주세요.',
      ),
    );

    renderPage(RESULT_SEARCH);

    expect(
      await screen.findByRole('heading', {
        name: '업그레이드를 완료하지 못했어요',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        '결제 금액이 올바르지 않습니다. 화면을 새로고침해주세요.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('결제는 자동으로 취소됐어요'),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: '다시 시도하기' })).toHaveAttribute(
      'href',
      '/plan-upgrade/7?plan=STANDARD',
    );
    expect(window.dataLayer).toEqual([]);
  });

  it('저장 실패로 결제가 취소됐으면 자동 취소 안내를 더한다', async () => {
    axiosPost.mockRejectedValue(
      new AxiosError('Request failed', '500', undefined, null, {
        status: 500,
        statusText: '',
        data: {
          code: 'PLAN_UPGRADE_SAVE_FAILED',
          message: '결제는 취소되었습니다. 잠시 후 다시 시도해주세요.',
        },
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      }),
    );

    renderPage(RESULT_SEARCH);

    expect(await screen.findByText('결제는 자동으로 취소됐어요')).toHaveClass(
      'text-primary',
    );
    expect(
      screen.getByText('결제는 취소되었습니다. 잠시 후 다시 시도해주세요.'),
    ).toBeInTheDocument();
  });
});
