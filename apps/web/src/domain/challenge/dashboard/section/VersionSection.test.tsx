import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import axios from '@/utils/axios';

import VersionSection from './VersionSection';

// application.ts 가 @letscareer/api(import.meta 사용)를 임포트 그래프로 물고 있어 모킹한다.
jest.mock('@letscareer/api', () => ({
  ApiError: class ApiError extends Error {},
  createDefaultAxios: jest.fn(() => ({})),
  createV2Axios: jest.fn(() => ({})),
  fetchJson: jest.fn(),
}));
jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn() },
}));
jest.mock('@/utils/axiosV2', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn() },
}));

const axiosGet = axios.get as jest.Mock;

const CURRENT = { challengeVersionId: 1, title: '대학생' };
const VERSION_LIST = [CURRENT, { challengeVersionId: 2, title: '이직자' }];

function renderSection(version: Record<string, unknown>) {
  axiosGet.mockResolvedValue({ data: { data: version } });
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const { container } = render(
    <QueryClientProvider client={client}>
      <VersionSection applicationId="7" />
    </QueryClientProvider>,
  );
  return { client, container };
}

beforeEach(() => {
  axiosGet.mockReset();
});

describe('대시보드 VersionSection', () => {
  it('변경할 수 있으면 버전명과 변경 버튼을 보여 주고, 누르면 모달을 연다', async () => {
    renderSection({
      currentVersion: CURRENT,
      versionList: VERSION_LIST,
      deadline: '2026-09-20T23:59:00',
      changeable: true,
      unavailableReason: null,
    });

    expect(await screen.findByText('대학생')).toBeInTheDocument();
    expect(screen.getByText('내 버전')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '변경' }));
    expect(await screen.findByText('버전 변경')).toBeInTheDocument();
  });

  it('변경할 수 없으면 버전명만 보여 준다', async () => {
    renderSection({
      currentVersion: CURRENT,
      versionList: VERSION_LIST,
      deadline: '2026-09-20T23:59:00',
      changeable: false,
      unavailableReason: 'ALREADY_CHANGED',
    });

    expect(await screen.findByText('대학생')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '변경' })).toBeNull();
  });

  it('버전 없이 신청했으면 미선택과 선택 버튼을 보이고, 모달은 현재 뱃지 없이 연다', async () => {
    renderSection({
      currentVersion: null,
      versionList: VERSION_LIST,
      deadline: '2026-09-20T23:59:00',
      changeable: true,
      unavailableReason: null,
    });

    expect(await screen.findByText('미선택')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '변경' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: '선택' }));
    expect(await screen.findByText('버전 변경')).toBeInTheDocument();
    expect(screen.queryByText('현재')).toBeNull();
  });

  it.each(['NO_VERSION', 'LIGHT'])('%s 이면 그리지 않는다', async (reason) => {
    const { client, container } = renderSection({
      currentVersion: CURRENT,
      versionList: VERSION_LIST,
      deadline: null,
      changeable: false,
      unavailableReason: reason,
    });

    await waitFor(() =>
      expect(
        client.getQueryState(['useApplicationVersionQueryKey', '7'])?.status,
      ).toBe('success'),
    );
    expect(container).toBeEmptyDOMElement();
  });
});
