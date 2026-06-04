'use client';

import { Popup } from '@letscareer/ui';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import posthog from 'posthog-js';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import useReadingProgress from '../hooks/useReadingProgress';
import { blogScrollPopupData } from './data/scrollPopup.data';
import {
  BLOG_POPUP_EVENTS,
  BLOG_POPUP_FLAG_KEY,
  captureExperimentEvent,
  DISMISS_REASON,
  DismissReason,
  parseBlogId,
  parseTriggerRatio,
} from './experiment';
import { canShowPopup, hidePopupForDay } from './popupGate';

// 진행률 측정 대상 본문 요소 id (page.tsx의 <article>에 부여)
const ARTICLE_BODY_ID = 'blog-article-body';

/**
 * 블로그 글 본문을 60%(triggerRatio) 읽은 시점에 1회 노출되는 뉴스레터 스크롤 팝업.
 *
 * 노출 정책:
 * - 본문 읽기 진행률이 `triggerRatio` 이상 + 게이트(canShowPopup) 통과 시 open.
 * - **매 방문마다** 노출(이 페이지 보기 안에서는 `triggeredRef`로 1회만).
 * - "하루 동안 보지 않기"는 `BLOG_POPUP_HIDE_UNTIL`(localStorage)로 24시간 노출을 차단한다.
 *
 * 자기완결(props 없음). 헤드리스 `Popup`(Radix Dialog) 위에 크리에이티브를 얹는다.
 */
export function BlogNewsletterPopup() {
  const {
    baseImage,
    baseWidth,
    baseHeight,
    alt,
    link,
    triggerRatio: fallbackTriggerRatio,
    borderRadiusPx,
  } = blogScrollPopupData;

  const [open, setOpen] = useState(false);
  // 한 글 보기 안에서는 1회만. (글 이동 시 pathname 변경으로 리셋 → 매 방문 재노출)
  const triggeredRef = useRef(false);

  const pathname = usePathname();
  const blogId = parseBlogId(pathname);

  // 실험 변형/임계값. 페이지 진입 시 플래그를 평가해 모든 방문자의 노출을 기록한다(아래 useEffect).
  // 플래그 미로딩/실패/SDK 미초기화 시 control(null)·데이터 파일 폴백 ratio(0.6)로 현행 동작 유지.
  const [variant, setVariant] = useState<string | null>(null);
  const [triggerRatio, setTriggerRatio] =
    useState<number>(fallbackTriggerRatio);

  // 노출(exposure) 기록은 "팝업이 뜨는 시점"이 아니라 "페이지 진입 시점"에 발생해야 한다.
  // 100% 변형은 끝까지 읽은 사람만 팝업이 뜨므로, 노출을 팝업 시점에 잡으면 분모(방문자 수)가
  // 편향돼 "방문자당 전환수" 비교가 무너진다. getFeatureFlag 호출이 $feature_flag_called를
  // 발화해 모든 방문자를 실험 분모로 등록한다.
  //
  // 피처 플래그는 비동기로 로드된다. 진입 즉시 평가하면 아직 미로딩이라 폴백만 잡히므로,
  // onFeatureFlags로 로드 완료 시점을 구독해 변형/임계값을 갱신(리렌더)한다.
  useEffect(() => {
    if (!posthog.__loaded) {
      // SDK 미초기화(env 미설정/프리뷰): 폴백값으로 현행 동작만 유지.
      setVariant(null);
      setTriggerRatio(fallbackTriggerRatio);
      return;
    }

    const evaluate = () => {
      const activeVariant = posthog.getFeatureFlag(BLOG_POPUP_FLAG_KEY);
      setVariant(typeof activeVariant === 'string' ? activeVariant : null);
      setTriggerRatio(
        parseTriggerRatio(posthog.getFeatureFlagPayload(BLOG_POPUP_FLAG_KEY)),
      );
    };

    // 이미 로드됐으면 즉시, 아직이면 onFeatureFlags 콜백에서 평가.
    evaluate();
    const unsubscribe = posthog.onFeatureFlags(evaluate);
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [pathname, fallbackTriggerRatio]);

  // 클라이언트 사이드 네비게이션(글→글 이동) 시 컴포넌트가 재사용되어 triggeredRef가
  // 유지되는 문제 방지: 경로가 바뀌면 트리거/열림 상태를 리셋해 새 글에서 다시 노출되게 한다.
  useEffect(() => {
    triggeredRef.current = false;
    setOpen(false);
  }, [pathname]);

  const getArticleBody = useCallback(
    () => document.getElementById(ARTICLE_BODY_ID),
    [],
  );
  const progress = useReadingProgress(getArticleBody);

  useEffect(() => {
    if (triggeredRef.current) return;
    // 임계값 출처만 플래그 페이로드(ratio)로 교체. 트리거/게이트/쿨다운 로직은 그대로.
    if (progress < triggerRatio) return;

    // 진행률 도달 후 1회만 게이트 검사 (통과/차단 무관하게 더는 재시도하지 않음)
    triggeredRef.current = true;

    if (!canShowPopup()) return;

    setOpen(true);

    // 팝업이 실제로 열린 직후 노출 이벤트(전환율 분자 후보). 노출(exposure) 기록과는 별개.
    captureExperimentEvent(
      BLOG_POPUP_EVENTS.shown,
      { variant: variant, blogId },
      { trigger_ratio: triggerRatio },
    );
  }, [progress, blogId, triggerRatio, variant]);

  const dismiss = (reason: DismissReason) => {
    captureExperimentEvent(
      BLOG_POPUP_EVENTS.dismissed,
      {
        variant: variant,
        blogId,
      },
      { reason },
    );
    setOpen(false);
  };

  const handleHideForDay = () => {
    hidePopupForDay();
    dismiss(DISMISS_REASON.hideDay);
  };

  const handleCtaClick = () => {
    captureExperimentEvent(BLOG_POPUP_EVENTS.ctaClicked, {
      variant: variant,
      blogId,
    });
  };

  return (
    <Popup
      open={open}
      onOpenChange={setOpen}
      title="뉴스레터 구독 안내"
      showCloseButton={false}
      className="w-[90vw] max-w-[400px]"
      // 스크롤로 자동 노출되는 마케팅 팝업이라, 열릴 때 버튼에 자동 포커스(파란 ring)되는 걸 막는다.
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <div
        className="overflow-hidden bg-white"
        style={{ borderRadius: `${borderRadiusPx}px` }}
      >
        {/* 크리에이티브: 완성 카드 이미지(푯말·CTA baked-in, 애니메이션 없음) + 전체 투명 링크 */}
        <div className="relative">
          <Image
            src={baseImage}
            alt=""
            width={baseWidth}
            height={baseHeight}
            sizes="(max-width: 768px) 90vw, 400px"
            className="h-auto w-full"
            priority
          />

          {/* 이미지 전체가 클릭 영역 (CTA pill 한정 아님) */}
          <PopupLink link={link} ariaLabel={alt} onClick={handleCtaClick} />
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
    </Popup>
  );
}

/**
 * 이미지 전체를 덮는 투명 링크(inset-0). 링크가 비어 있으면 렌더하지 않는다(클릭 무효).
 * 외부 링크(`http`)는 새 탭으로, 내부 경로는 `next/link`로 이동한다.
 *
 * `onClick`(전환 capture)은 네비게이션 전에 동기 실행된다.
 * 외부 링크는 새 탭(`target="_blank"`)이라 현재 탭이 유지되어 capture 손실이 없고,
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
