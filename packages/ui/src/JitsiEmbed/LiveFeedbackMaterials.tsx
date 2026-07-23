'use client';

import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

import { isAllowedNotionUrl, toNotionEmbedUrl } from './notion';

/**
 * 라이브 피드백 자료 패널 — 사전질문 · 제출물을 여는 좌하단 플로팅 버튼/패널.
 *
 * 멘토 앱·알림톡 링크·챌린지 피드백 입장 모달 공통 UI(3곳 중복 → 승격).
 * JitsiEmbed 위(모달 좌하단, 뷰포트 고정)에 얹혀 화상을 가리지 않는다.
 * 동작(패널 토글·노션 임베드)은 고정이고 **문구만 `viewer` 로 분기**한다.
 *
 * - MENTEE: "나의 사전 QA" / "나의 제출물"
 * - MENTOR: "사전 QA" / "멘티 제출물"("{menteeName} 님의 제출물")
 *
 * 데이터(preQuestion/submissionUrl)가 없으면 아무것도 렌더하지 않는다.
 */
export interface LiveFeedbackMaterialsProps {
  /** 보는 사람 관점 — 버튼/제목 문구 분기용. */
  viewer: 'MENTOR' | 'MENTEE';
  /** 멘토 관점 제출물 제목("{menteeName} 님의 제출물")용. */
  menteeName?: string;
  /** 멘티 사전 질문 — 있으면 사전 QA 버튼/패널 노출. */
  preQuestion?: string;
  /** 멘티 제출물 URL — 있으면 제출물 버튼/패널 노출. */
  submissionUrl?: string;
}

type MaterialPanel = 'qna' | 'submission';

/** X-Frame-Options 차단 시 load 이벤트가 오지 않으므로 타임아웃으로 판별 */
const EMBED_LOAD_TIMEOUT_MS = 4000;
/** 노션 임베드 상단 툴바(검색/공유/제작 배지) 높이 — 상단 크롭으로 숨김 */
const NOTION_TOOLBAR_PX = 46;

/** 반투명 플로팅 버튼(아이콘 + 글자) — 자료 토글용. */
const SemiFab = ({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={clsx(
      'flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition',
      active ? 'bg-[#4d55f5]/90' : 'bg-black/55 hover:bg-black/70',
    )}
  >
    {children}
    <span>{label}</span>
  </button>
);

/** 화상 위에 뜨는 자료 패널. */
const FloatingPanel = ({
  title,
  onClose,
  className,
  children,
}: {
  title: string;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={clsx(
      'flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl',
      className,
    )}
  >
    <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-4 py-2.5">
      <span className="text-sm font-semibold text-neutral-800">{title}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label={`${title} 닫기`}
        className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6 6L18 18M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
    <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
  </div>
);

const QnaIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M5 5.5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 3.5V6.5a1 1 0 0 1 1-1Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M9.2 9.4a2.8 2.8 0 0 1 5.4 1c0 1.6-2.3 2-2.3 3.2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle
      cx="12.1"
      cy="15.6"
      r="0.5"
      fill="currentColor"
      stroke="currentColor"
    />
  </svg>
);

const DocIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M7 3.5h7L18.5 8v11.5a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path
      d="M13.5 3.5V8H18M9 12h6M9 15h6"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type EmbedStatus = 'loading' | 'loaded' | 'blocked';

/**
 * 노션 제출물 임베드 — X-Frame 차단 시 타임아웃 내 로드 실패로 판별해 "새 탭" 폴백.
 * 상단 툴바는 크롭으로 숨기고 scale 로 축소 임베드한다.
 */
const NotionSubmissionEmbed = ({
  link,
  title,
  scale = 0.7,
}: {
  link: string;
  title?: string;
  scale?: number;
}) => {
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
        title={title ?? '제출물'}
        onLoad={() => setStatus('loaded')}
        className={clsx(
          'absolute left-0 border-0',
          status === 'loading' && 'invisible',
        )}
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

export function LiveFeedbackMaterials({
  viewer,
  menteeName,
  preQuestion,
  submissionUrl,
}: LiveFeedbackMaterialsProps) {
  const [openPanel, setOpenPanel] = useState<MaterialPanel | null>(null);

  const hasPreQuestion = !!preQuestion && preQuestion.trim().length > 0;
  const hasSubmission = !!submissionUrl;
  const isNotionSubmission = hasSubmission && isAllowedNotionUrl(submissionUrl);

  const isMentee = viewer === 'MENTEE';
  // 문구만 viewer 로 분기 (동작·디자인은 동일).
  const qnaLabel = isMentee ? '나의 사전 QA' : '사전 QA';
  const qnaTitle = isMentee ? '나의 사전 Q&A' : '사전 Q&A';
  const submissionLabel = isMentee ? '나의 제출물' : '멘티 제출물';
  const submissionTitle = isMentee
    ? '나의 제출물'
    : `${menteeName ?? '멘티'} 님의 제출물`;

  const toggle = (panel: MaterialPanel) =>
    setOpenPanel((prev) => (prev === panel ? null : panel));

  if (!hasPreQuestion && !hasSubmission) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[60] hidden flex-col items-start gap-3 md:flex">
      {openPanel === 'qna' && hasPreQuestion && (
        <FloatingPanel
          title={qnaTitle}
          onClose={() => setOpenPanel(null)}
          className="max-h-[60vh] w-[340px] max-w-[80vw]"
        >
          <p className="whitespace-pre-wrap px-4 py-3 text-sm leading-6 text-neutral-700">
            {preQuestion}
          </p>
        </FloatingPanel>
      )}

      {openPanel === 'submission' && hasSubmission && (
        <FloatingPanel
          title={submissionTitle}
          onClose={() => setOpenPanel(null)}
          className="h-[70vh] w-[400px] max-w-[80vw]"
        >
          {isNotionSubmission ? (
            <NotionSubmissionEmbed
              link={submissionUrl!}
              title={submissionTitle}
            />
          ) : (
            <div className="p-4">
              <a
                href={submissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                새 탭에서 열기
              </a>
            </div>
          )}
        </FloatingPanel>
      )}

      <div className="flex flex-col gap-2.5">
        {hasPreQuestion && (
          <SemiFab
            label={qnaLabel}
            active={openPanel === 'qna'}
            onClick={() => toggle('qna')}
          >
            <QnaIcon />
          </SemiFab>
        )}
        {hasSubmission && (
          <SemiFab
            label={submissionLabel}
            active={openPanel === 'submission'}
            onClick={() => toggle('submission')}
          >
            <DocIcon />
          </SemiFab>
        )}
      </div>
    </div>
  );
}

export default LiveFeedbackMaterials;
