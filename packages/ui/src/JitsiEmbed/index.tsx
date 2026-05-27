'use client';

import { JitsiMeeting } from '@jitsi/react-sdk';

interface JitsiEmbedProps {
  /** 회의실 URL — 외부에서 buildJitsiRoomUrl로 생성해 전달 (셀프호스팅 단일 사용) */
  roomUrl: string;
  /** 헤더에 노출할 회의실 이름 (현재 UI에는 표시 X. SDK userInfo 등 향후 확장용) */
  spaceName?: string;
  /** 닫기 버튼 또는 Jitsi hangup / End for all 시 호출 */
  onClose: () => void;
}

/**
 * Jitsi 클라이언트 설정 — 오디오 only + 화면공유 모드.
 *
 * 정책:
 * - 카메라 차단: toolbarButtons에서 'camera' 제외 → UI에 버튼 없음
 * - 시작 시 비디오 OFF, 마이크 ON
 * - 화면공유 1인 (Jitsi 기본 동작)
 * - 카메라 트랙 480p (사용자 우회 대비), 화면공유 5~15FPS
 */
const ALLOWED_TOOLBAR_BUTTONS = [
  'microphone',
  'desktop',
  'chat',
  'tileview',
  'fullscreen',
  'raisehand',
  'settings',
  'hangup',
];

const CONFIG_OVERWRITE = {
  startWithVideoMuted: true,
  startWithAudioMuted: false,
  disableSelfView: true,
  toolbarButtons: ALLOWED_TOOLBAR_BUTTONS,
  resolution: 480,
  constraints: {
    video: { height: { ideal: 480, max: 480, min: 240 } },
  },
  disableSimulcast: true,
  desktopSharingFrameRate: { min: 5, max: 15 },
  prejoinPageEnabled: false,
};

const INTERFACE_CONFIG_OVERWRITE = {
  // Jitsi 로고/워터마크 전부 숨김 (1차)
  SHOW_JITSI_WATERMARK: false,
  SHOW_WATERMARK_FOR_GUESTS: false,
  SHOW_BRAND_WATERMARK: false,
  SHOW_POWERED_BY: false,
  JITSI_WATERMARK_LINK: '',
  BRAND_WATERMARK_LINK: '',
  DEFAULT_LOGO_URL: '',
  DEFAULT_WELCOME_PAGE_LOGO_URL: '',
  DISABLE_PRESENCE_STATUS: true,
  DISABLE_VIDEO_BACKGROUND: true,
  HIDE_DEEP_LINKING_LOGO: true,
  DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
  // 신 버전 deep linking 페이지에서도 로고 숨김
  GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
  DISPLAY_WELCOME_FOOTER: false,
  DISPLAY_WELCOME_PAGE_CONTENT: false,
  DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
};

/** roomUrl을 도메인과 방 이름으로 분리 */
function parseRoomUrl(roomUrl: string): { domain: string; roomName: string } {
  const url = new URL(roomUrl);
  return {
    domain: url.host,
    roomName: decodeURIComponent(url.pathname.replace(/^\//, '')),
  };
}

/**
 * Jitsi 회의실을 임베드하는 본문 컴포넌트.
 *
 * - `@jitsi/react-sdk`의 `JitsiMeeting` 사용 — 스크립트 로드/dispose 자동
 * - hangup / End for all → `onReadyToClose` → 모달 자동 닫힘
 * - 모달 셸은 각 앱에서 자체 BaseModal로 감싸 사용
 */
export function JitsiEmbed({ roomUrl, onClose }: JitsiEmbedProps) {
  const { domain, roomName } = parseRoomUrl(roomUrl);

  return (
    <div className="relative h-full w-full bg-neutral-900">
      {/* Jitsi 좌측 상단 워터마크 마스킹 — interfaceConfig/configs로도 안 숨겨질 때 마지막 안전선 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-[5] h-16 w-32 bg-neutral-900"
      />
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="absolute right-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-black/80"
      >
        닫기
      </button>
      <JitsiMeeting
        domain={domain}
        roomName={roomName}
        configOverwrite={CONFIG_OVERWRITE}
        interfaceConfigOverwrite={INTERFACE_CONFIG_OVERWRITE}
        onReadyToClose={onClose}
        getIFrameRef={(node) => {
          node.style.height = '100%';
          node.style.width = '100%';
          node.style.border = '0';
        }}
      />
    </div>
  );
}
