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
import MentorContentModal from '../MentorContentModal';

const get = axios.get as unknown as ReturnType<typeof vi.fn>;

function renderWithClient(node: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{node}</QueryClientProvider>,
  );
}

describe('MentorContentModal', () => {
  beforeEach(() => {
    get.mockReset();
  });

  it('멘토 발송 내용을 평문으로 렌더한다', async () => {
    get.mockResolvedValue({
      data: {
        data: {
          liveMentorVo: {
            id: 1,
            title: '실전 직무',
            mentorName: '김멘토',
            zoomLink: 'https://zoom.example/abc',
            startDate: '2026-05-10T10:00:00',
            endDate: '2026-05-10T12:00:00',
          },
          questionList: ['Q1?', 'Q2?'],
          motivateList: ['M1'],
          reviewList: [{ questionType: 'TEXT', answer: 'good' }],
        },
      },
    });

    const onClose = vi.fn();
    renderWithClient(
      <MentorContentModal liveId={9} password="pw" onClose={onClose} />,
    );

    expect(await screen.findByText(/제목: 실전 직무/)).toBeInTheDocument();
    expect(screen.getByText(/멘토: 김멘토/)).toBeInTheDocument();
    expect(screen.getByText(/Q1\?/)).toBeInTheDocument();
    expect(screen.getByText(/M1/)).toBeInTheDocument();
    expect(get).toHaveBeenCalledWith('/live/9/mentor/pw');
  });

  it('닫기 버튼 클릭 시 onClose 가 호출된다', async () => {
    get.mockResolvedValue({
      data: {
        data: {
          liveMentorVo: { id: 1, title: 't' },
          questionList: [],
          motivateList: [],
          reviewList: [],
        },
      },
    });

    const onClose = vi.fn();
    renderWithClient(
      <MentorContentModal liveId={9} password="pw" onClose={onClose} />,
    );

    await screen.findByText(/제목: t/);
    const closeButtons = screen.getAllByRole('button', { name: '닫기' });
    fireEvent.click(closeButtons[closeButtons.length - 1]);
    expect(onClose).toHaveBeenCalled();
  });
});
