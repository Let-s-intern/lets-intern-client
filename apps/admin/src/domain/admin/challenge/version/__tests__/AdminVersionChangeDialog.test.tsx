import { ApiError } from '@letscareer/api';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AdminVersionChangeDialog from '../AdminVersionChangeDialog';

const { mutateAsync, snackbar } = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
  snackbar: vi.fn(),
}));

vi.mock('@/api/challenge/challenge', () => ({
  usePatchAdminApplicationVersion: () => ({ mutateAsync, isPending: false }),
}));

vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar }),
}));

const versions = [
  { challengeVersionId: 10, title: '대학생' },
  { challengeVersionId: 20, title: '직장인' },
];

const renderDialog = (challengeVersionId: number | null) => {
  const onClose = vi.fn();
  render(
    <AdminVersionChangeDialog
      challengeId="300"
      application={{ id: 7, name: '김렛츠', challengeVersionId }}
      versions={versions}
      onClose={onClose}
    />,
  );
  return { onClose, user: userEvent.setup() };
};

const versionBox = () => screen.getByRole('combobox', { name: '버전' });
const saveButton = () => screen.getByRole('button', { name: '저장' });

const chooseVersion = async (
  user: ReturnType<typeof userEvent.setup>,
  title: string,
) => {
  await user.click(versionBox());
  await user.click(
    within(screen.getByRole('listbox')).getByRole('option', { name: title }),
  );
};

describe('AdminVersionChangeDialog', () => {
  beforeEach(() => {
    mutateAsync.mockReset();
    snackbar.mockReset();
  });

  it('참여자의 현재 버전이 선택된 상태로 열린다', () => {
    renderDialog(10);

    expect(
      screen.getByText('김렛츠 님의 버전을 변경합니다.'),
    ).toBeInTheDocument();
    expect(versionBox()).toHaveTextContent('대학생');
  });

  it('현재와 같은 버전이면 저장이 비활성이고, 다른 버전을 고르면 활성이 된다', async () => {
    const { user } = renderDialog(10);

    expect(saveButton()).toBeDisabled();

    await chooseVersion(user, '직장인');
    expect(saveButton()).toBeEnabled();

    await chooseVersion(user, '대학생');
    expect(saveButton()).toBeDisabled();
  });

  it('버전이 없던 신청은 고르기 전까지 저장이 비활성이다', async () => {
    const { user } = renderDialog(null);

    expect(versionBox()).toHaveTextContent('버전 선택');
    expect(saveButton()).toBeDisabled();

    await chooseVersion(user, '직장인');
    expect(saveButton()).toBeEnabled();
  });

  it('저장하면 신청 id 와 고른 버전 id 로 요청하고, 스낵바를 띄운 뒤 닫는다', async () => {
    mutateAsync.mockResolvedValue(null);
    const { onClose, user } = renderDialog(10);

    await chooseVersion(user, '직장인');
    await user.click(saveButton());

    expect(mutateAsync).toHaveBeenCalledWith({
      applicationId: 7,
      challengeVersionId: 20,
    });
    expect(snackbar).toHaveBeenCalledWith('버전이 변경되었습니다.');
    expect(onClose).toHaveBeenCalled();
  });

  it('실패하면 서버 문구를 스낵바로 띄우고 닫지 않는다', async () => {
    mutateAsync.mockRejectedValue(
      new ApiError({
        code: 'VERSION_CHANGE_NOT_ALLOWED_LIGHT',
        message: '라이트 플랜은 버전을 변경할 수 없습니다.',
        status: 400,
        endpoint: '/admin/application/7/version',
        method: 'PATCH',
      }),
    );
    const { onClose, user } = renderDialog(10);

    await chooseVersion(user, '직장인');
    await user.click(saveButton());

    expect(snackbar).toHaveBeenCalledWith(
      '라이트 플랜은 버전을 변경할 수 없습니다.',
    );
    expect(onClose).not.toHaveBeenCalled();
  });
});
