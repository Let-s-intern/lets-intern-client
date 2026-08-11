import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ProgramUsers from '../ProgramUsers';

/**
 * 이용 히스토리가 `#application-{id}` 로 특정 신청서를 지목해 보낸다(LC-3201).
 *
 * 여기서 확인할 것은 **데이터가 도착한 뒤에** 그 행으로 데려가는가다.
 * 앵커만 달아 두면 화면에 들어오는 시점에 행의 DOM 이 없어 아무 일도 일어나지 않는다.
 *
 * 환불 실행 경로(모달·뮤테이션)는 이 변경의 범위가 아니라 목으로 막아 둔다.
 */

const axiosGet = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: {
    get: (...args: unknown[]) => axiosGet(...args),
  },
}));

vi.mock('@/api/adminRefund', () => ({
  useAdminRefundedApplicationIds: () => new Set<number>(),
  useAdminRefundMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar: vi.fn() }),
}));

/** 하단 액션은 드롭다운 묶음이라 이 검증과 무관하다. */
vi.mock(
  '@/domain/admin/program/program-user/bottom-action/BottomAction',
  () => ({
    default: () => null,
  }),
);

/** jsdom 에는 scrollIntoView 가 없다. 어느 요소로 옮겼는지까지 남긴다. */
const scrolledTo: Element[] = [];
Element.prototype.scrollIntoView = function scrollIntoView(this: Element) {
  scrolledTo.push(this);
};

const application = (id: number, name: string) => ({
  application: {
    id,
    name,
    email: `${name}@example.com`,
    phoneNum: '01000000000',
    isCanceled: false,
    createDate: '2026-07-28T10:00:00',
    orderId: `order-${id}`,
    finalPrice: 100000,
  },
});

const APPLICATIONS = [
  application(121, '김렛츠'),
  application(123, '오새로'),
  application(125, '박커리'),
];

const renderPage = (hash = '') => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        initialEntries={[`/programs/319/users?programType=CHALLENGE${hash}`]}
      >
        <Routes>
          <Route path="/programs/:programId/users" element={<ProgramUsers />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

const targetRow = (id = 123) => document.getElementById(`application-${id}`);

beforeEach(() => {
  scrolledTo.length = 0;
  axiosGet.mockReset();
  axiosGet.mockImplementation((url: string) => {
    if (url.endsWith('/title')) {
      return Promise.resolve({ data: { data: { title: '기필코 경험정리' } } });
    }
    return Promise.resolve({
      data: { data: { applicationList: APPLICATIONS } },
    });
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('ProgramUsers 신청서 지목', () => {
  it('참여자 행마다 찾아갈 자리를 만든다', async () => {
    renderPage();

    expect(await screen.findByText('오새로')).toBeInTheDocument();
    expect(targetRow(123)).not.toBeNull();
    expect(targetRow(121)).not.toBeNull();
  });

  it('해시로 지목된 행으로 데려간다', async () => {
    /*
      목록이 비동기로 오므로 화면에 들어오는 시점에는 그 행이 아직 없다.
      데이터가 도착한 뒤에 옮겨야 한다.
    */
    renderPage('#application-123');

    await screen.findByText('오새로');

    await waitFor(() => expect(scrolledTo).toHaveLength(1));
    expect(scrolledTo[0]).toBe(targetRow(123));
  });

  it('지목된 행을 눈에 띄게 표시한다', async () => {
    renderPage('#application-123');

    await screen.findByText('오새로');

    await waitFor(() => expect(targetRow(123)).toHaveClass('bg-amber-100'));
    // 지목되지 않은 행까지 물들이면 어느 건인지 알 수 없다.
    expect(targetRow(121)).not.toHaveClass('bg-amber-100');
  });

  it('해시가 없으면 아무 데로도 움직이지 않는다', async () => {
    renderPage();

    await screen.findByText('오새로');

    expect(scrolledTo).toHaveLength(0);
    expect(targetRow(123)).not.toHaveClass('bg-amber-100');
  });

  it('이 프로그램에 없는 신청서를 가리켜도 그냥 넘어간다', async () => {
    // 다른 프로그램의 신청서 id 를 들고 오는 링크가 있을 수 있다.
    renderPage('#application-99999');

    await screen.findByText('오새로');

    expect(scrolledTo).toHaveLength(0);
  });

  it('해시 모양이 다르면 무시한다', async () => {
    // 아무 문자열이나 셀렉터에 넣으면 의도치 않은 요소를 잡는다.
    renderPage('#application-abc');

    await screen.findByText('오새로');

    expect(scrolledTo).toHaveLength(0);
  });

  it('목록을 못 받으면 아무 일도 하지 않는다', async () => {
    axiosGet.mockImplementation((url: string) => {
      if (url.endsWith('/title')) {
        return Promise.resolve({
          data: { data: { title: '기필코 경험정리' } },
        });
      }
      return Promise.reject(new Error('failed'));
    });

    renderPage('#application-123');

    await screen.findByText(/기필코 경험정리/);

    expect(scrolledTo).toHaveLength(0);
  });
});

describe('ProgramUsers 강조 해제', () => {
  it('잠시 뒤 강조가 풀린다', async () => {
    /*
      강조가 계속 남으면 그 행이 특별한 상태(환불 대상 등)인 줄 오해한다.
      이 표에서 색은 곧 판단의 근거가 된다.
    */
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });

    renderPage('#application-123');

    /*
      가짜 시계 아래에서는 waitFor 가 스스로 시간을 밀어 주지 못한다.
      응답 프라미스와 react-query 의 알림 예약을 직접 흘려보낸다.
    */
    for (let i = 0; i < 5; i += 1) {
      await act(async () => {
        await Promise.resolve();
        vi.advanceTimersByTime(0);
      });
    }

    expect(targetRow(123)).toHaveClass('bg-amber-100');

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(targetRow(123)).not.toHaveClass('bg-amber-100');
  });
});

describe('ProgramUsers 기존 동작', () => {
  it('조회 파라미터의 타입으로 신청자를 불러온다', async () => {
    renderPage('#application-123');

    await screen.findByText('오새로');

    expect(axiosGet).toHaveBeenCalledWith('/challenge/319/applications');
  });

  it('참여자와 환불 버튼을 그대로 보여준다', async () => {
    // 이 화면은 환불의 홈이다. 지목·강조를 붙이며 실행 경로가 사라지면 안 된다.
    renderPage('#application-123');

    expect(await screen.findByText('김렛츠')).toBeInTheDocument();
    expect(await screen.findByText('박커리')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: '환불' })).toHaveLength(3);
    expect(screen.getAllByRole('button', { name: '부분환불' })).toHaveLength(3);
  });
});
