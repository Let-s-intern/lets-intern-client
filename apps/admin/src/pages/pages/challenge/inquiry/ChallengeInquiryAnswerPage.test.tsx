import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiError } from '@letscareer/api';
import { AxiosError } from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

const get = vi.fn();
const patch = vi.fn();

vi.mock('@/utils/axiosV2', () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
    patch: (...args: unknown[]) => patch(...args),
  },
}));

// Lexical 은 jsdom 에서 무겁다. 입력창이 받은 초기값만 확인한다.
vi.mock('@/common/lexical/EditorApp', () => ({
  default: ({
    initialEditorStateJsonString,
    onChange,
  }: {
    initialEditorStateJsonString?: string;
    onChange: (value: string) => void;
  }) => (
    <textarea
      aria-label="답변 입력창"
      defaultValue={initialEditorStateJsonString}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

import ChallengeInquiryAnswerPage from './ChallengeInquiryAnswerPage';

const serverQuestion = {
  id: 7,
  answerStatus: 'COMPLETED',
  title: '서버 제목',
  content: '서버 내용',
  answer: '서버에 달린 답변',
  isVisible: true,
  challengeId: 3,
  challengeTitle: '챌린지',
  userId: 1,
  userName: '홍길동',
  email: 'a@b.c',
  createDate: '2026-11-27T10:00:00',
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 0 } },
});

const renderPage = (state?: unknown) =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        initialEntries={[{ pathname: '/challenge/inquiry/3/7/answer', state }]}
      >
        <Routes>
          <Route
            path="/challenge/inquiry/:challengeId/:questionId/answer"
            element={<ChallengeInquiryAnswerPage />}
          />
          <Route
            path="/challenge/inquiry"
            element={<div>문의 목록 화면</div>}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

afterEach(() => {
  queryClient.clear();
  get.mockReset();
  patch.mockReset();
});

describe('ChallengeInquiryAnswerPage', () => {
  it('라우터 상태 없이 열면 불러오는 중을 보이다가 서버 값을 보인다', async () => {
    get.mockResolvedValue({ data: { data: serverQuestion } });

    renderPage();

    expect(screen.getByText('문의를 불러오는 중입니다.')).toBeInTheDocument();
    expect(await screen.findByText('서버 제목')).toBeInTheDocument();
    expect(screen.getByText('서버 내용')).toBeInTheDocument();
    expect(get).toHaveBeenCalledWith('/admin/challenge/3/questions/7');
  });

  it('라우터 상태가 있으면 응답 전에도 문의를 보이고 입력창은 서버 값으로 확정된 뒤에 그린다', async () => {
    get.mockResolvedValue({ data: { data: serverQuestion } });
    const fromList = {
      ...serverQuestion,
      title: '목록 제목',
      answer: '목록의 오래된 답변',
      imageUrls: [],
      isAnswerRead: false,
    };

    renderPage({ question: fromList });

    expect(screen.getByText('목록 제목')).toBeInTheDocument();
    expect(screen.queryByLabelText('답변 입력창')).not.toBeInTheDocument();

    const editor = await screen.findByLabelText('답변 입력창');
    expect(editor).toHaveValue('서버에 달린 답변');
    expect(screen.getByText('서버 제목')).toBeInTheDocument();
  });

  it('이미 달린 답변이 입력창에 채워진다', async () => {
    get.mockResolvedValue({ data: { data: serverQuestion } });

    renderPage();

    expect(await screen.findByLabelText('답변 입력창')).toHaveValue(
      '서버에 달린 답변',
    );
  });

  it('저장하면 답변을 보내고 목록으로 이동한다', async () => {
    get.mockResolvedValue({ data: { data: serverQuestion } });
    patch.mockResolvedValue({ data: {} });
    const user = userEvent.setup();

    renderPage();

    const editor = await screen.findByLabelText('답변 입력창');
    await user.clear(editor);
    await user.type(editor, '새 답변');
    await user.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() =>
      expect(patch).toHaveBeenCalledWith(
        '/admin/challenge/3/questions/7/answer',
        { answer: '새 답변' },
      ),
    );
    expect(await screen.findByText('문의 목록 화면')).toBeInTheDocument();
  });

  it('입력창을 건드리지 않고 저장하면 서버에 달린 답변을 그대로 보낸다', async () => {
    get.mockResolvedValue({ data: { data: serverQuestion } });
    patch.mockResolvedValue({ data: {} });
    const user = userEvent.setup();

    renderPage();

    await screen.findByLabelText('답변 입력창');
    await user.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() =>
      expect(patch).toHaveBeenCalledWith(
        '/admin/challenge/3/questions/7/answer',
        { answer: '서버에 달린 답변' },
      ),
    );
  });

  it('서버가 404 를 주면 문의를 찾을 수 없다는 문구와 목록 링크를 보인다', async () => {
    // 공용 axios 는 응답 오류를 ApiError 로 다시 포장한다
    get.mockRejectedValue(
      new ApiError({
        code: 'NOT_FOUND',
        message: '없음',
        status: 404,
        endpoint: '/admin/challenge/3/questions/7',
        method: 'GET',
      }),
    );

    renderPage();

    expect(
      await screen.findByText(
        '문의를 찾을 수 없습니다. 삭제됐거나 주소가 잘못됐습니다.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '목록으로' })).toHaveAttribute(
      'href',
      '/challenge/inquiry',
    );
    expect(screen.queryByLabelText('답변 입력창')).not.toBeInTheDocument();
  });

  it('포장되지 않은 axios 404 도 같은 문구로 보인다', async () => {
    get.mockRejectedValue(
      new AxiosError('Not Found', 'ERR_BAD_REQUEST', undefined, undefined, {
        status: 404,
      } as never),
    );

    renderPage();

    expect(
      await screen.findByText(
        '문의를 찾을 수 없습니다. 삭제됐거나 주소가 잘못됐습니다.',
      ),
    ).toBeInTheDocument();
  });

  it('404 가 아닌 실패는 잠시 후 다시 시도하라는 문구와 목록 링크를 보인다', async () => {
    get.mockRejectedValue(
      new ApiError({
        code: 'API_ERROR',
        message: '서버 오류',
        status: 500,
        endpoint: '/admin/challenge/3/questions/7',
        method: 'GET',
      }),
    );

    renderPage();

    expect(
      await screen.findByText(
        '문의를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        '문의를 찾을 수 없습니다. 삭제됐거나 주소가 잘못됐습니다.',
      ),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: '목록으로' })).toHaveAttribute(
      'href',
      '/challenge/inquiry',
    );
  });

  it('네트워크 오류처럼 응답이 없는 실패도 잠시 후 다시 시도하라는 문구를 보인다', async () => {
    get.mockRejectedValue(new Error('Network Error'));

    renderPage();

    expect(
      await screen.findByText(
        '문의를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
      ),
    ).toBeInTheDocument();
  });
});
