'use client';

import type { ReactNode } from 'react';

import { JitsiMeeting } from '@jitsi/react-sdk';

import { LetsCareerLogo } from './LetsCareerLogo';

interface JitsiEmbedProps {
  /** 회의실 URL — 외부에서 buildJitsiRoomUrl로 생성해 전달 (셀프호스팅 단일 사용) */
  roomUrl: string;
  /** 헤더에 노출할 회의실 이름 (현재 UI에는 표시 X. SDK userInfo 등 향후 확장용) */
  spaceName?: string;
  /** 닫기 버튼 또는 Jitsi hangup / End for all 시 호출 */
  onClose: () => void;
  /** 좌상단 로고 패널 안(로고 아래)에 함께 묶어 보여줄 내용(예: 세션 타이머). */
  topLeftSlot?: ReactNode;
}

/**
 * Jitsi 클라이언트 설정 — 카메라(얼굴)·마이크·화면공유 모드.
 *
 * 정책:
 * - 카메라 허용: toolbarButtons에 'camera' 포함 → 얼굴 공유 가능
 * - 시작 시 비디오 ON, 마이크 ON
 * - 화면공유 1인 (Jitsi 기본 동작)
 * - 카메라 트랙 480p (사용자 우회 대비), 화면공유 5~15FPS
 */
const ALLOWED_TOOLBAR_BUTTONS = [
  'microphone',
  'camera',
  'desktop',
  'chat',
  'tileview',
  'fullscreen',
  'raisehand',
  'settings',
  'hangup',
];

const CONFIG_OVERWRITE = {
  startWithVideoMuted: false,
  startWithAudioMuted: false,
  disableSelfView: false,
  toolbarButtons: ALLOWED_TOOLBAR_BUTTONS,
  resolution: 480,
  constraints: {
    video: { height: { ideal: 480, max: 480, min: 240 } },
  },
  disableSimulcast: true,
  desktopSharingFrameRate: { min: 5, max: 15 },
  prejoinPageEnabled: false,
  // 신버전 워터마크 로고 제거(클라이언트 측). 빈 문자열이면 로고를 그리지 않는다.
  defaultLogoUrl: '',
  // 좌상단 비디오 화질 라벨(예: 480p/HD) 숨김.
  hideConferenceSubject: true,
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
  // 화면 화질(quality) 라벨/연결 표시 숨김
  VIDEO_QUALITY_LABEL_DISABLED: true,
  CONNECTION_INDICATOR_DISABLED: true,
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
export function JitsiEmbed({ roomUrl, onClose, topLeftSlot }: JitsiEmbedProps) {
  const { domain, roomName } = parseRoomUrl(roomUrl);

  return (
    <div className="relative h-full w-full bg-neutral-900">
      {/* 좌상단 — 로고 + (옵션)타이머를 하나의 반투명 아크릴 패널로 묶는다.
          backdrop-blur로 뒤의 화상/잔여 Jitsi 워터마크를 흐리게 덮고, 워터마크 링크 클릭도 막는다. */}
      <div
        data-watermark-cover
        className="absolute left-0 top-0 z-[5] flex flex-col gap-1.5 overflow-hidden rounded-br-3xl bg-black/35 p-3 backdrop-blur-md"
      >
        <div className="flex h-8 items-center pl-1">
          <LetsCareerLogo className="h-5 w-auto" />
        </div>
        {topLeftSlot}
      </div>
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
        onApiReady={(api) => {
          // "일정 시간 후 모달이 저절로 닫힘" 추적용 — readyToClose 를 유발할 수 있는
          // 종료/실패 계열 이벤트와 사유 payload 를 콘솔에 남긴다. (hangup 인지,
          // 서버 연결 끊김인지, 강퇴인지 재현 시점 콘솔로 구분)
          const diagnosticEvents = [
            'videoConferenceLeft',
            'connectionFailed',
            'errorOccurred',
            'participantKickedOut',
            'suspendDetected',
          ];
          for (const event of diagnosticEvents) {
            api.addListener(event, (payload: unknown) => {
              // eslint-disable-next-line no-console
              console.warn(`[JitsiEmbed] ${event}`, payload);
            });
          }
        }}
        getIFrameRef={(node) => {
          node.style.height = '100%';
          node.style.width = '100%';
          node.style.border = '0';
        }}
      />
    </div>
  );
}
