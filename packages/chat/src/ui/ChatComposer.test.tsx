import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import ChatComposer from './ChatComposer';

describe('ChatComposer', () => {
  it('입력 후 전송 버튼 클릭 시 trim된 텍스트로 onSend 호출', async () => {
    const onSend = vi.fn();
    render(<ChatComposer onSend={onSend} />);
    await userEvent.type(screen.getByLabelText('메시지 입력'), '  안녕  ');
    await userEvent.click(screen.getByLabelText('메시지 전송'));
    expect(onSend).toHaveBeenCalledWith('안녕');
  });

  it('Enter로 전송, 전송 후 입력값 초기화', async () => {
    const onSend = vi.fn();
    render(<ChatComposer onSend={onSend} />);
    const input = screen.getByLabelText('메시지 입력') as HTMLTextAreaElement;
    await userEvent.type(input, '메시지{Enter}');
    expect(onSend).toHaveBeenCalledWith('메시지');
    expect(input.value).toBe('');
  });

  it('빈 값은 전송하지 않는다 (early return)', async () => {
    const onSend = vi.fn();
    render(<ChatComposer onSend={onSend} />);
    await userEvent.type(screen.getByLabelText('메시지 입력'), '   {Enter}');
    expect(onSend).not.toHaveBeenCalled();
  });

  it('disabled면 전송 버튼이 비활성화된다', () => {
    render(<ChatComposer onSend={vi.fn()} disabled />);
    expect(screen.getByLabelText('메시지 전송')).toBeDisabled();
  });
});
