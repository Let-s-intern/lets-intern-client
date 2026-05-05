/// <reference types="vitest/globals" />
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/utils/axios', () => {
  const get = vi.fn();
  return { default: { get, post: vi.fn(), patch: vi.fn(), delete: vi.fn() } };
});
vi.mock('@/utils/auth', () => ({
  getAuthHeader: () => ({}),
  logoutAndRefreshPage: () => {},
}));

import axios from '@/utils/axios';
import MentorDispatchSection from '../MentorDispatchSection';

const get = axios.get as unknown as ReturnType<typeof vi.fn>;

function renderWithClient(node: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{node}</QueryClientProvider>,
  );
}

describe('MentorDispatchSection', () => {
  beforeEach(() => {
    get.mockReset();
  });

  it('초기에는 비밀번호를 호출하지 않고 미리보기 버튼이 비활성화된다', () => {
    renderWithClient(<MentorDispatchSection liveId={9} />);

    expect(get).not.toHaveBeenCalled();
    const previewButton = screen.getByRole('button', {
      name: '멘토 전달 내용 미리보기',
    });
    expect(previewButton).toBeDisabled();
  });

  it('조회 버튼 클릭 시 비밀번호 API 를 호출하고 결과를 표시한다', async () => {
    get.mockResolvedValue({ data: { data: { mentorPassword: 'hunter2' } } });

    renderWithClient(<MentorDispatchSection liveId={9} />);

    fireEvent.click(
      screen.getByRole('button', { name: '멘토 발송 정보 조회' }),
    );

    expect(await screen.findByText('hunter2')).toBeInTheDocument();
    expect(get).toHaveBeenCalledWith('/live/9/mentor');

    // 비밀번호가 들어오면 미리보기 버튼이 활성화된다
    expect(
      screen.getByRole('button', { name: '멘토 전달 내용 미리보기' }),
    ).not.toBeDisabled();
  });

  it('에러 발생 시 안내 문구를 표시한다', async () => {
    get.mockRejectedValue(new Error('네트워크 오류'));

    renderWithClient(<MentorDispatchSection liveId={9} />);

    fireEvent.click(
      screen.getByRole('button', { name: '멘토 발송 정보 조회' }),
    );

    expect(
      await screen.findByText(/멘토 비밀번호를 불러오지 못했습니다/),
    ).toBeInTheDocument();
  });
});
