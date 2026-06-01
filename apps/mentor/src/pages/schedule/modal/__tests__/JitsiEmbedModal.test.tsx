import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import JitsiEmbedModal from '../JitsiEmbedModal';

// JitsiEmbed(@letscareer/ui)는 실제 @jitsi/react-sdk를 끌어오므로 목으로 대체
vi.mock('@letscareer/ui/JitsiEmbed', () => ({
  JitsiEmbed: ({ roomUrl }: { roomUrl: string }) => (
    <div data-testid="jitsi-embed" data-room-url={roomUrl} />
  ),
}));

const TEST_URL = 'https://meet.jit.si/letscareer-x7k2p9';

describe('JitsiEmbedModal', () => {
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

  it('isOpen=true이고 meetingUrl이 있으면 회의실(jitsi-embed)을 BE URL로 렌더한다', () => {
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
});
