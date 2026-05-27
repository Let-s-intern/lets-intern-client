/**
 * 멘티 관리 페이지 — 멘티 목록 실연동(GET /feedback/mentor).
 *
 * 공유 MSW 핸들러(@letscareer/mocks)의 feedback/mentor 응답을 그대로 사용해
 * 멘티 목록이 그 응답에서 distinct 파생되는지(이름+챌린지 쌍) 검증한다.
 * 채팅은 BE 미구현 — 선택 시 "준비 중" 플레이스홀더만 노출한다.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '@letscareer/mocks/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

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
    // 시드의 멘티 이름들이 목록에 나타난다.
    expect(await screen.findByText('박서연')).toBeInTheDocument();
    expect(screen.getByText('문수아')).toBeInTheDocument();
  });

  it('같은 멘티라도 챌린지가 다르면 챌린지별로 별도 행으로 노출된다', async () => {
    renderPage();
    // 이지수는 시드에서 "자소서 챌린지 7기"·"기필코 경험정리 챌린지 21기" 두 챌린지에 존재.
    await screen.findByText('박서연');
    const list = getMenteeList();
    expect(within(list).getAllByText('이지수')).toHaveLength(2);
  });

  it('검색(챌린지명)으로 해당 챌린지 멘티만 남는다', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('문수아');

    await user.type(screen.getByLabelText('멘티 검색'), '커리어 설계');

    const list = getMenteeList();
    // 커리어 설계 챌린지 5기 멘티(문수아)는 남고, 다른 챌린지 멘티(박서연)는 사라진다.
    expect(within(list).getByText('문수아')).toBeInTheDocument();
    expect(within(list).queryByText('박서연')).not.toBeInTheDocument();
  });

  it('멘티 선택 시 채팅 플레이스홀더(준비 중)를 노출한다', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('문수아');

    await user.click(screen.getByLabelText('문수아 멘티 선택'));

    expect(screen.getByText('채팅 기능은 준비 중입니다')).toBeInTheDocument();
    // 채팅 입력창은 렌더되지 않는다(채팅 미구현).
    expect(screen.queryByLabelText('메시지 입력')).not.toBeInTheDocument();
  });
});
