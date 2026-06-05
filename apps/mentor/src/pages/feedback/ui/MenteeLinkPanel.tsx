'use client';

import { useEffect, useRef, useState } from 'react';

import { toNotionEmbedUrl } from '../utils/notion';

interface MenteeLinkPanelProps {
  onClose: () => void;
  link: string;
  menteeName?: string;
}

/** X-Frame-Options 차단 시 load 이벤트가 오지 않으므로 타임아웃으로 판별 */
const EMBED_LOAD_TIMEOUT_MS = 4000;

/**
 * 노션은 UA 기반이라 iframe에서 모바일 레이아웃을 강제할 수 없다.
 * 대신 iframe을 가상으로 넓게 렌더한 뒤 scale로 축소해
 * 폰트가 작아진 모바일 임베딩처럼 보이게 한다.
 */
const EMBED_SCALE = 0.67;
/** 노션 임베드 자체 툴바(검색/공유/제작 배지) 높이 — 상단 크롭으로 숨김 */
const NOTION_TOOLBAR_PX = 46;

type EmbedStatus = 'loading' | 'loaded' | 'blocked';

/**
 * 피드백 모달 왼쪽 영역에 노션 제출물 임베드를 시도하는 패널.
 * 에디터를 보면서 타이핑할 수 있도록 멘티 목록 자리에 띄운다.
 *
 * 노션은 X-Frame-Options/frame-ancestors로 외부 임베드를 차단하는 경우가
 * 대부분이므로, 타임아웃 내 로드되지 않으면 "차단됨" 안내로 전환한다.
 */
const MenteeLinkPanel = ({
  onClose,
  link,
  menteeName,
}: MenteeLinkPanelProps) => {
  // notion.site → 공식 임베드 경로(/ebd/)로 변환, 변환 불가 시 원본으로 시도
  const embedUrl = toNotionEmbedUrl(link) ?? link;

  const [status, setStatus] = useState<EmbedStatus>('loading');
  const statusRef = useRef(status);
  statusRef.current = status;

  useEffect(() => {
    setStatus('loading');
    const timer = setTimeout(() => {
      if (statusRef.current === 'loading') setStatus('blocked');
    }, EMBED_LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [link]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-gray-200">
      <div className="flex shrink-0 items-center justify-between gap-1 border-b border-gray-200 px-3 py-2.5">
        <h4 className="truncate text-sm font-semibold text-neutral-900">
          {menteeName ? `${menteeName} 님의 ` : ''}제출물
        </h4>
        <div className="flex shrink-0 items-center gap-1">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            title="새 탭에서 열기"
            aria-label="제출물 새 탭에서 열기"
            className="flex h-6 w-6 items-center justify-center rounded text-neutral-500 hover:bg-neutral-100"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 3.5H3.5V12.5H12.5V10M9.5 3.5H12.5V6.5M12.5 3.5L7 9"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="제출물 패널 닫기"
            className="flex h-6 w-6 items-center justify-center rounded text-neutral-500 hover:bg-neutral-100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {status === 'blocked' ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 bg-[#f7f8fa] p-6 text-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect
              x="5"
              y="10"
              width="14"
              height="10"
              rx="2"
              stroke="#9CA3AF"
              strokeWidth="1.5"
            />
            <path
              d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10"
              stroke="#9CA3AF"
              strokeWidth="1.5"
            />
          </svg>
          <p className="text-sm font-semibold text-neutral-700">차단됨</p>
          <p className="text-xs leading-5 text-neutral-500">
            노션 정책상 페이지를 모달 안에
            <br />
            임베드할 수 없습니다.
          </p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
          >
            새 탭에서 열기
          </a>
        </div>
      ) : (
        <div className="relative min-h-0 flex-1 overflow-hidden">
          {status === 'loading' && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#f7f8fa] text-xs text-neutral-400">
              제출물을 불러오는 중입니다...
            </div>
          )}
          {/* sandbox 미적용: 쿠키 제한 시 노션이 리디렉션 루프에 빠짐. 노션 도메인 한정 임베드라 위험도 낮음 */}
          <iframe
            key={embedUrl}
            src={embedUrl}
            title={`${menteeName ?? '멘티'} 제출물`}
            onLoad={() => setStatus('loaded')}
            className={`absolute left-0 border-0 ${
              status === 'loading' ? 'invisible' : ''
            }`}
            style={{
              width: `${100 / EMBED_SCALE}%`,
              height: `calc(${100 / EMBED_SCALE}% + ${NOTION_TOOLBAR_PX}px)`,
              top: `-${Math.round(NOTION_TOOLBAR_PX * EMBED_SCALE)}px`,
              transform: `scale(${EMBED_SCALE})`,
              transformOrigin: 'top left',
            }}
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};

export default MenteeLinkPanel;
