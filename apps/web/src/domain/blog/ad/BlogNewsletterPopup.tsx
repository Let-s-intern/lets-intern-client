'use client';

import { useReadingProgress } from '@letscareer/hooks';
import { Popup } from '@letscareer/ui';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { blogScrollPopupData } from './data/scrollPopup.data';
import { canShowPopup, hidePopupForDay, markPopupShown } from './popupGate';
import WobbleSignpost from './WobbleSignpost';

// 진행률 측정 대상 본문 요소 id (page.tsx의 <article>에 부여)
const ARTICLE_BODY_ID = 'blog-article-body';

/**
 * 블로그 글 본문을 60%(triggerRatio) 읽은 시점에 1회 노출되는 뉴스레터 스크롤 팝업.
 *
 * 노출 정책:
 * - 본문 읽기 진행률이 `triggerRatio` 이상 + 게이트(canShowPopup) 통과 시 단 1회 open.
 * - open 되는 순간 `BLOG_POPUP_SHOWN`(sessionStorage)을 기록해 세션 내 재노출을 막는다.
 * - "하루 동안 보지 않기"는 `BLOG_POPUP_HIDE_UNTIL`(localStorage)로 24시간 노출을 차단한다.
 *
 * 자기완결(props 없음). 헤드리스 `Popup`(Radix Dialog) 위에 크리에이티브를 얹는다.
 */
export function BlogNewsletterPopup() {
  const { baseImage, signpostImage, alt, link, triggerRatio } =
    blogScrollPopupData;

  const [open, setOpen] = useState(false);
  // 정책상 단 1회만 열리도록 — 한 번 트리거(노출/게이트 차단)되면 더는 검사하지 않는다.
  const triggeredRef = useRef(false);

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

    markPopupShown();
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
    >
      <div className="overflow-hidden rounded-2xl bg-white">
        {/* 크리에이티브: 베이스 이미지 + 가운데 푯말(호버 흔들림) + CTA 투명 링크 */}
        <div className="group relative">
          <Image
            src={baseImage}
            alt=""
            width={400}
            height={400}
            sizes="(max-width: 768px) 90vw, 400px"
            className="h-auto w-full"
            priority
          />

          {/* 가운데 푯말 — group-hover 흔들림(motion-reduce 대응은 WobbleSignpost 내부) */}
          <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 md:h-32 md:w-32">
            <WobbleSignpost src={signpostImage} alt="" />
          </div>

          {/* CTA pill 영역만 투명 링크 (전체 클릭 아님).
              정확한 px 좌표는 최종 에셋 수령 후 미세조정 */}
          <CtaLink link={link} ariaLabel={alt} />
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
 * CTA pill 영역에 겹치는 투명 링크. 링크가 비어 있으면 렌더하지 않는다(클릭 무효).
 * 외부 링크(`http`)는 새 탭으로, 내부 경로는 `next/link`로 이동.
 */
function CtaLink({
  link,
  ariaLabel,
}: {
  link: string;
  ariaLabel: string;
}): ReactNode {
  if (!link) return null;

  // 베이스 이미지 하단의 CTA pill 위치 (대략값 — 최종 에셋 수령 후 미세조정)
  const className = 'absolute bottom-5 left-6 right-6 h-12';

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
