import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminSnackbarProvider } from '@/hooks/useAdminSnackbar';

import { buildPopupCode } from '../utils/popupCode';
import OneTimeFormLinkPanel from './OneTimeFormLinkPanel';

const WEB = 'https://www.letscareer.co.kr/';
const APPLY = 'https://www.letscareer.co.kr/form/portfolio-1115';

const writeText = vi.fn();

const renderPanel = (isVisible = true) =>
  render(
    <AdminSnackbarProvider>
      <OneTimeFormLinkPanel
        form={{ slug: 'portfolio-1115', isVisible }}
        webBase={WEB}
      />
    </AdminSnackbarProvider>,
  );

/** userEvent.setup 이 navigator.clipboard 를 자기 것으로 바꾸므로 그 뒤에 덮어쓴다 */
const setupUser = () => {
  const user = userEvent.setup();
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });
  return user;
};

beforeEach(() => {
  writeText.mockReset();
});

describe('OneTimeFormLinkPanel', () => {
  it('세 가지 값을 보여 주고 누른 줄의 값을 복사한다', async () => {
    writeText.mockResolvedValue(undefined);
    const user = setupUser();
    renderPanel();

    expect(screen.getByRole('textbox', { name: '신청 URL' })).toHaveValue(
      APPLY,
    );
    expect(
      screen.getByRole('textbox', { name: '신청 확인·취소 URL' }),
    ).toHaveValue(`${APPLY}/my`);

    await user.click(screen.getByRole('button', { name: '신청 URL 복사' }));
    expect(writeText).toHaveBeenLastCalledWith(APPLY);
    expect(await screen.findByText('복사했습니다.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '팝업용 코드 복사' }));
    expect(writeText).toHaveBeenLastCalledWith(buildPopupCode(APPLY));

    await user.click(
      screen.getByRole('button', { name: '신청 확인·취소 URL 복사' }),
    );
    expect(writeText).toHaveBeenLastCalledWith(`${APPLY}/my`);
  });

  it('복사에 실패하면 알린다', async () => {
    writeText.mockRejectedValue(new Error('denied'));
    const user = setupUser();
    renderPanel();

    await user.click(screen.getByRole('button', { name: '신청 URL 복사' }));
    expect(await screen.findByText(/복사하지 못했습니다/)).toBeInTheDocument();
  });

  it('비공개 폼이면 공개해야 열린다고 알린다', () => {
    renderPanel(false);
    expect(screen.getByText(/비공개 폼입니다/)).toBeInTheDocument();
  });

  it('공개 폼이면 안내를 띄우지 않는다', () => {
    renderPanel(true);
    expect(screen.queryByText(/비공개 폼입니다/)).not.toBeInTheDocument();
  });
});
