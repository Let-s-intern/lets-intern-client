'use client';

import { useState } from 'react';

interface JitsiEmbedProps {
  /** 공식(primary) 서버 기준 방 URL — 외부에서 buildJitsiRoomUrl로 생성해 전달 */
  roomUrl: string;
  /** 셀프호스팅(fallback) 서버 기준 방 URL — 외부에서 동일 입력으로 생성 */
  fallbackUrl: string;
  /** 헤더에 노출할 회의실 이름 (선택) */
  spaceName?: string;
  /** 닫기 버튼 클릭 핸들러 */
  onClose: () => void;
}

type ServerKind = 'primary' | 'fallback';

/**
 * Jitsi 회의실을 iframe으로 임베드하는 본문 컴포넌트.
 *
 * - 초기에는 `roomUrl`(공식 서버)을 사용한다.
 * - 헤더의 "다른 서버로 입장" 버튼을 누르면 `fallbackUrl`(셀프호스팅)로 src를 교체한다.
 * - iframe 로드 실패는 자동 감지하지 않는다 (X-Frame-Options 등 케이스 다양 — PRD §6.2).
 * - 모달 셸은 각 앱에서 자체 BaseModal로 감싸 사용한다.
 */
export function JitsiEmbed({
  roomUrl,
  fallbackUrl,
  spaceName,
  onClose,
}: JitsiEmbedProps) {
  const [currentServer, setCurrentServer] = useState<ServerKind>('primary');
  const activeUrl = currentServer === 'primary' ? roomUrl : fallbackUrl;
  const toggleLabel =
    currentServer === 'primary' ? '다른 서버로 입장' : '공식 서버로 입장';

  const handleToggleServer = () => {
    setCurrentServer((prev) => (prev === 'primary' ? 'fallback' : 'primary'));
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-neutral-200 px-5 py-3">
        <div className="flex min-w-0 flex-col">
          <p className="text-xs font-medium text-neutral-500">
            라이브 피드백 회의실
          </p>
          <p className="truncate text-sm font-semibold text-neutral-900">
            {spaceName ?? 'Jitsi 라이브 피드백'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleServer}
            className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
          >
            {toggleLabel}
          </button>
          <a
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
          >
            새 창에서 열기
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
          >
            닫기
          </button>
        </div>
      </header>

      <div className="relative flex-1 bg-neutral-900">
        <iframe
          // key를 src로 묶어 서버 전환 시 iframe 인스턴스가 재생성되도록 한다
          // (단순 src 교체는 일부 브라우저에서 미디어 권한 상태가 꼬일 수 있음)
          key={activeUrl}
          src={activeUrl}
          title="Jitsi 라이브 피드백 회의실"
          className="h-full w-full border-0"
          allow="camera; microphone; fullscreen; autoplay; clipboard-read; clipboard-write; display-capture; geolocation"
          allowFullScreen
        />
      </div>
    </div>
  );
}
