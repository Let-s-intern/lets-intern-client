import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { ChatMessage } from '../schema';
import ChatThread from './ChatThread';

function msg(
  id: string,
  sender: 'mentor' | 'mentee',
  text: string,
  created = '2026-05-28 10:00:00.000Z',
): ChatMessage {
  return { id, room: 'feedback_1', sender, text, created };
}

describe('ChatThread', () => {
  it('메시지가 없으면 빈 상태를 보여준다', () => {
    render(<ChatThread messages={[]} myRole="mentee" />);
    expect(screen.getByText('아직 메시지가 없습니다.')).toBeInTheDocument();
  });

  it('내 메시지는 오른쪽 정렬(flex-row-reverse)된다', () => {
    render(
      <ChatThread
        messages={[msg('m1', 'mentee', '내 메시지')]}
        myRole="mentee"
      />,
    );
    const bubble = screen.getByText('내 메시지').closest('.mb-2');
    expect(bubble?.className).toContain('flex-row-reverse');
  });

  it('상대 메시지는 왼쪽 정렬이며 아바타 이니셜을 보여준다', () => {
    render(
      <ChatThread
        messages={[msg('m1', 'mentor', '상대 메시지')]}
        myRole="mentee"
        counterpartName="홍길동"
      />,
    );
    const bubble = screen.getByText('상대 메시지').closest('.mb-2');
    expect(bubble?.className).toContain('flex-row');
    expect(bubble?.className).not.toContain('flex-row-reverse');
    expect(screen.getByText('홍')).toBeInTheDocument();
  });
});
