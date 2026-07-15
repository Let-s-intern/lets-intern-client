import { describe, expect, it, vi, beforeEach, type Mock } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

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

/**
 * external_api.js 프로브를 mock 한다. jsdom 은 <script> 를 실제로 로드하지 않아
 * 실제 프로브는 타임아웃까지 pending 되므로, 성공/실패를 테스트에서 제어한다.
 * pickNextBase/safeHost 등 순수 로직은 실제 구현을 그대로 쓴다(부분 mock).
 */
vi.mock('./jitsiHealthCheck', async (importActual) => {
  const actual = await importActual<typeof import('./jitsiHealthCheck')>();
  return { ...actual, probeJitsiExternalApi: vi.fn() };
});

// mock 이후에 import — vi.mock 호이스팅 효과를 위해 아래에서 import
// eslint-disable-next-line import/order
import { JitsiEmbed } from './index';
// eslint-disable-next-line import/order
import { probeJitsiExternalApi } from './jitsiHealthCheck';

const probeMock = probeJitsiExternalApi as unknown as Mock;

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

/** 프로브 성공 후 JitsiMeeting 이 마운트될 때까지 기다린다. */
async function renderReady(
  overrides?: Partial<React.ComponentProps<typeof JitsiEmbed>>,
) {
  const utils = renderEmbed(overrides);
  await screen.findByTestId('jitsi-meeting-mock');
  return utils;
}

beforeEach(() => {
  probeMock.mockReset();
  // 기본값: 프로브 성공 → 바로 회의실 마운트.
  probeMock.mockResolvedValue(true);
});

describe('JitsiEmbed', () => {
  it('프로브 성공 시 JitsiMeeting에 domain과 roomName이 분리되어 전달된다', async () => {
    await renderReady();
    expect(capturedProps.current?.domain).toBe('jitsi-letscareer.supabin.com');
    expect(capturedProps.current?.roomName).toBe('room-abcd');
  });

  it('configOverwrite에 카메라 허용/480p/desktop FPS 정책이 전달된다', async () => {
    await renderReady();
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

  it('interfaceConfigOverwrite로 Jitsi 로고/워터마크가 모두 숨겨진다', async () => {
    await renderReady();
    const iface = capturedProps.current?.interfaceConfigOverwrite as Record<
      string,
      unknown
    >;
    expect(iface.SHOW_JITSI_WATERMARK).toBe(false);
    expect(iface.SHOW_BRAND_WATERMARK).toBe(false);
    expect(iface.SHOW_POWERED_BY).toBe(false);
    expect(iface.SHOW_WATERMARK_FOR_GUESTS).toBe(false);
  });

  it('onReadyToClose에 onClose가 그대로 연결된다', async () => {
    const onClose = vi.fn();
    await renderReady({ onClose });
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

  it('onApiReady가 종료/실패 계열 진단 이벤트 리스너를 등록한다', async () => {
    await renderReady();
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

  describe('failover', () => {
    it('프로브 실패 시 다음 후보 base로 재등록(registerBaseUrl)한다', async () => {
      probeMock.mockResolvedValue(false);
      const registerBaseUrl = vi.fn().mockResolvedValue(undefined);

      renderEmbed({
        // 후보[0] = 현재(죽은) 도메인, 후보[1] = 다음 healthy 후보
        baseCandidates: [
          'https://jitsi-letscareer.supabin.com/',
          'https://healthy.example.com/',
        ],
        registerBaseUrl,
      });

      await waitFor(() =>
        expect(registerBaseUrl).toHaveBeenCalledWith(
          'https://healthy.example.com/',
        ),
      );
      // 아직 회의실은 마운트되지 않는다(재연결 대기).
      expect(screen.queryByTestId('jitsi-meeting-mock')).toBeNull();
    });

    it('후보가 없으면 onExhausted를 호출하고 에러 UI를 노출한다', async () => {
      probeMock.mockResolvedValue(false);
      const onExhausted = vi.fn();

      renderEmbed({ baseCandidates: [], onExhausted });

      await waitFor(() => expect(onExhausted).toHaveBeenCalledTimes(1));
      expect(
        screen.getByText(/회의 서버에 연결할 수 없습니다/),
      ).toBeInTheDocument();
    });

    it('이미 시도한 도메인은 재시도하지 않고 소진 처리한다', async () => {
      probeMock.mockResolvedValue(false);
      const registerBaseUrl = vi.fn().mockResolvedValue(undefined);
      const onExhausted = vi.fn();

      // 유일 후보가 현재(죽은) 도메인 → 시도할 새 서버 없음.
      renderEmbed({
        baseCandidates: ['https://jitsi-letscareer.supabin.com/'],
        registerBaseUrl,
        onExhausted,
      });

      await waitFor(() => expect(onExhausted).toHaveBeenCalledTimes(1));
      expect(registerBaseUrl).not.toHaveBeenCalled();
    });

    /** onApiReady 로 넘어온 api mock — addListener 로 등록된 콜백을 캡처한다. */
    function captureApiListeners() {
      const listeners: Record<string, () => void> = {};
      const onApiReady = capturedProps.current?.onApiReady as (api: {
        addListener: (event: string, cb: () => void) => void;
      }) => void;
      onApiReady({
        addListener: (event, cb) => {
          listeners[event] = cb;
        },
      });
      return listeners;
    }

    it('회의 참가 전 connectionFailed는 다음 서버로 failover한다', async () => {
      const registerBaseUrl = vi.fn().mockResolvedValue(undefined);
      await renderReady({
        baseCandidates: [
          'https://jitsi-letscareer.supabin.com/',
          'https://healthy.example.com/',
        ],
        registerBaseUrl,
      });

      const listeners = captureApiListeners();
      listeners['connectionFailed']();

      await waitFor(() =>
        expect(registerBaseUrl).toHaveBeenCalledWith(
          'https://healthy.example.com/',
        ),
      );
    });

    it('회의 참가 후 connectionFailed는 서버를 갈아타지 않는다(블립 무시)', async () => {
      const registerBaseUrl = vi.fn().mockResolvedValue(undefined);
      await renderReady({
        baseCandidates: [
          'https://jitsi-letscareer.supabin.com/',
          'https://healthy.example.com/',
        ],
        registerBaseUrl,
      });

      const listeners = captureApiListeners();
      listeners['videoConferenceJoined']();
      listeners['connectionFailed']();

      // 참가 후 실패는 무시되어야 하므로 재등록이 일어나지 않는다.
      await new Promise((resolve) => setTimeout(resolve, 20));
      expect(registerBaseUrl).not.toHaveBeenCalled();
    });
  });
});
