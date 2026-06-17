import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

/**
 * @jitsi/react-sdk를 mock으로 대체.
 * jsdom에서 실제 SDK가 동작하지 않으므로 props만 캡처해 검증한다.
 */
const capturedProps: { current: Record<string, unknown> | null } = {
  current: null,
};

vi.mock('@jitsi/react-sdk', () => ({
  JitsiMeeting: (props: Record<string, unknown>) => {
    capturedProps.current = props;
    return <div data-testid="jitsi-meeting-mock" />;
  },
}));

// mock 이후에 import — vi.mock 호이스팅 효과를 위해 동적 import 형태 사용
// eslint-disable-next-line import/order
import { JitsiEmbed } from './index';

const ROOM_URL = 'https://jitsi-letscareer.supabin.com/room-abcd';

function renderEmbed(
  overrides?: Partial<React.ComponentProps<typeof JitsiEmbed>>,
) {
  capturedProps.current = null;
  const onClose = overrides?.onClose ?? vi.fn();
  const utils = render(
    <JitsiEmbed roomUrl={ROOM_URL} onClose={onClose} {...overrides} />,
  );
  return { ...utils, onClose };
}

describe('JitsiEmbed', () => {
  it('JitsiMeeting에 domain과 roomName이 분리되어 전달된다', () => {
    renderEmbed();
    expect(capturedProps.current?.domain).toBe('jitsi-letscareer.supabin.com');
    expect(capturedProps.current?.roomName).toBe('room-abcd');
  });

  it('configOverwrite에 카메라 허용/480p/desktop FPS 정책이 전달된다', () => {
    renderEmbed();
    const config = capturedProps.current?.configOverwrite as Record<
      string,
      unknown
    >;
    expect(config.startWithVideoMuted).toBe(false);
    expect(config.startWithAudioMuted).toBe(false);
    expect(config.disableSelfView).toBe(false);
    expect(config.resolution).toBe(480);
    expect(config.disableSimulcast).toBe(true);
    expect(config.toolbarButtons).toContain('microphone');
    expect(config.toolbarButtons).toContain('desktop');
    expect(config.toolbarButtons).toContain('camera');
  });

  it('interfaceConfigOverwrite로 Jitsi 로고/워터마크가 모두 숨겨진다', () => {
    renderEmbed();
    const iface = capturedProps.current?.interfaceConfigOverwrite as Record<
      string,
      unknown
    >;
    expect(iface.SHOW_JITSI_WATERMARK).toBe(false);
    expect(iface.SHOW_BRAND_WATERMARK).toBe(false);
    expect(iface.SHOW_POWERED_BY).toBe(false);
    expect(iface.SHOW_WATERMARK_FOR_GUESTS).toBe(false);
  });

  it('onReadyToClose에 onClose가 그대로 연결된다', () => {
    const onClose = vi.fn();
    renderEmbed({ onClose });
    const handler = capturedProps.current?.onReadyToClose as () => void;
    handler();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('닫기 버튼 클릭 시 onClose가 호출된다', () => {
    const onClose = vi.fn();
    renderEmbed({ onClose });
    fireEvent.click(screen.getByRole('button', { name: '닫기' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('워터마크 커버가 렛츠커리어 로고를 포함하고 클릭을 차단한다(pointer-events-none 없음)', () => {
    const { container } = renderEmbed();
    const cover = container.querySelector('[data-watermark-cover]');
    expect(cover).not.toBeNull();
    // pointer-events-none 이면 클릭이 아래 Jitsi 워터마크 링크로 통과한다 — 금지
    expect(cover?.className).not.toMatch(/pointer-events-none/);
    expect(cover?.querySelector('svg')).not.toBeNull();
  });

  it('onApiReady가 종료/실패 계열 진단 이벤트 리스너를 등록한다', () => {
    renderEmbed();
    const onApiReady = capturedProps.current?.onApiReady as (api: {
      addListener: (event: string, cb: (p: unknown) => void) => void;
    }) => void;
    const addListener = vi.fn();
    onApiReady({ addListener });
    const events = addListener.mock.calls.map(([event]) => event);
    expect(events).toContain('videoConferenceLeft');
    expect(events).toContain('connectionFailed');
    expect(events).toContain('errorOccurred');
  });
});
