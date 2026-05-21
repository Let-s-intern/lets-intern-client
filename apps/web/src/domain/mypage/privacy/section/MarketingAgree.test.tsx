import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';

const getMock = jest.fn();
jest.mock('../../../../utils/axios', () => ({
  __esModule: true,
  default: {
    get: (...args: unknown[]) => getMock(...args),
  },
}));

// useAuthStore selector 사용 패턴: 함수 호출 시 selector를 받아 결과 반환.
let mockIsLoggedIn = false;
jest.mock('@/store/useAuthStore', () => ({
  __esModule: true,
  default: <T,>(selector: (state: { isLoggedIn: boolean }) => T): T =>
    selector({ isLoggedIn: mockIsLoggedIn }),
}));

import MarketingAgree from './MarketingAgree';

function renderMarketingAgree() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 0 } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MarketingAgree />
    </QueryClientProvider>,
  );
}

describe('MarketingAgree enabled 가드', () => {
  beforeEach(() => {
    getMock.mockReset();
    getMock.mockResolvedValue({ data: { data: { marketingAgree: false } } });
  });

  it('비로그인(isLoggedIn=false) 상태에서는 /user 호출이 발생하지 않는다', async () => {
    mockIsLoggedIn = false;
    renderMarketingAgree();

    // 충분한 시간을 줘서 query가 실행될 기회를 보장 후 호출 안 됨을 검증
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(getMock).not.toHaveBeenCalled();
  });

  it('로그인(isLoggedIn=true) 상태에서는 /user 호출이 발생한다', async () => {
    mockIsLoggedIn = true;
    renderMarketingAgree();

    await waitFor(() => {
      expect(getMock).toHaveBeenCalledWith('/user');
    });
  });
});
