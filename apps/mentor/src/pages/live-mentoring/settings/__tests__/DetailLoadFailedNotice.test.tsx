import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import axios from '@/utils/axios';

import LiveMentoringSettingsPage from '../LiveMentoringSettingsPage';

vi.mock('@/utils/axios', () => ({
  default: { get: vi.fn(), put: vi.fn() },
}));

const axiosGet = vi.mocked(axios.get);

const renderPage = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <LiveMentoringSettingsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

const openDetailStep = () =>
  fireEvent.click(screen.getByRole('tab', { name: /핵심 소개/ }));

const notFound = () =>
  Object.assign(new Error('not found'), {
    code: 'LIVE_MENTORING_NOT_FOUND',
    status: 404,
  });

beforeEach(() => {
  axiosGet.mockReset();
});

/*
  「개발 중인 페이지입니다 / API 연동 전」이 있던 자리다(LC-3265). 그 문구는 사실이
  아니었다 — 템플릿 API 는 존재하고, 흔한 실패는 멘토에게 아직 상품이 없어서 나는
  404 다. 상품은 오픈 설정에서 만들어지므로 안내가 그 스텝으로 보내야 한다.
*/
describe('상세 스텝을 불러오지 못했을 때', () => {
  it('개발 중이라는 안내를 더 이상 보여주지 않는다', async () => {
    axiosGet.mockRejectedValue(notFound());

    renderPage();
    openDetailStep();

    await waitFor(() =>
      expect(
        screen.getByText('먼저 오픈 설정을 저장해주세요.'),
      ).toBeInTheDocument(),
    );
    expect(
      screen.queryByText('개발 중인 페이지입니다.'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/담당자/)).not.toBeInTheDocument();
    expect(screen.queryByText(/API 연동 전/)).not.toBeInTheDocument();
  });

  it('상품이 없어서 실패하면 오픈 설정 스텝으로 보내준다', async () => {
    axiosGet.mockRejectedValue(notFound());

    renderPage();
    openDetailStep();

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: '오픈 설정으로 가기' }),
      ).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole('button', { name: '오픈 설정으로 가기' }));

    expect(screen.getByRole('tab', { name: /오픈 설정/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  /*
    상품이 없는 것 말고 다른 이유로 실패했는데 "오픈 설정을 저장하라"고 하면 거짓말이
    된다. 5xx 는 훅이 재시도하므로(백오프 때문에 테스트가 느려진다) 재시도하지 않는
    4xx 로 이 분기를 확인한다 — 분기 기준은 상태가 아니라 코드다.
  */
  it('상품 없음이 아닌 실패에는 다시 시도하라고만 알린다', async () => {
    axiosGet.mockRejectedValue(
      Object.assign(new Error('boom'), { code: 'API_ERROR', status: 403 }),
    );

    renderPage();
    openDetailStep();

    await waitFor(() =>
      expect(
        screen.getByText('상세 페이지를 불러오지 못했어요.'),
      ).toBeInTheDocument(),
    );
    expect(
      screen.queryByRole('button', { name: '오픈 설정으로 가기' }),
    ).not.toBeInTheDocument();
  });

  // 실패는 상세 스텝 안에 갇혀야 한다. 예전에는 페이지를 통째로 조기 반환해서
  // 템플릿 조회가 404 면 오픈 설정까지 함께 사라졌다.
  it('오픈 설정 스텝과 스텝 줄은 그대로 남는다', async () => {
    axiosGet.mockRejectedValue(notFound());

    renderPage();
    openDetailStep();

    await waitFor(() =>
      expect(
        screen.getByText('먼저 오픈 설정을 저장해주세요.'),
      ).toBeInTheDocument(),
    );
    expect(screen.getAllByRole('tab')).toHaveLength(7);
    expect(
      screen.getByRole('heading', { name: '1:1 LIVE 멘토링 설정' }),
    ).toBeInTheDocument();
  });
});
