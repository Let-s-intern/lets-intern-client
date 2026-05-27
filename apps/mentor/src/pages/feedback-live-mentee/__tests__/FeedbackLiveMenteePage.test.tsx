/**
 * 멘티 관리 페이지 — 멘티 목록 실연동(GET /feedback/mentor) + 임베드 채팅.
 *
 * 공유 MSW 핸들러(@letscareer/mocks)의 feedback/mentor 응답을 그대로 사용해
 * 멘티(세션) 목록이 그 응답에서 파생되는지 검증한다. 채팅 훅(@letscareer/chat)은
 * PocketBase 네트워크에 의존하므로 목으로 대체한다.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '@letscareer/mocks/node';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

// 채팅 훅은 PocketBase 클라이언트에 의존하므로 목으로 대체(네트워크 차단).
vi.mock('@letscareer/chat/hooks/useChatMessages', () => ({
  useChatMessages: () => ({ messages: [] }),
}));
vi.mock('@letscareer/chat/hooks/useChatRoom', () => ({
  useChatRoom: () => ({
    sendMessage: vi.fn(),
    markRead: vi.fn(),
    endChat: vi.fn(),
    counterpartEnded: false,
  }),
}));

import FeedbackLiveMenteePage from '../FeedbackLiveMenteePage';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <FeedbackLiveMenteePage />
    </QueryClientProvider>,
  );
}

/** 좌측 멘티 목록 ul (이름·챌린지가 우측 헤더에도 나타날 수 있어 스코프 분리용). */
function getMenteeList(): HTMLElement {
  return screen
    .getByRole('heading', { name: '멘티 목록' })
    .closest('div')!
    .parentElement!.querySelector('ul')!;
}

describe('FeedbackLiveMenteePage', () => {
  it('미선택 시 빈 상태 안내를 노출한다', async () => {
    renderPage();
    expect(await screen.findByText('멘티를 선택하세요')).toBeInTheDocument();
  });

  it('MSW /feedback/mentor 응답에서 멘티 목록을 파생해 렌더한다', async () => {
    renderPage();
    expect(await screen.findByText('박서연')).toBeInTheDocument();
    expect(screen.getByText('문수아')).toBeInTheDocument();
  });

  it('검색(챌린지명)으로 해당 챌린지 멘티만 남는다', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('문수아');

    await user.type(screen.getByLabelText('멘티 검색'), '커리어 설계');

    const list = getMenteeList();
    expect(within(list).getByText('문수아')).toBeInTheDocument();
    expect(within(list).queryByText('박서연')).not.toBeInTheDocument();
  });

  it('멘티 선택 시 채팅(입력창)이 열린다', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('문수아');

    await user.click(screen.getByLabelText('문수아 멘티 선택'));

    // 채팅 입력창(컴포저)이 렌더된다.
    expect(await screen.findByLabelText('메시지 입력')).toBeInTheDocument();
    // 옛 "준비 중" 플레이스홀더는 더 이상 없다.
    expect(
      screen.queryByText('채팅 기능은 준비 중입니다'),
    ).not.toBeInTheDocument();
  });
});
