import type { SsoRedirectWhitelist } from '@/api/ssoSchema';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import SsoRedirectWhitelists from '../SsoRedirectWhitelists';

/**
 * 이 목록이 답해야 하는 질문 (PRD 6.3).
 *
 *   1. 어떤 서비스가 어떤 주소로 튈 수 있는가
 *   2. 그중 지금 열려 있는 것은 무엇인가
 *
 * 2번이 뒤집혀 보이면 살아 있는 서비스를 끄게 된다. 그래서 활성 상태 표시와
 * 토글이 보내는 값을 함께 본다.
 */

const listQuery = vi.fn();
const toggleMutate = vi.fn();
const deleteMutate = vi.fn();

vi.mock('@/api/sso', () => ({
  useSsoRedirectWhitelistListQuery: () => listQuery(),
  useToggleSsoRedirectWhitelistActive: () => ({
    mutate: toggleMutate,
    isPending: false,
  }),
  useDeleteSsoRedirectWhitelist: () => ({
    mutate: deleteMutate,
    isPending: false,
  }),
}));

const rows: SsoRedirectWhitelist[] = [
  {
    id: 1,
    serviceName: 'FreeSeminarVodHub',
    allowedRedirectUri: 'https://vod.letscareer.co.kr/auth/callback',
    isActive: true,
    createDate: '2026-08-01T10:00:00',
  },
  {
    id: 2,
    serviceName: '인적성 모의고사',
    allowedRedirectUri: 'https://exam.letscareer.co.kr/auth/callback',
    isActive: false,
    createDate: null,
  },
];

const succeed = (data: SsoRedirectWhitelist[] = rows) =>
  listQuery.mockReturnValue({ data, isLoading: false, isError: false });

const renderList = () =>
  render(
    <MemoryRouter>
      <SsoRedirectWhitelists />
    </MemoryRouter>,
  );

beforeEach(() => {
  listQuery.mockReset();
  toggleMutate.mockReset();
  deleteMutate.mockReset();
});

describe('SsoRedirectWhitelists', () => {
  it('서비스명과 허용 URL 을 행마다 보여준다', () => {
    succeed();
    renderList();

    expect(screen.getByText('FreeSeminarVodHub')).toBeInTheDocument();
    expect(
      screen.getByText('https://vod.letscareer.co.kr/auth/callback'),
    ).toBeInTheDocument();
    expect(screen.getByText('인적성 모의고사')).toBeInTheDocument();
  });

  it('활성 여부를 행마다 구분해 표시한다', () => {
    succeed();
    renderList();

    expect(
      screen.getByRole('switch', { name: 'FreeSeminarVodHub 활성화' }),
    ).toBeChecked();
    expect(
      screen.getByRole('switch', { name: '인적성 모의고사 활성화' }),
    ).not.toBeChecked();
  });

  it('생성일이 없으면 빈 칸 대신 - 로 적는다', () => {
    // 빈 칸은 값이 없는 것인지 화면이 못 그린 것인지 구분되지 않는다.
    succeed();
    renderList();

    const row = screen.getByText('인적성 모의고사').closest('tr')!;

    expect(within(row).getByText('-')).toBeInTheDocument();
  });

  it('활성 항목을 누르면 비활성으로 바꿔 달라고 요청한다', async () => {
    succeed();
    renderList();

    await userEvent.click(
      screen.getByRole('switch', { name: 'FreeSeminarVodHub 활성화' }),
    );

    expect(toggleMutate).toHaveBeenCalledWith({ id: 1, isActive: false });
  });

  it('비활성 항목을 누르면 활성으로 바꿔 달라고 요청한다', async () => {
    succeed();
    renderList();

    await userEvent.click(
      screen.getByRole('switch', { name: '인적성 모의고사 활성화' }),
    );

    expect(toggleMutate).toHaveBeenCalledWith({ id: 2, isActive: true });
  });

  it('조회에 실패하면 빈 목록이 아니라 실패했다고 적는다', () => {
    // 실패가 "등록된 게 없다"로 읽히면 운영은 이미 있는 URL 을 다시 등록한다.
    listQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    renderList();

    expect(
      screen.getByText(/화이트리스트를 불러오지 못했습니다/),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('등록된 화이트리스트가 없습니다.'),
    ).not.toBeInTheDocument();
  });

  it('등록된 항목이 없으면 없다고 적는다', () => {
    succeed([]);
    renderList();

    expect(
      screen.getByText('등록된 화이트리스트가 없습니다.'),
    ).toBeInTheDocument();
  });
});

/**
 * 삭제는 되돌릴 수 없다. 잘못 지우면 그 서비스의 SSO 로그인이 즉시 끊기고,
 * 복구하려면 URL 을 정확히 기억해 다시 등록해야 한다.
 *
 * 그래서 확인 단계를 거치기 **전에는 요청이 나가지 않는다**는 것을 못 박는다.
 */
describe('SsoRedirectWhitelists 삭제', () => {
  it('삭제 버튼만 눌러서는 요청하지 않는다', async () => {
    succeed();
    renderList();

    await userEvent.click(
      screen.getByRole('button', { name: 'FreeSeminarVodHub 삭제' }),
    );

    expect(deleteMutate).not.toHaveBeenCalled();
  });

  it('확인 모달에 어떤 서비스의 어떤 URL 인지 적는다', async () => {
    // 실수는 "지울 생각이 없던 행을 지운" 쪽으로 난다. 대상이 적혀 있어야 되돌릴 수 있다.
    succeed();
    renderList();

    await userEvent.click(
      screen.getByRole('button', { name: 'FreeSeminarVodHub 삭제' }),
    );

    const dialog = screen.getByRole('dialog');

    expect(dialog).toHaveTextContent('FreeSeminarVodHub');
    expect(dialog).toHaveTextContent(
      'https://vod.letscareer.co.kr/auth/callback',
    );
  });

  it('확인을 눌러야 삭제를 요청한다', async () => {
    succeed();
    renderList();

    await userEvent.click(
      screen.getByRole('button', { name: '인적성 모의고사 삭제' }),
    );
    await userEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: '삭제' }),
    );

    expect(deleteMutate).toHaveBeenCalledWith(2);
  });

  it('취소하면 요청하지 않고 모달을 닫는다', async () => {
    succeed();
    renderList();

    await userEvent.click(
      screen.getByRole('button', { name: 'FreeSeminarVodHub 삭제' }),
    );
    await userEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: '취소' }),
    );

    expect(deleteMutate).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
