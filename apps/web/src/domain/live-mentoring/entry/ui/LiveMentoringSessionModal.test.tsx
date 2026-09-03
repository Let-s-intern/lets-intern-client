/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';

import LiveMentoringSessionModal from './LiveMentoringSessionModal';

jest.mock('@letscareer/live-session/JitsiEmbed', () => ({
  __esModule: true,
  JitsiEmbed: ({ onJoined }: { onJoined?: () => void }) => (
    <div data-testid="jitsi-embed">
      <button type="button" onClick={() => onJoined?.()}>
        회의참가
      </button>
    </div>
  ),
  LiveSessionTimer: () => <div data-testid="live-session-timer" />,
  LiveFeedbackMaterials: () => <div data-testid="live-feedback-materials" />,
}));

describe('LiveMentoringSessionModal', () => {
  beforeAll(() => {
    if (!document.getElementById('modal')) {
      const root = document.createElement('div');
      root.id = 'modal';
      document.body.appendChild(root);
    }
  });

  // JitsiEmbed 가 실제로 회의에 참가했을 때 부르는 onJoined 를 그대로 위(Page)로
  // 전달하는지 확인한다 — 종료 후 후기 모달을 띄울지 판단하는 유일한 근거다.
  it('JitsiEmbed의 onJoined 를 그대로 위로 전달한다', () => {
    const onJoined = jest.fn();
    render(
      <LiveMentoringSessionModal
        isOpen
        onClose={() => {}}
        meetingUrl="https://meet.jit.si/letscareer-room"
        myRole="MENTEE"
        menteeName="박멘티"
        onJoined={onJoined}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '회의참가' }));

    expect(onJoined).toHaveBeenCalledTimes(1);
  });

  it('onJoined 가 없어도 에러 없이 렌더한다', () => {
    render(
      <LiveMentoringSessionModal
        isOpen
        onClose={() => {}}
        meetingUrl="https://meet.jit.si/letscareer-room"
        myRole="MENTOR"
        menteeName="박멘티"
      />,
    );

    expect(() =>
      fireEvent.click(screen.getByRole('button', { name: '회의참가' })),
    ).not.toThrow();
  });
});
