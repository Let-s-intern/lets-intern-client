'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import useReadingProgress from '../hooks/useReadingProgress';
import { sendBlogPopupClick, useBlogPopupImpression } from './blogPopupCount';
import {
  BLOG_POPUP_EVENTS,
  captureExperimentEvent,
  DISMISS_REASON,
  DismissReason,
} from './experiment';
import { canShowPopup, hidePopupForDay } from './popupGate';
import { useBlogPopupQuery } from './useBlogPopupQuery';

// 진행률 측정 대상 본문 요소 id (page.tsx의 <article>에 부여)
const ARTICLE_BODY_ID = 'blog-article-body';

/** 서버 `BlogPopup.DEFAULT_TRIGGER_RATIO` 와 같은 값. 비어 오면 끝까지 읽은 시점에 연다. */
const DEFAULT_TRIGGER_RATIO = 1;

// next/image가 초기 공간을 잡는 데만 쓰는 값. 실제 높이는 h-auto라 원본 비율을 따른다.
const IMAGE_BASE_WIDTH = 820;
const IMAGE_BASE_HEIGHT = 947;

/**
 * 어드민이 등록한 블로그 팝업. 본문을 `triggerRatio`만큼 읽은 시점에 1회 노출된다.
 *
 * 이미지·링크·임계값이 모두 서버에서 오므로 크리에이티브를 바꿔도 배포가 필요 없다.
 * 노출할 팝업이 없거나 조회가 실패하면 아무것도 렌더하지 않는다 — 광고라 에러 UI를 띄우지 않는다.
 *
 * `@letscareer/ui`를 쓰지 않고 도메인 안에서 직접 구현한다(`.claude/rules/core.md`).
 */
export function BlogPopup({ blogId }: { blogId: number }) {
  const { data: popup } = useBlogPopupQuery(blogId);

  // 노출은 **조회 성공 시점**에 센다. 팝업이 화면에 뜬 시점이 아니다(PRD 7절).
  useBlogPopupImpression(popup?.blogPopupId);

  const [open, setOpen] = useState(false);
  // 한 팝업에 대해 1회만 트리거한다.
  const triggeredRef = useRef(false);

  const popupId = popup?.blogPopupId;
  const imageUrl = popup?.imageUrl ?? null;
  const triggerRatio = popup?.triggerRatio ?? DEFAULT_TRIGGER_RATIO;

  const getArticleBody = useCallback(
    () => document.getElementById(ARTICLE_BODY_ID),
    [],
  );
  const progress = useReadingProgress(getArticleBody);

  // 글을 이동하면 다른 팝업이 내려온다. 트리거/열림 상태를 리셋해 새 팝업이 다시 뜨게 한다.
  useEffect(() => {
    triggeredRef.current = false;
    setOpen(false);
  }, [popupId]);

  useEffect(() => {
    if (popupId === undefined || !imageUrl) return;
    if (triggeredRef.current) return;
    if (progress < triggerRatio) return;

    // 진행률 도달 후 1회만 게이트 검사 (통과/차단 무관하게 더는 재시도하지 않음)
    triggeredRef.current = true;

    if (!canShowPopup(popupId)) return;

    setOpen(true);

    captureExperimentEvent(
      BLOG_POPUP_EVENTS.shown,
      { blogId: String(blogId), popupId },
      { trigger_ratio: triggerRatio },
    );
  }, [progress, triggerRatio, popupId, imageUrl, blogId]);

  const dismiss = useCallback(
    (reason: DismissReason) => {
      captureExperimentEvent(
        BLOG_POPUP_EVENTS.dismissed,
        { blogId: String(blogId), popupId: popupId ?? null },
        { reason },
      );
      setOpen(false);
    },
    [blogId, popupId],
  );

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss(DISMISS_REASON.close);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, dismiss]);

  if (!open || popupId === undefined || !imageUrl) return null;

  const handleHideForDay = () => {
    hidePopupForDay(popupId);
    dismiss(DISMISS_REASON.hideDay);
  };

  const handleCtaClick = () => {
    // 서버 카운터가 클릭률의 원본이다. 실패는 삼켜지므로 이동을 막지 않는다.
    void sendBlogPopupClick(popupId);
    captureExperimentEvent(BLOG_POPUP_EVENTS.ctaClicked, {
      blogId: String(blogId),
      popupId,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss(DISMISS_REASON.close);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="블로그 팝업"
        className="w-[90vw] max-w-[400px] overflow-hidden rounded-lg bg-white"
      >
        {/* 크리에이티브: 어드민이 올린 이미지 + 전체를 덮는 투명 링크 */}
        <div className="relative">
          {/* 스크롤 도달 후 뜨는 요소라 priority를 주지 않는다(LCP 경로 침범 방지) */}
          <Image
            src={imageUrl}
            alt=""
            width={IMAGE_BASE_WIDTH}
            height={IMAGE_BASE_HEIGHT}
            sizes="(max-width: 768px) 90vw, 400px"
            className="h-auto w-full"
          />

          {/* 이미지 전체가 클릭 영역 (CTA pill 한정 아님) */}
          <PopupLink
            link={popup?.link ?? ''}
            ariaLabel="팝업 자세히 보기"
            onClick={handleCtaClick}
          />
        </div>

        {/* footer 기능 버튼 (이미지 아님) */}
        <div className="text-xsmall14 border-neutral-80 flex items-center border-t">
          <button
            type="button"
            onClick={handleHideForDay}
            className="text-neutral-40 flex-1 py-3.5"
          >
            하루 동안 보지 않기
          </button>
          <button
            type="button"
            onClick={() => dismiss(DISMISS_REASON.close)}
            className="border-neutral-80 text-neutral-0 flex-1 border-l py-3.5 font-semibold"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 이미지 전체를 덮는 투명 링크(inset-0). 링크가 비어 있으면 렌더하지 않는다(클릭 무효).
 * 외부 링크(`http`)는 새 탭으로, 내부 경로는 `next/link`로 이동한다.
 *
 * `onClick`(클릭 수 전송·capture)은 네비게이션 전에 동기 실행된다.
 * 외부 링크는 새 탭(`target="_blank"`)이라 현재 탭이 유지되어 손실이 없고,
 * 내부 링크도 onClick이 next/link 라우팅보다 먼저 호출돼 누락되지 않는다.
 */
function PopupLink({
  link,
  ariaLabel,
  onClick,
}: {
  link: string;
  ariaLabel: string;
  onClick: () => void;
}): ReactNode {
  if (!link) return null;

  const className = 'absolute inset-0';

  if (link.startsWith('http')) {
    return (
      <a
        href={link}
        aria-label={ariaLabel}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      />
    );
  }

  return (
    <Link
      href={link}
      aria-label={ariaLabel}
      className={className}
      onClick={onClick}
    />
  );
}
