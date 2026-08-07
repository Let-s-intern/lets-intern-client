import { render, screen } from '@testing-library/react';
import OpenChatLink from './OpenChatLink';

describe('OpenChatLink', () => {
  it('카카오 오픈채팅 링크면 카카오 아이콘과 "오픈채팅방 입장"을 보여준다', () => {
    render(<OpenChatLink link="https://open.kakao.com/o/abc123" />);

    expect(screen.getByText('오픈채팅방 입장')).toBeInTheDocument();
    expect(screen.queryByText('슬랙 채널 입장')).not.toBeInTheDocument();

    const icon = screen.getByRole('button').querySelector('img');
    expect(icon).toHaveAttribute('src', '/icons/kakao-channel.svg');
  });

  it('슬랙 링크면 슬랙 아이콘과 "슬랙 채널 입장"을 보여준다', () => {
    render(<OpenChatLink link="https://letscareer.slack.com/archives/C123" />);

    expect(screen.getByText('슬랙 채널 입장')).toBeInTheDocument();
    expect(screen.queryByText('오픈채팅방 입장')).not.toBeInTheDocument();

    const icon = screen.getByRole('button').querySelector('img');
    expect(icon).toHaveAttribute('src', '/icons/slack-channel.png');
  });
});
