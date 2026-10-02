/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';

const mockCurrentChallenge: Record<string, unknown> = {};
jest.mock('@/context/CurrentChallengeProvider', () => ({
  useCurrentChallenge: () => ({ currentChallenge: mockCurrentChallenge }),
}));

import LinkInputSection from './LinkInputSection';

const enterButton = () => screen.queryByRole('button', { name: /입장하기$/ });

afterEach(() => {
  delete mockCurrentChallenge.chatLink;
  delete mockCurrentChallenge.chatPassword;
});

describe('LinkInputSection — 공유 안내와 입장 버튼', () => {
  it('카카오톡 링크면 카카오톡으로 안내하고 입장 버튼을 붙인다', () => {
    mockCurrentChallenge.chatLink = 'https://open.kakao.com/o/abc123';
    render(<LinkInputSection />);

    expect(
      screen.getByText(/카카오톡 오픈채팅방에 공유해야 제출이 인정됩니다/),
    ).toBeInTheDocument();
    expect(enterButton()).toHaveTextContent('오픈채팅방 입장하기');
  });

  it('슬랙 링크면 슬랙으로 안내하고 슬랙 입장 버튼을 붙인다', () => {
    mockCurrentChallenge.chatLink =
      'https://join.slack.com/t/abc/shared_invite/xyz';
    render(<LinkInputSection />);

    expect(
      screen.getByText(/슬랙 채널에 공유해야 제출이 인정됩니다/),
    ).toBeInTheDocument();
    expect(enterButton()).toHaveTextContent('슬랙 채널 입장하기');
  });

  /* 어드민이 링크를 안 넣은 챌린지도 있다. 안내는 남기고 버튼만 감춘다. */
  it('링크가 없으면 버튼을 붙이지 않는다', () => {
    render(<LinkInputSection />);

    expect(
      screen.getByText(/카카오톡 오픈채팅방에 공유해야 제출이 인정됩니다/),
    ).toBeInTheDocument();
    expect(enterButton()).not.toBeInTheDocument();
  });

  /*
    보너스 미션은 text 를 직접 넘기고 공유 안내 자체가 없다. 거기에 입장 버튼이
    생기면 안내 없는 자리에 버튼만 뜬다.
  */
  it('text 를 직접 넘기면 그 문구를 쓰고 버튼을 붙이지 않는다', () => {
    mockCurrentChallenge.chatLink = 'https://open.kakao.com/o/abc123';
    render(<LinkInputSection text="링크가 잘 열리는지 확인해주세요." />);

    expect(
      screen.getByText('링크가 잘 열리는지 확인해주세요.'),
    ).toBeInTheDocument();
    expect(screen.queryByText(/공유해야 제출이 인정됩니다/)).toBeNull();
    expect(enterButton()).not.toBeInTheDocument();
  });
});
