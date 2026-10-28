import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminSnackbarProvider } from '@/hooks/useAdminSnackbar';
import {
  seedOneTimeFormApplications,
  seedOneTimeFormQuestions,
} from '@/mocks/seed/oneTimeForm';

import OneTimeFormApplicationDetailPage from './OneTimeFormApplicationDetailPage';

const applicationQuery = vi.fn();
const fileUrlQuery = vi.fn();

vi.mock('@/api/one-time-form/oneTimeFormQueries', async (importOriginal) => ({
  // 환불 버튼이 쿼리 키를 쓴다
  ...(await importOriginal<object>()),
  useOneTimeFormApplicationQuery: (applicationId: number) =>
    applicationQuery(applicationId),
  useOneTimeFormFileUrlQuery: (applicationId: number, questionId: number) =>
    fileUrlQuery(applicationId, questionId),
}));

const form = {
  formId: 7,
  title: '현직자와 함께하는 포트폴리오 집중 클래스',
  slug: 'portfolio-1115',
  isPaid: true,
};

// A9 처럼 삭제된 질문까지 준다
const questions = seedOneTimeFormQuestions
  .filter((q) => q.formId === 7)
  .map(({ questionId, type, title, sortOrder, isDeleted }) => ({
    questionId,
    type,
    title,
    sortOrder,
    isDeleted,
  }));

const loaded = (applicationId: number) => {
  const { formId: _formId, ...application } = seedOneTimeFormApplications.find(
    (a) => a.applicationId === applicationId,
  );
  return {
    data: { form, questions, optionGroups: [], application },
    isLoading: false,
    isError: false,
  };
};

const renderPage = (applicationId: number) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <AdminSnackbarProvider>
        <MemoryRouter
          initialEntries={[`/one-time-form/7/applications/${applicationId}`]}
        >
          <Routes>
            <Route
              path="/one-time-form/:formId/applications/:applicationId"
              element={<OneTimeFormApplicationDetailPage />}
            />
          </Routes>
        </MemoryRouter>
      </AdminSnackbarProvider>
    </QueryClientProvider>,
  );

const section = (title: string) =>
  screen.getByRole('heading', { name: title }).closest('section');

/** InfoList 의 이름 칸 옆 값 */
const valueOf = (container: HTMLElement, label: string) =>
  within(container).getByText(label).nextElementSibling;

beforeEach(() => {
  applicationQuery.mockReset();
  fileUrlQuery.mockReset();
  fileUrlQuery.mockReturnValue({ data: undefined, isError: false });
});

describe('OneTimeFormApplicationDetailPage', () => {
  it('신청 1042 의 신청 정보, 옵션·결제, 계정, 유입을 보여준다', () => {
    applicationQuery.mockReturnValue(loaded(1042));
    renderPage(1042);

    expect(applicationQuery).toHaveBeenCalledWith(1042);
    expect(screen.getByText('김렛커 신청 상세')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '신청자 목록으로' }),
    ).toHaveAttribute('href', '/one-time-form/7/applications');

    const info = section('신청 정보');
    expect(valueOf(info, '신청일시')).toHaveTextContent('2026.11.02 13:24');
    expect(valueOf(info, '상태')).toHaveTextContent('신청 완료');
    expect(valueOf(info, '전화번호')).toHaveTextContent('010-1234-5678');
    expect(valueOf(info, '취소일시')).toHaveTextContent('-');

    const payment = section('옵션·결제');
    expect(valueOf(payment, '참여 방식을 골라 주세요')).toHaveTextContent(
      '온라인 라이브+0원',
    );
    expect(valueOf(payment, '함께 신청하면 좋아요')).toHaveTextContent(
      '포트폴리오 1:1 첨삭+20,000원',
    );
    expect(valueOf(payment, '결제 금액')).toHaveTextContent('49,000원');
    expect(valueOf(payment, '환불 금액')).toHaveTextContent('0원');
    expect(valueOf(payment, '결제 상태')).toHaveTextContent('결제 완료');

    const account = section('계정 정보');
    expect(valueOf(account, '유저 ID')).toHaveTextContent('58231');
    expect(valueOf(account, '학년')).toHaveTextContent('4학년');
    expect(valueOf(account, '마케팅 동의')).toHaveTextContent('동의');

    const inflow = section('유입');
    expect(valueOf(inflow, 'utm_source')).toHaveTextContent('instagram');
    expect(valueOf(inflow, 'utm_term')).toHaveTextContent('-');
    expect(valueOf(inflow, 'referrer')).toHaveTextContent(
      'https://event-xxx.vercel.app/',
    );
  });

  it('답은 질문 순서대로, 삭제된 질문은 (삭제됨) 을 붙이고 미응답은 - 로 보여준다', () => {
    applicationQuery.mockReturnValue(loaded(1042));
    renderPage(1042);

    const items = within(section('답변')).getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('이전 질문 (삭제됨)삭제 전 답');
    expect(items[1]).toHaveTextContent('희망 직무프론트엔드');
    expect(items[2]).toHaveTextContent('현재 상태-');
    expect(items[3]).toHaveTextContent('참여 가능한 요일월, 수');
    expect(
      within(section('답변')).getByRole('button', {
        name: '김렛커_이력서_최종.pdf 열기',
      }),
    ).toBeInTheDocument();
  });

  it('취소한 신청 1043 은 취소일시와 환불, 빈 프로필, 첨부를 보여준다', () => {
    applicationQuery.mockReturnValue(loaded(1043));
    renderPage(1043);

    const info = section('신청 정보');
    expect(valueOf(info, '상태')).toHaveTextContent('신청 취소');
    expect(valueOf(info, '취소일시')).toHaveTextContent('2026.11.03 14:02');

    const payment = section('옵션·결제');
    expect(valueOf(payment, '환불 금액')).toHaveTextContent('39,000원');
    expect(valueOf(payment, '결제 상태')).toHaveTextContent(
      '취소(환불 39,000원)',
    );

    expect(valueOf(section('계정 정보'), '학교')).toHaveTextContent('-');

    // 답하지 않은 삭제 질문 100 은 보이지 않는다
    const answers = section('답변');
    expect(within(answers).queryByText(/이전 질문/)).not.toBeInTheDocument();
    expect(fileUrlQuery).toHaveBeenCalledWith(1043, 109);
    expect(within(answers).getByText('프로필.png')).toBeInTheDocument();
    expect(
      within(answers).getByRole('button', { name: '박서현_이력서.pdf 열기' }),
    ).toBeInTheDocument();
  });

  it('무료 신청은 결제 금액이 무료, 탈퇴한 계정은 그렇게 표시한다', () => {
    const free = loaded(1042);
    free.data.application = {
      ...free.data.application,
      selectedOptions: [],
      payment: null,
      user: null,
    };
    applicationQuery.mockReturnValue(free);
    renderPage(1042);

    const payment = section('옵션·결제');
    expect(valueOf(payment, '고른 옵션')).toHaveTextContent('없음');
    expect(valueOf(payment, '결제 금액')).toHaveTextContent('무료');
    expect(valueOf(payment, '환불 금액')).toHaveTextContent('-');
    expect(
      within(section('계정 정보')).getByText('탈퇴한 계정'),
    ).toBeInTheDocument();
  });

  it('조회에 실패하면 안내 문구를 보여준다', () => {
    applicationQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    renderPage(9999);

    expect(
      screen.getByText('신청 정보를 불러오지 못했습니다.'),
    ).toBeInTheDocument();
  });
});
