import {
  MY_LIVE_MENTORING_ID,
  resetLiveMentoringOpeningHistory,
  resetLiveMentoringStatus,
} from '@letscareer/mocks';
import { server } from '@letscareer/mocks/node';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
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
import ManualActionPanel from '../ManualActionPanel';

/**
 * 임시 영역이 고정해야 하는 동작을 검증한다.
 *
 * 1. 식별자 해석 — 관리자는 ID 를 모른다. 멘토를 고르면 공개 상세로 상품·개설 ID 가 나와야 한다.
 * 2. 확인 절차 — `window.confirm` 을 취소하면 요청 자체를 보내지 않는다. 되돌리는 API 가 없다.
 * 3. 오류 코드 노출 — 실패 문구에 서버 코드가 그대로 실린다.
 * 4. 멱등 처리 — 이미 종료된 개설에 대한 재요청을 실패로 다루지 않는다.
 * 5. 상세 미저장 멘토 — 404 를 오류가 아니라 "승인 대상이 아님" 안내로 다룬다.
 */

/** 목 데이터의 로그인 멘토("나"). `MY_LIVE_MENTORING_ID` 가 이 멘토의 상품이다. */
const MY_MENTOR_ID = 1;
/** 상세 페이지를 한 번도 저장하지 않은 멘토 — 공개 상세가 404 다. */
const NO_DETAIL_MENTOR_ID = 777;

const MENTOR_LIST = {
  status: 200,
  data: {
    mentorList: [
      { id: MY_MENTOR_ID, name: '김멘토', nickname: '자소서장인' },
      { id: NO_DETAIL_MENTOR_ID, name: '박신규', nickname: '준비중' },
    ],
  },
};

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));

beforeEach(() => {
  server.use(
    http.get('*/admin/user/mentor', () => HttpResponse.json(MENTOR_LIST)),
    // 공유 목은 모르는 멘토를 첫 멘토로 폴백시키지만 실서버는 404 다.
    // 상세 미저장 케이스를 재현하려고 이 멘토 하나만 경로에 박아 덮는다.
    // (`:mentorId` 로 덮고 나머지를 passthrough 하면 MSW 가 자기 요청을 다시 가로채 죽는다.)
    http.get(`*/live-mentoring/mentors/${NO_DETAIL_MENTOR_ID}`, () =>
      HttpResponse.json(
        {
          status: 404,
          code: 'LIVE_MENTORING_NOT_FOUND',
          message: '라이브 멘토링을 찾을 수 없습니다.',
        },
        { status: 404 },
      ),
    ),
  );
});

afterEach(() => {
  server.resetHandlers();
  resetLiveMentoringStatus();
  resetLiveMentoringOpeningHistory();
  vi.restoreAllMocks();
});
afterAll(() => server.close());

const renderPanel = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AdminSnackbarProvider>
        <ManualActionPanel />
      </AdminSnackbarProvider>
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

describe('임시 영역 — 멘토를 골라 식별자를 해석한다', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  /**
   * 멘토 목록이 도착할 때까지 기다린다.
   * `select` 자체는 처음부터 렌더되므로 그것만 기다리면 옵션이 비어 있는 채로 진행된다.
   */
  const waitForMentorOptions = async () => {
    await waitFor(() =>
      expect(
        screen.getByRole('option', { name: /김멘토/ }),
      ).toBeInTheDocument(),
    );
  };

  /** 멘토를 고른다. 해석 결과는 호출한 쪽에서 기다린다. */
  const selectMentor = async (mentorId: number) => {
    await waitForMentorOptions();
    await user.selectOptions(
      screen.getByLabelText('멘토 선택'),
      String(mentorId),
    );
  };

  it('멘토를 고르기 전에는 액션 버튼이 아예 없다', async () => {
    renderPanel();

    await waitForMentorOptions();
    for (const name of ['상세 보기', '승인', '반려', '강제 종료']) {
      expect(screen.queryByRole('button', { name })).not.toBeInTheDocument();
    }
  });

  it('멘토를 고르면 상품 ID·상품명·현재 개설을 보여준다', async () => {
    renderPanel();
    await selectMentor(MY_MENTOR_ID);

    expect(
      await screen.findByText(String(MY_LIVE_MENTORING_ID)),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '승인' })).toBeInTheDocument();
  });

  it('상세를 저장하지 않은 멘토는 승인 대상이 아니라고 알린다', async () => {
    renderPanel();
    await selectMentor(NO_DETAIL_MENTOR_ID);

    expect(
      await screen.findByText(/상세 페이지를 저장하지 않았습니다/),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '승인' }),
    ).not.toBeInTheDocument();
  });

  it('이름으로 멘토 후보를 걸러낸다', async () => {
    renderPanel();
    await waitForMentorOptions();

    await user.type(screen.getByLabelText('멘토 검색'), '박신규');

    expect(
      screen.queryByRole('option', { name: /김멘토/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: /박신규/ })).toBeInTheDocument();
  });

  it('확인을 취소하면 승인 요청을 보내지 않는다', async () => {
    await submitForReview();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderPanel();
    await selectMentor(MY_MENTOR_ID);

    await user.click(await screen.findByRole('button', { name: '승인' }));

    expect(window.confirm).toHaveBeenCalled();
    expect(await readStatus()).toBe('PENDING_REVIEW');
  });

  it('확인 문구에 멘토 이름과 상품명을 담는다', async () => {
    await submitForReview();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderPanel();
    await selectMentor(MY_MENTOR_ID);

    await user.click(await screen.findByRole('button', { name: '승인' }));

    expect(confirmSpy.mock.calls[0][0]).toMatch(/김멘토/);
  });

  it('확인하면 승인되고 성공 문구가 뜬다', async () => {
    await submitForReview();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderPanel();
    await selectMentor(MY_MENTOR_ID);

    await user.click(await screen.findByRole('button', { name: '승인' }));

    expect(await screen.findByText(/승인했습니다/)).toBeInTheDocument();
    await waitFor(async () => expect(await readStatus()).toBe('APPROVED'));
  });

  it('잘못된 상태 전이는 서버 오류 코드를 그대로 보여준다', async () => {
    // 시드는 DRAFT — 제출 전이라 승인할 수 없다.
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderPanel();
    await selectMentor(MY_MENTOR_ID);

    await user.click(await screen.findByRole('button', { name: '승인' }));

    expect(
      await screen.findByText(/LIVE_MENTORING_INVALID_STATE/),
    ).toBeInTheDocument();
  });

  it('상세 보기는 web 공개 상세를 새 탭으로 연다', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    renderPanel();
    await selectMentor(MY_MENTOR_ID);

    await user.click(await screen.findByRole('button', { name: '상세 보기' }));

    expect(open).toHaveBeenCalledWith(
      `http://localhost:3000/live-mentoring/${MY_LIVE_MENTORING_ID}`,
      '_blank',
      'noopener,noreferrer',
    );
  });
});
