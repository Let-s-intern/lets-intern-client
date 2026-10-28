import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http } from 'msw';
import { setupServer } from 'msw/node';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { AdminSnackbarProvider } from '@/hooks/useAdminSnackbar';
import { adminRefundHandlers } from '@/mocks/handlers/adminRefund';
import {
  oneTimeFormHandlers,
  resetOneTimeFormMock,
} from '@/mocks/handlers/oneTimeForm';

import OneTimeFormApplicationDetailPage from './OneTimeFormApplicationDetailPage';

/**
 * 전액 환불 흐름(계약 A11)을 MSW 목 서버로 끝까지 돌린다.
 * 환불이 목 상태를 바꾸고, 무효화된 A9 조회가 그 상태를 다시 받아 화면이 바뀌는지 본다.
 */

const server = setupServer(...oneTimeFormHandlers, ...adminRefundHandlers);

let refundBodies: unknown[] = [];

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
beforeEach(() => {
  refundBodies = [];
  server.use(
    // 본문만 기록하고 다음 핸들러로 넘긴다
    http.post(
      '*/api/v1/admin/application/:applicationId/refund',
      async ({ request }) => {
        refundBodies.push(await request.clone().json());
        return undefined;
      },
    ),
  );
});
afterEach(() => {
  server.resetHandlers();
  resetOneTimeFormMock();
});
afterAll(() => server.close());

const renderPage = (formId: number, applicationId: number) =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <AdminSnackbarProvider>
        <MemoryRouter
          initialEntries={[
            `/one-time-form/${formId}/applications/${applicationId}`,
          ]}
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

const paymentStatus = async () => {
  // 다이얼로그가 열려 있으면 MUI 가 뒤 화면을 aria-hidden 으로 가린다
  const heading = await screen.findByRole('heading', {
    name: '옵션·결제',
    hidden: true,
  });
  const section = heading.closest('section');
  return within(section).getByText('결제 상태')
    .nextElementSibling as HTMLElement;
};

const refundButton = async () =>
  within(await paymentStatus()).getByRole('button', {
    name: '전액 환불',
    hidden: true,
  });

const fillAndSubmit = async (user: ReturnType<typeof userEvent.setup>) => {
  const dialog = screen.getByRole('dialog');
  const submit = within(dialog).getByRole('button', { name: '환불하기' });
  expect(submit).toBeDisabled();

  await user.type(within(dialog).getByLabelText(/담당자 이름/), '임호정');
  expect(submit).toBeDisabled();
  await user.type(within(dialog).getByLabelText(/환불 사유/), '신청자 요청');
  expect(submit).toBeEnabled();

  await user.click(submit);
  return dialog;
};

describe('신청 상세 전액 환불', () => {
  it('1042 를 환불하면 상세가 취소로 바뀌고 버튼이 비활성된다', async () => {
    const user = userEvent.setup();
    renderPage(7, 1042);

    expect(await paymentStatus()).toHaveTextContent('결제 완료');
    await user.click(await refundButton());

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent('김렛커');
    expect(dialog).toHaveTextContent('49,000원');
    expect(dialog).toHaveTextContent('알림을 보내지 않습니다');

    await fillAndSubmit(user);

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    await waitFor(async () =>
      expect(await paymentStatus()).toHaveTextContent('취소(환불 49,000원)'),
    );
    expect(await refundButton()).toBeDisabled();
    expect(await screen.findByText('49,000원을 환불했습니다.')).toBeVisible();

    expect(refundBodies).toEqual([
      { managerName: '임호정', reason: '신청자 요청', sendNotification: false },
    ]);
  });

  it('서버가 거절하면 다이얼로그를 닫지 않고 서버 메시지를 보여준다', async () => {
    server.use(
      http.post(
        '*/api/v1/admin/application/:applicationId/refund',
        () =>
          new Response(
            JSON.stringify({
              status: 409,
              code: 'APPLICATION_ALREADY_CANCELED',
              message: '이미 취소된 신청입니다.',
            }),
            { status: 409, headers: { 'Content-Type': 'application/json' } },
          ),
      ),
    );
    const user = userEvent.setup();
    renderPage(7, 1042);

    await user.click(await refundButton());
    const dialog = await fillAndSubmit(user);

    expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      '이미 취소된 신청입니다.',
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(await paymentStatus()).toHaveTextContent('결제 완료');
  });

  it('이미 취소한 1043 은 버튼이 비활성이고 사유를 보여준다', async () => {
    renderPage(7, 1043);

    expect(await refundButton()).toBeDisabled();
    expect(await paymentStatus()).toHaveTextContent(
      '이미 취소·환불된 신청입니다.',
    );
  });

  it('무료 신청 1044 에는 환불 버튼이 없다', async () => {
    renderPage(8, 1044);

    const status = await paymentStatus();
    expect(status).toHaveTextContent('무료');
    expect(
      within(status).queryByRole('button', { name: '전액 환불' }),
    ).not.toBeInTheDocument();
  });

  it('0원 결제 1050 도 0원으로 보여주고 환불된다', async () => {
    const user = userEvent.setup();
    renderPage(9, 1050);

    await user.click(await refundButton());
    expect(screen.getByRole('dialog')).toHaveTextContent('0원');

    await fillAndSubmit(user);

    await waitFor(async () =>
      expect(await paymentStatus()).toHaveTextContent('취소(환불 0원)'),
    );
    expect(await refundButton()).toBeDisabled();
    expect(refundBodies).toEqual([
      { managerName: '임호정', reason: '신청자 요청', sendNotification: false },
    ]);
  });
});
