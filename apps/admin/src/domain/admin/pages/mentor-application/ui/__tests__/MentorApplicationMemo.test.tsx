import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const get = vi.fn();
const patch = vi.fn();
const snackbar = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
    patch: (...args: unknown[]) => patch(...args),
  },
}));
vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar }),
}));

import MentorApplicationDialog from '../MentorApplicationDialog';

/* 서버 GetAdminMentorApplicationResponseDto 와 같은 키. 목록 전용 hasAttachment 는 없다 */
const detail = {
  id: 7,
  userId: null,
  submittedAt: '2026-10-28T14:02:00',
  name: '김하늘',
  company: '예시테크',
  jobTitle: '프로덕트 매니저',
  yearsOfExperience: 7,
  phoneNum: '01012345678',
  email: 'haneul.kim@example.com',
  preferredContactMethods: ['PHONE'],
  jobFields: ['ETC'],
  mentoringTypes: ['JOB_QNA'],
  introduction: null,
  motivation: null,
  snsLinks: [],
  attachmentUrl: null,
  attachmentName: null,
  privacyAgreedAt: '2026-10-28T14:02:00',
  status: 'CHECKING',
  expectedReplyDate: '2026-11-04',
  adminMemo: '첫 통화 완료',
};

const onClose = vi.fn();

const renderDialog = async () => {
  get.mockResolvedValue({ data: { data: detail } });
  render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
          },
        })
      }
    >
      <MentorApplicationDialog applicationId={7} onClose={onClose} />
    </QueryClientProvider>,
  );
  return screen.findByLabelText(/운영 메모/);
};

const saveButton = () => screen.getByRole('button', { name: '메모 저장' });

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe('운영 메모', () => {
  it('저장된 메모를 보여주고, 바뀌었을 때만 저장 버튼이 활성화된다', async () => {
    const textarea = await renderDialog();
    expect(textarea).toHaveValue('첫 통화 완료');
    expect(textarea).toHaveAttribute('maxLength', '5000');
    expect(textarea).toHaveAttribute(
      'placeholder',
      '검토 내용, 연락한 기록 등',
    );
    expect(saveButton()).toBeDisabled();

    fireEvent.change(textarea, { target: { value: '첫 통화 완료, 재연락' } });
    expect(saveButton()).toBeEnabled();

    fireEvent.change(textarea, { target: { value: '첫 통화 완료' } });
    expect(saveButton()).toBeDisabled();
  });

  it('저장하면 메모 API 를 부르고 상세를 다시 불러오고 스낵바를 띄운다', async () => {
    patch.mockResolvedValue({});
    const textarea = await renderDialog();
    fireEvent.change(textarea, { target: { value: '재연락 예정' } });
    get.mockResolvedValue({
      data: { data: { ...detail, adminMemo: '재연락 예정' } },
    });
    fireEvent.click(saveButton());

    await waitFor(() =>
      expect(snackbar).toHaveBeenCalledWith('운영 메모가 저장되었습니다.'),
    );
    expect(patch).toHaveBeenCalledWith('/admin/mentor-application/7/memo', {
      memo: '재연락 예정',
    });
    expect(get).toHaveBeenCalledTimes(2);
    expect(textarea).toHaveValue('재연락 예정');
    expect(saveButton()).toBeDisabled();
  });

  it('바뀐 메모가 없으면 확인 없이 닫는다', async () => {
    const confirm = vi.spyOn(window, 'confirm');
    await renderDialog();
    fireEvent.click(screen.getByRole('button', { name: '닫기' }));

    expect(confirm).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('저장하지 않은 메모가 있으면 닫기 전에 묻고, 취소하면 닫지 않는다', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const textarea = await renderDialog();
    fireEvent.change(textarea, { target: { value: '작성 중' } });
    fireEvent.click(screen.getByRole('button', { name: '닫기' }));

    expect(confirm).toHaveBeenCalledWith(
      '저장하지 않은 운영 메모가 있습니다. 닫을까요?',
    );
    expect(onClose).not.toHaveBeenCalled();

    confirm.mockReturnValue(true);
    fireEvent.click(screen.getByRole('button', { name: '닫기' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
