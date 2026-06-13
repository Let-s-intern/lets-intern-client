/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';

// next/dynamic 은 즉시 컴포넌트를 반환하도록 목 처리.
jest.mock('next/dynamic', () => () => {
  const Frame = ({ roomUrl }: { roomUrl: string }) => (
    <div data-testid="jitsi-frame" data-room-url={roomUrl} />
  );
  return Frame;
});

import InlineJitsi from './InlineJitsi';

describe('InlineJitsi', () => {
  it('meetingUrl이 null이면 아무것도 렌더하지 않는다', () => {
    const { container } = render(
      <InlineJitsi meetingUrl={null} onClose={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('meetingUrl이 있으면 프레임을 해당 URL로 렌더한다', () => {
    render(
      <InlineJitsi
        meetingUrl="https://meet.example.com/room-abc"
        onClose={() => {}}
      />,
    );
    expect(screen.getByTestId('jitsi-frame')).toHaveAttribute(
      'data-room-url',
      'https://meet.example.com/room-abc',
    );
  });
});
