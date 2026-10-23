/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';

import MissionShareModal from './MissionShareModal';

const KAKAO = 'https://open.kakao.com/o/abc123';
const SLACK = 'https://join.slack.com/t/abc/shared_invite/xyz';

describe('MissionShareModal', () => {
  it('카카오톡 링크면 카카오톡으로 안내한다', () => {
    render(<MissionShareModal link={KAKAO} onClose={jest.fn()} />);

    expect(
      screen.getByText(/카카오톡 오픈채팅방에 공유해야 제출이 인정됩니다/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '오픈채팅방 입장' }),
    ).toBeInTheDocument();
  });

  it('슬랙 링크면 슬랙으로 안내한다', () => {
    render(<MissionShareModal link={SLACK} onClose={jest.fn()} />);

    expect(
      screen.getByText(/슬랙 채널에 공유해야 제출이 인정됩니다/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '슬랙 채널 입장' }),
    ).toBeInTheDocument();
  });

  /*
    참여코드는 채팅방에 도착한 뒤에 필요하다. 그때는 이미 이 페이지를 벗어난 뒤라
    돌아와야 하므로, 입장 전에 함께 보여준다.
  */
  it('참여코드가 있으면 함께 보여준다', () => {
    render(
      <MissionShareModal link={KAKAO} password="1234" onClose={jest.fn()} />,
    );

    expect(screen.getByText('참여코드')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('참여코드가 없으면 코드 자리를 만들지 않는다', () => {
    render(<MissionShareModal link={KAKAO} onClose={jest.fn()} />);

    expect(screen.queryByText('참여코드')).not.toBeInTheDocument();
  });

  it('입장을 누르면 새 탭으로 열고 모달을 닫는다', () => {
    const onClose = jest.fn();
    const open = jest.spyOn(window, 'open').mockReturnValue(null);
    render(<MissionShareModal link={KAKAO} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: '오픈채팅방 입장' }));

    expect(open).toHaveBeenCalledWith(KAKAO, '_blank', 'noopener,noreferrer');
    expect(onClose).toHaveBeenCalled();
    open.mockRestore();
  });

  /* 닫아도 제출 버튼 아래 공유 버튼이 남는다. 여기서 막으면 안 된다. */
  it('나중에를 누르면 열지 않고 닫기만 한다', () => {
    const onClose = jest.fn();
    const open = jest.spyOn(window, 'open').mockReturnValue(null);
    render(<MissionShareModal link={KAKAO} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: '나중에' }));

    expect(open).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
    open.mockRestore();
  });
});
