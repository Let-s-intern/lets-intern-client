'use client';

import { useReadingProgress } from '@letscareer/hooks';
import { Popup } from '@letscareer/ui';
import Image from 'next/image';
import Link from 'next/link';
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
  const { baseImage, baseWidth, baseHeight, alt, link, triggerRatio } =
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
        {/* 크리에이티브: 완성 카드 이미지(푯말·CTA baked-in, 애니메이션 없음) + CTA 투명 링크 */}
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

          {/* CTA pill 영역만 투명 링크 (전체 클릭 아님).
              위치/크기는 scrollPopup.data.ts의 cta(pc/mobile)로 조정 */}
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

/** CTA 위치/크기 (%) — scrollPopup.data.ts의 cta.pc / cta.mobile 형태 */
type CtaPos = {
  bottomPct: number;
  leftPct: number;
  rightPct: number;
  heightPct: number;
};

/**
 * CTA pill 영역에 겹치는 투명 링크. 링크가 비어 있으면 렌더하지 않는다(클릭 무효).
 * 위치/크기는 데이터(cta)의 pc/모바일 값으로 분리 조정하며, 반응형으로 둘 중 하나만 노출한다.
 */
function CtaLink({
  link,
  ariaLabel,
}: {
  link: string;
  ariaLabel: string;
}): ReactNode {
  if (!link) return null;

  const { pc, mobile } = blogScrollPopupData.cta;

  return (
    <>
      {/* 데스크톱 위치 */}
      <CtaAnchor
        link={link}
        ariaLabel={ariaLabel}
        pos={pc}
        visibility="hidden md:block"
      />
      {/* 모바일 위치 */}
      <CtaAnchor
        link={link}
        ariaLabel={ariaLabel}
        pos={mobile}
        visibility="block md:hidden"
      />
    </>
  );
}

/**
 * 단일 투명 앵커. inline style(%)로 위치하며, 외부 링크(`http`)는 새 탭으로,
 * 내부 경로는 `next/link`로 이동한다. `visibility`로 pc/모바일 노출을 제어한다.
 */
function CtaAnchor({
  link,
  ariaLabel,
  pos,
  visibility,
}: {
  link: string;
  ariaLabel: string;
  pos: CtaPos;
  visibility: string;
}): ReactNode {
  const className = `absolute ${visibility}`;
  const style = {
    bottom: `${pos.bottomPct}%`,
    left: `${pos.leftPct}%`,
    right: `${pos.rightPct}%`,
    height: `${pos.heightPct}%`,
  };

  if (link.startsWith('http')) {
    return (
      <a
        href={link}
        aria-label={ariaLabel}
        target="_blank"
        rel="noopener noreferrer"
        style={style}
        className={className}
      />
    );
  }

  return (
    <Link
      href={link}
      aria-label={ariaLabel}
      style={style}
      className={className}
    />
  );
}
