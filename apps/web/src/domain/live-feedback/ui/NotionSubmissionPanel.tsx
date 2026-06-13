'use client';

import { useEffect, useRef, useState } from 'react';

import { toNotionEmbedUrl } from '@/common/lexical/utils/notion';

/** X-Frame-Options 차단 시 load 이벤트가 오지 않으므로 타임아웃으로 판별 */
const EMBED_LOAD_TIMEOUT_MS = 4000;
/** 노션 임베드 상단 툴바(검색/공유/제작 배지) 높이 — 상단 크롭으로 숨김 */
const NOTION_TOOLBAR_PX = 46;

type EmbedStatus = 'loading' | 'loaded' | 'blocked';

interface Props {
  link: string;
  menteeName?: string;
  /** 축소 비율(0~1). 기본 0.7 → 70% 축소 임베드(멘토 모달과 동일). */
  scale?: number;
}

/**
 * 노션 제출물 임베드 패널 — 멘토 모달의 제출물 임베드와 동일 동작.
 *
 * 노션은 X-Frame-Options/frame-ancestors 로 외부 임베드를 차단하는 경우가 많아,
 * 타임아웃 내 로드되지 않으면 "차단됨" 안내(새 탭 열기)로 전환한다.
 */
const NotionSubmissionPanel = ({ link, menteeName, scale = 0.7 }: Props) => {
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

  if (status === 'blocked') {
    return (
      <div className="flex h-full min-h-0 flex-1 flex-col items-center justify-center gap-3 bg-[#f7f8fa] p-6 text-center">
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
          className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
        >
          새 탭에서 열기
        </a>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-0 flex-1 overflow-hidden">
      {status === 'loading' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#f7f8fa] text-xs text-neutral-400">
          제출물을 불러오는 중입니다...
        </div>
      )}
      <iframe
        key={embedUrl}
        src={embedUrl}
        title={`${menteeName ?? '멘티'} 제출물`}
        onLoad={() => setStatus('loaded')}
        className={`absolute left-0 border-0 ${
          status === 'loading' ? 'invisible' : ''
        }`}
        style={{
          width: `${100 / scale}%`,
          height: `calc(${100 / scale}% + ${NOTION_TOOLBAR_PX}px)`,
          top: `-${Math.round(NOTION_TOOLBAR_PX * scale)}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
        allowFullScreen
      />
    </div>
  );
};

export default NotionSubmissionPanel;
