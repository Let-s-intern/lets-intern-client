'use client';

interface ZepEmbedProps {
  /** ZEP 스페이스 진입 URL (예: https://zep.us/play/VqJNq6) */
  zepUrl: string;
  /** 입장 코드 — 헤더에 안내 표시 (md+ 화면) */
  entryCode?: string;
  /** 스페이스 이름 — 헤더에 노출 */
  spaceName?: string;
  /** 닫기 버튼 클릭 핸들러 */
  onClose: () => void;
}

/**
 * ZEP 스페이스를 iframe으로 임베드하는 본문 컴포넌트.
 * 모달 셸은 각 앱이 자체 BaseModal 등으로 감싸 사용한다.
 */
export function ZepEmbed({
  zepUrl,
  entryCode,
  spaceName,
  onClose,
}: ZepEmbedProps) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-neutral-200 px-5 py-3">
        <div className="flex min-w-0 flex-col">
          <p className="text-xs font-medium text-neutral-500">
            라이브 피드백 스페이스
          </p>
          <p className="truncate text-sm font-semibold text-neutral-900">
            {spaceName ?? 'ZEP 라이브 피드백'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {entryCode && (
            <div className="hidden items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 py-1.5 text-xs text-neutral-600 md:flex">
              <span className="text-neutral-500">입장 코드</span>
              <span className="font-mono font-semibold text-neutral-900">
                {entryCode}
              </span>
            </div>
          )}
          <a
            href={zepUrl}
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
          src={zepUrl}
          title="ZEP 라이브 피드백 스페이스"
          className="h-full w-full border-0"
          allow="camera; microphone; fullscreen; autoplay; clipboard-read; clipboard-write; display-capture; geolocation"
          allowFullScreen
        />
      </div>
    </div>
  );
}
