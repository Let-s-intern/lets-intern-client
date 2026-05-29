'use client';

import { useReadingProgress } from '@letscareer/hooks';
import { Popup } from '@letscareer/ui';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { blogScrollPopupData } from './data/scrollPopup.data';
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
    triggerRatio,
    borderRadiusPx,
  } = blogScrollPopupData;

  const [open, setOpen] = useState(false);
  // 한 글 보기 안에서는 1회만. (글 이동 시 pathname 변경으로 리셋 → 매 방문 재노출)
  const triggeredRef = useRef(false);

  // 클라이언트 사이드 네비게이션(글→글 이동) 시 컴포넌트가 재사용되어 triggeredRef가
  // 유지되는 문제 방지: 경로가 바뀌면 트리거/열림 상태를 리셋해 새 글에서 다시 노출되게 한다.
  const pathname = usePathname();
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
    if (progress < triggerRatio) return;

    // 진행률 도달 후 1회만 게이트 검사 (통과/차단 무관하게 더는 재시도하지 않음)
    triggeredRef.current = true;

    if (!canShowPopup()) return;

    setOpen(true);
  }, [progress, triggerRatio]);

  const handleHideForDay = () => {
    hidePopupForDay();
    setOpen(false);
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
          <PopupLink link={link} ariaLabel={alt} />
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
            onClick={() => setOpen(false)}
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
 */
function PopupLink({
  link,
  ariaLabel,
}: {
  link: string;
  ariaLabel: string;
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
      />
    );
  }

  return <Link href={link} aria-label={ariaLabel} className={className} />;
}
