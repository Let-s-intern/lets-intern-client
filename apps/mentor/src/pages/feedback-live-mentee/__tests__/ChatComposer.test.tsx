import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import ChatComposer from '../ui/ChatComposer';

describe('ChatComposer', () => {
  it('renders textarea and send button', () => {
    render(<ChatComposer onSend={vi.fn()} />);
    expect(screen.getByLabelText('메시지 입력')).toBeInTheDocument();
    expect(screen.getByLabelText('메시지 전송')).toBeInTheDocument();
  });

  it('calls onSend on Enter key', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<ChatComposer onSend={onSend} />);
    await user.type(
      screen.getByLabelText('메시지 입력'),
      '테스트 메시지{Enter}',
    );
    expect(onSend).toHaveBeenCalledWith('테스트 메시지');
  });

  it('does not call onSend on Shift+Enter', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<ChatComposer onSend={onSend} />);
    await user.type(
      screen.getByLabelText('메시지 입력'),
      '메시지{Shift>}{Enter}{/Shift}',
    );
    expect(onSend).not.toHaveBeenCalled();
  });
});
