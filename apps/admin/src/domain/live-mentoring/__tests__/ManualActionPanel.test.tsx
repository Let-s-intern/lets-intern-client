import {
  MY_LIVE_MENTORING_ID,
  resetLiveMentoringOpeningHistory,
  resetLiveMentoringStatus,
} from '@letscareer/mocks';
import { server } from '@letscareer/mocks/node';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { AdminSnackbarProvider } from '@/hooks/useAdminSnackbar';
import {
  ManualOpeningActionPanel,
  ManualProductActionPanel,
} from '../ManualActionPanel';

/**
 * 임시 영역이 고정해야 하는 동작 세 가지를 검증한다.
 *
 * 1. 확인 절차 — `window.confirm` 을 취소하면 요청 자체를 보내지 않는다.
 *    ID 를 손으로 입력하는 도구라 오타 한 번이 남의 상품을 승인한다.
 * 2. 오류 코드 노출 — 실패 문구에 서버 코드가 그대로 실린다.
 * 3. 멱등 처리 — 이미 종료된 개설에 대한 재요청을 실패로 다루지 않는다.
 */

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  server.resetHandlers();
  resetLiveMentoringStatus();
  resetLiveMentoringOpeningHistory();
  vi.restoreAllMocks();
});
afterAll(() => server.close());

const renderPanel = (node: React.ReactNode) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AdminSnackbarProvider>{node}</AdminSnackbarProvider>
    </QueryClientProvider>,
  );
};

/** 목 상품을 `PENDING_REVIEW` 로 올려 승인 가능한 상태를 만든다. */
const submitForReview = () =>
  fetch('https://example.test/mentor/live-mentoring/submit', {
    method: 'POST',
  });

/** 목 상품의 현재 상태. */
const readStatus = async () => {
  const res = await fetch(
    'https://example.test/mentor/live-mentoring/settings',
  );
  return (await res.json()).data.status as string;
};

describe('상품 임시 영역', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  const typeId = async (id: number) => {
    await user.type(screen.getByLabelText('상품 ID'), String(id));
  };

  it('확인을 취소하면 승인 요청을 보내지 않는다', async () => {
    await submitForReview();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderPanel(<ManualProductActionPanel />);

    await typeId(MY_LIVE_MENTORING_ID);
    await user.click(screen.getByRole('button', { name: '승인' }));

    expect(window.confirm).toHaveBeenCalled();
    expect(await readStatus()).toBe('PENDING_REVIEW');
  });

  it('확인하면 승인되고 성공 문구가 뜬다', async () => {
    await submitForReview();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderPanel(<ManualProductActionPanel />);

    await typeId(MY_LIVE_MENTORING_ID);
    await user.click(screen.getByRole('button', { name: '승인' }));

    expect(
      await screen.findByText(
        `상품 ID ${MY_LIVE_MENTORING_ID} 을(를) 승인했습니다.`,
      ),
    ).toBeInTheDocument();
    await waitFor(async () => expect(await readStatus()).toBe('APPROVED'));
  });

  it('잘못된 상태 전이는 서버 오류 코드를 그대로 보여준다', async () => {
    // 시드는 DRAFT — 제출 전이라 승인할 수 없다.
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderPanel(<ManualProductActionPanel />);

    await typeId(MY_LIVE_MENTORING_ID);
    await user.click(screen.getByRole('button', { name: '승인' }));

    expect(
      await screen.findByText(/LIVE_MENTORING_INVALID_STATE/),
    ).toBeInTheDocument();
  });

  it('없는 상품 ID 는 404 코드를 그대로 보여준다', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderPanel(<ManualProductActionPanel />);

    await typeId(MY_LIVE_MENTORING_ID + 9999);
    await user.click(screen.getByRole('button', { name: '반려' }));

    expect(
      await screen.findByText(/LIVE_MENTORING_NOT_FOUND/),
    ).toBeInTheDocument();
  });

  it('ID 를 입력하기 전에는 액션 버튼이 모두 비활성이다', () => {
    renderPanel(<ManualProductActionPanel />);

    for (const name of ['상세 보기', '승인', '반려']) {
      expect(screen.getByRole('button', { name })).toBeDisabled();
    }
  });

  it('상세 보기는 web 공개 상세를 새 탭으로 연다', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    renderPanel(<ManualProductActionPanel />);

    await typeId(MY_LIVE_MENTORING_ID);
    await user.click(screen.getByRole('button', { name: '상세 보기' }));

    expect(open).toHaveBeenCalledWith(
      `http://localhost:3000/live-mentoring/${MY_LIVE_MENTORING_ID}`,
      '_blank',
      'noopener,noreferrer',
    );
  });
});

describe('개설 임시 영역', () => {
  /** 시드 개설 이력의 첫 행은 이미 `CLOSED` 다. */
  const CLOSED_OPENING_ID = 902;

  it('이미 종료된 개설의 재요청을 실패로 다루지 않는다', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderPanel(<ManualOpeningActionPanel />);

    await user.type(
      screen.getByLabelText('개설 ID'),
      String(CLOSED_OPENING_ID),
    );
    await user.click(screen.getByRole('button', { name: '강제 종료' }));

    expect(
      await screen.findByText(
        `개설 ID ${CLOSED_OPENING_ID} 을(를) 종료했습니다.`,
      ),
    ).toBeInTheDocument();
  });

  it('확인을 취소하면 종료 요청을 보내지 않는다', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderPanel(<ManualOpeningActionPanel />);

    await user.type(
      screen.getByLabelText('개설 ID'),
      String(CLOSED_OPENING_ID),
    );
    await user.click(screen.getByRole('button', { name: '강제 종료' }));

    expect(window.confirm).toHaveBeenCalled();
    expect(screen.queryByText(/종료했습니다/)).not.toBeInTheDocument();
  });
});
