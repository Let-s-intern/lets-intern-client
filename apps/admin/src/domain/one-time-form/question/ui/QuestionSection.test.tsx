import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError, AxiosHeaders } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AdminOneTimeFormQuestion } from '@/api/one-time-form/oneTimeFormSchema';
import { AdminSnackbarProvider } from '@/hooks/useAdminSnackbar';

import QuestionSection from './QuestionSection';

const saveMutateAsync = vi.fn();

vi.mock('@/api/one-time-form/oneTimeFormQueries', () => ({
  useSaveOneTimeFormQuestionsMutation: () => ({
    mutateAsync: saveMutateAsync,
    isPending: false,
  }),
}));

const radio: AdminOneTimeFormQuestion = {
  questionId: 101,
  type: 'RADIO',
  title: '희망 직무',
  description: null,
  isRequired: true,
  choices: ['프론트엔드', '백엔드', '데이터'],
  sortOrder: 0,
};

const renderSection = (applicationCount: number) =>
  render(
    <AdminSnackbarProvider>
      <QuestionSection
        formId={7}
        applicationCount={applicationCount}
        questions={[radio]}
      />
    </AdminSnackbarProvider>,
  );

const saveButton = () => screen.getByRole('button', { name: '질문 저장' });

const axiosError = (code: string) =>
  new AxiosError('fail', '400', undefined, undefined, {
    status: 400,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: { status: 400, code },
  });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('QuestionSection', () => {
  it('신청이 있으면 안내를 띄우고, 저장된 질문의 형식은 잠근다', () => {
    renderSection(2);
    expect(screen.getByText(/신청 시점 값이 남습니다/)).toBeInTheDocument();
    expect(screen.getByText(/형식을 바꿀 수 없습니다/)).toBeInTheDocument();
    expect(saveButton()).toBeDisabled();
  });

  it('신청이 있는 폼에서 저장된 질문을 지우면 먼저 묻는다', async () => {
    renderSection(2);
    await userEvent.click(screen.getByRole('button', { name: '질문 1 삭제' }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent('(삭제됨)');
    await userEvent.click(within(dialog).getByRole('button', { name: '취소' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(screen.getByDisplayValue('희망 직무')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '질문 1 삭제' }));
    await userEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: '삭제' }),
    );
    expect(screen.queryByDisplayValue('희망 직무')).not.toBeInTheDocument();
  });

  it('신청이 없으면 묻지 않고 지운다', async () => {
    renderSection(0);
    await userEvent.click(screen.getByRole('button', { name: '질문 1 삭제' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText(/아직 질문이 없습니다/)).toBeInTheDocument();
  });

  it('새 질문을 추가해 저장하면 A6 본문을 보낸다', async () => {
    saveMutateAsync.mockResolvedValue({
      questions: [radio, { ...radio, questionId: 102, sortOrder: 1 }],
    });
    renderSection(0);

    await userEvent.click(screen.getByRole('button', { name: '질문 추가' }));
    await userEvent.click(screen.getByRole('menuitem', { name: '체크박스' }));
    await userEvent.type(
      screen.getAllByRole('textbox', { name: /질문 문구/ })[1],
      '가능한 요일',
    );
    const card = screen.getAllByRole('listitem')[4];
    await userEvent.type(within(card).getByLabelText('선택지 1'), '월');
    await userEvent.click(saveButton());

    expect(saveMutateAsync).toHaveBeenCalledWith({
      formId: 7,
      body: {
        questions: [
          {
            questionId: 101,
            type: 'RADIO',
            title: '희망 직무',
            description: null,
            isRequired: true,
            choices: ['프론트엔드', '백엔드', '데이터'],
          },
          {
            questionId: null,
            type: 'CHECKBOX',
            title: '가능한 요일',
            description: null,
            isRequired: false,
            choices: ['월'],
          },
        ],
      },
    });
    expect(await screen.findByText('질문을 저장했습니다.')).toBeInTheDocument();
  });

  it('입력이 잘못되면 저장하지 않고 칸 아래에 알린다', async () => {
    renderSection(0);
    await userEvent.click(screen.getByRole('button', { name: '질문 추가' }));
    await userEvent.click(screen.getByRole('menuitem', { name: '라디오' }));
    await userEvent.click(saveButton());

    expect(screen.getByText('질문 문구를 입력해 주세요.')).toBeInTheDocument();
    expect(
      screen.getByText('선택지를 1개 이상 입력해 주세요.'),
    ).toBeInTheDocument();
    expect(saveMutateAsync).not.toHaveBeenCalled();
  });

  it('서버 오류 코드를 한국어 안내로 바꿔 보여 준다', async () => {
    saveMutateAsync.mockRejectedValue(
      axiosError('ONE_TIME_FORM_QUESTION_TYPE_LOCKED'),
    );
    renderSection(0);
    await userEvent.click(screen.getByRole('checkbox', { name: '필수' }));
    await userEvent.click(saveButton());

    expect(
      await screen.findByText(/질문을 지우고 새로 만들어 주세요/),
    ).toBeInTheDocument();
  });
});
