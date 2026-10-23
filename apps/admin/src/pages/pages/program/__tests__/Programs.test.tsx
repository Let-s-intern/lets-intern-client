import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Programs from '../Programs';

const axiosGet = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: { get: (...args: unknown[]) => axiosGet(...args) },
}));

vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar: vi.fn() }),
}));

const program = (id: number, title: string) => ({
  programInfo: {
    id,
    programType: 'CHALLENGE',
    programStatusType: 'PROCEEDING',
    title,
    createdAt: '2026-01-01T00:00:00',
  },
  classificationList: [],
});

const listCalls = () =>
  axiosGet.mock.calls.filter(([url]) => url === '/program/admin');

let search = '';
const LocationProbe = () => {
  search = useLocation().search;
  return null;
};

const renderPrograms = (initialEntry = '/programs') =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <MemoryRouter initialEntries={[initialEntry]}>
        <Programs />
        <LocationProbe />
      </MemoryRouter>
    </QueryClientProvider>,
  );

const keywordInput = () => screen.getByLabelText('제목·ID 검색');

beforeEach(() => {
  axiosGet.mockImplementation(() =>
    Promise.resolve({
      data: {
        data: {
          programList: [program(12, '취업 챌린지')],
          pageInfo: {
            pageNum: 1,
            pageSize: 1000,
            totalElements: 1,
            totalPages: 1,
          },
        },
      },
    }),
  );
});

afterEach(() => vi.clearAllMocks());

describe('프로그램 목록 제목·ID 검색', () => {
  it('입력이 멈춘 뒤 300ms 에 keyword 로 한 번만 다시 묻는다', async () => {
    renderPrograms();
    await waitFor(() => expect(listCalls()).toHaveLength(1));
    expect(listCalls()[0][1].params.keyword).toBeUndefined();

    fireEvent.change(keywordInput(), { target: { value: '취' } });
    fireEvent.change(keywordInput(), { target: { value: '취업' } });
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(listCalls()).toHaveLength(1);

    await waitFor(() => expect(listCalls()).toHaveLength(2));
    expect(listCalls()[1][1].params).toMatchObject({
      keyword: '취업',
      page: 1,
      size: 1000,
    });
  });

  it('검색어를 URL ?keyword= 에 남기고 첫 페이지로 돌린다', async () => {
    renderPrograms('/programs?page=3&pageSize=50');
    await waitFor(() => expect(listCalls()).toHaveLength(1));

    fireEvent.change(keywordInput(), { target: { value: ' 취업 ' } });
    await waitFor(() => {
      const params = new URLSearchParams(search);
      expect(params.get('keyword')).toBe('취업');
      expect(params.get('page')).toBe('0');
      expect(params.get('pageSize')).toBe('50');
    });
  });

  it('URL 의 keyword 로 시작하고, 지우면 URL 에서도 뺀다', async () => {
    renderPrograms('/programs?keyword=12');
    expect(keywordInput()).toHaveValue('12');
    await waitFor(() => expect(listCalls()).toHaveLength(1));
    expect(listCalls()[0][1].params.keyword).toBe('12');

    fireEvent.change(keywordInput(), { target: { value: '' } });
    await waitFor(() =>
      expect(new URLSearchParams(search).has('keyword')).toBe(false),
    );
    await waitFor(() =>
      expect(listCalls().at(-1)?.[1].params.keyword).toBeUndefined(),
    );
  });
});
