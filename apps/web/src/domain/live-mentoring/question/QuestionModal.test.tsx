import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import {
  useLiveMentoringQuestionQuery,
  useUpdateLiveMentoringQuestionMutation,
} from '@/api/live-mentoring/liveMentoring';
import type { LiveMentoringQuestion } from '@/api/live-mentoring/liveMentoringSchema';
import QuestionModal from './QuestionModal';

jest.mock('@/api/live-mentoring/liveMentoring', () => ({
  __esModule: true,
  useLiveMentoringQuestionQuery: jest.fn(),
  useUpdateLiveMentoringQuestionMutation: jest.fn(),
}));

jest.mock('@/api/file', () => ({
  __esModule: true,
  uploadFileForId: jest.fn(),
}));

const useQuestionMock = useLiveMentoringQuestionQuery as jest.Mock;
const useUpdateMock = useUpdateLiveMentoringQuestionMutation as jest.Mock;
const mutate = jest.fn();

function makeQuestion(
  overrides: Partial<LiveMentoringQuestion> = {},
): LiveMentoringQuestion {
  return {
    applicationId: 10,
    deferred: false,
    content: '이력서에서 직무 적합성이 잘 드러나는지 봐주세요.',
    attachmentType: 'NONE',
    fileId: null,
    attachmentUrl: null,
    mentorShareAgreed: true,
    reservationStartAt: '2026-09-13T10:00:00',
    editable: true,
    ...overrides,
  };
}

function renderModal(
  question: LiveMentoringQuestion | null,
  { readOnly = false } = {},
) {
  useQuestionMock.mockReturnValue({
    data: question ?? undefined,
    isLoading: question === null,
  });
  const onClose = jest.fn();
  render(
    <QuestionModal applicationId={10} readOnly={readOnly} onClose={onClose} />,
  );
  return onClose;
}

beforeEach(() => {
  useQuestionMock.mockReset();
  mutate.mockReset();
  useUpdateMock.mockReturnValue({ mutate, isPending: false });
});

const saveButton = () =>
  screen.getByRole('button', { name: /저장하기|수정하기/ });

describe('QuestionModal — 시안 3-1 (미작성)', () => {
  it('빈 모달이고 버튼이 닫기 / 저장하기다', () => {
    renderModal(makeQuestion({ deferred: true, content: null }));

    expect(screen.getByLabelText('멘토링 질문')).toHaveValue('');
    expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '저장하기' })).toBeInTheDocument();
  });
});

describe('QuestionModal — 시안 3-2 (작성됨)', () => {
  it('쓴 내용이 채워져 있고 버튼이 수정 취소 / 수정하기다', () => {
    renderModal(makeQuestion());

    expect(screen.getByLabelText('멘토링 질문')).toHaveValue(
      '이력서에서 직무 적합성이 잘 드러나는지 봐주세요.',
    );
    expect(screen.getByRole('button', { name: '수정 취소' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '수정하기' })).toBeInTheDocument();
  });

  it('첨부 URL 이 있으면 초기값으로 채운다', () => {
    renderModal(
      makeQuestion({
        attachmentType: 'URL',
        attachmentUrl: 'https://example.test/resume',
      }),
    );

    // 응답 필드 이름은 attachmentUrl 이다. url 로 읽으면 빈 칸이 된다.
    expect(screen.getByLabelText('첨부 URL')).toHaveValue(
      'https://example.test/resume',
    );
  });
});

describe('QuestionModal — 안내 문구', () => {
  it('48시간 안내가 있다', () => {
    renderModal(makeQuestion());

    expect(
      screen.getByText(/멘토링 예약 시간 48시간 전까지 수정할 수 있어요/),
    ).toBeInTheDocument();
  });
});

describe('QuestionModal — editable 은 서버 값을 그대로 쓴다', () => {
  /*
    예약 시작 48시간 기준을 화면에서 다시 계산하면 클라이언트와 서버의 시계 차이로
    어긋나, 저장 버튼은 열려 있는데 저장은 거부되는 상태가 생긴다.
  */
  it('editable 이 false 면 저장이 잠기고 사유를 알린다', () => {
    renderModal(makeQuestion({ editable: false }));

    expect(saveButton()).toBeDisabled();
    expect(
      screen.getByText('예약 시간 48시간 전이 지나 질문을 수정할 수 없습니다.'),
    ).toBeInTheDocument();
  });

  it('editable 이 false 면 입력도 잠긴다', () => {
    renderModal(makeQuestion({ editable: false }));

    expect(screen.getByLabelText('멘토링 질문')).toHaveAttribute('readonly');
    expect(screen.getByRole('button', { name: '파일 업로드' })).toBeDisabled();
  });

  /* 참여 중·종료 카드에서 열면 서버가 editable 을 줘도 읽기 전용이다. */
  it('readOnly 로 열면 editable 이 true 여도 잠근다', () => {
    renderModal(makeQuestion({ editable: true }), { readOnly: true });

    expect(saveButton()).toBeDisabled();
    expect(screen.getByLabelText('멘토링 질문')).toHaveAttribute('readonly');
  });

  it('editable 이 true 고 읽기 전용이 아니면 저장할 수 있다', () => {
    renderModal(makeQuestion());
    expect(saveButton()).toBeEnabled();
  });
});

describe('QuestionModal — 저장', () => {
  it('고친 값을 서버 계약대로 보낸다', async () => {
    const onClose = renderModal(makeQuestion());

    fireEvent.change(screen.getByLabelText('멘토링 질문'), {
      target: { value: '고친 질문' },
    });
    fireEvent.click(saveButton());

    await waitFor(() => expect(mutate).toHaveBeenCalledTimes(1));
    expect(mutate.mock.calls[0][0]).toEqual({
      deferred: false,
      content: '고친 질문',
      attachmentType: 'NONE',
      fileId: null,
      url: null,
      mentorShareAgreed: true,
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  /*
    서버 validateQuestion 과 같은 규칙이다. 여기서 못 막으면 저장을 누른 뒤
    LIVE_MENTORING_INVALID_QUESTION 400 만 돌아온다.
  */
  it('내용을 비우면 저장이 잠긴다', () => {
    renderModal(makeQuestion());

    fireEvent.change(screen.getByLabelText('멘토링 질문'), {
      target: { value: '   ' },
    });

    expect(saveButton()).toBeDisabled();
  });

  it('저장에 실패하면 서버 문구를 보여주고 닫지 않는다', async () => {
    mutate.mockImplementation((_body, options) =>
      options.onError({
        response: { data: { message: '수정 가능 기한이 지났습니다.' } },
      }),
    );
    const onClose = renderModal(makeQuestion());

    fireEvent.click(saveButton());

    expect(
      await screen.findByText('수정 가능 기한이 지났습니다.'),
    ).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('저장에 성공하면 모달을 닫는다', async () => {
    mutate.mockImplementation((_body, options) => options.onSuccess());
    const onClose = renderModal(makeQuestion());

    fireEvent.click(saveButton());

    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
