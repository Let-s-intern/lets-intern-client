/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import JitsiEmbedModal from './JitsiEmbedModal';

jest.mock('@letscareer/ui/JitsiEmbed', () => ({
  __esModule: true,
  JitsiEmbed: ({ roomUrl }: { roomUrl: string }) => (
    <div data-testid="jitsi-embed" data-room-url={roomUrl} />
  ),
  LiveSessionTimer: () => <div data-testid="live-session-timer" />,
  LiveFeedbackMaterials: () => <div data-testid="live-feedback-materials" />,
}));

const TEST_URL = 'https://meet.jit.si/letscareer-x7k2p9';

describe('JitsiEmbedModal (web)', () => {
  beforeAll(() => {
    if (!document.getElementById('modal')) {
      const root = document.createElement('div');
      root.id = 'modal';
      document.body.appendChild(root);
    }
  });

  it('isOpen=false면 아무것도 렌더하지 않는다', () => {
    const { container } = render(
      <JitsiEmbedModal
        isOpen={false}
        onClose={() => {}}
        meetingUrl={TEST_URL}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('isOpen=true이고 meetingUrl이 있으면 jitsi-embed를 BE URL로 렌더한다', () => {
    render(<JitsiEmbedModal isOpen onClose={() => {}} meetingUrl={TEST_URL} />);
    const embed = screen.getByTestId('jitsi-embed');
    expect(embed).toBeInTheDocument();
    expect(embed).toHaveAttribute('data-room-url', TEST_URL);
  });

  it('meetingUrl이 null이면 회의실 대신 준비 중 안내를 표시한다', () => {
    render(<JitsiEmbedModal isOpen onClose={() => {}} meetingUrl={null} />);
    expect(screen.queryByTestId('jitsi-embed')).not.toBeInTheDocument();
    expect(
      screen.getByText(/회의실이 아직 준비되지 않았습니다/),
    ).toBeInTheDocument();
  });

  it('모달 바깥(오버레이) 클릭으로는 닫히지 않는다', async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();
    render(
      <JitsiEmbedModal isOpen onClose={handleClose} meetingUrl={TEST_URL} />,
    );

    const overlay = document.querySelector('[aria-hidden="true"]');
    expect(overlay).not.toBeNull();
    if (!overlay) return;

    await user.click(overlay);
    expect(handleClose).not.toHaveBeenCalled();
  });
});
