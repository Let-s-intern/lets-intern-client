import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import { blogSidePanelData } from './data/sidePanel.data';
import WobbleSignpost from './WobbleSignpost';

/**
 * 우측 사이드바 뉴스레터 사이드 패널 ("추천 챌린지" 박스 위에 노출).
 *
 * 베이스 이미지(연보라 라운드 박스, 문구·CTA pill baked-in) 위에
 * 우측 푯말(`WobbleSignpost`)을 absolute로 겹쳐 호버 시 흔들리게 한다.
 * 클릭 영역은 PRD §10 기본값에 따라 **CTA pill 영역만** 투명 링크로 처리한다.
 *
 * 구독 링크(`NEWSLETTER_SUBSCRIBE_URL`)가 비어 있는 동안에는 투명 링크 없이 이미지만 노출한다.
 */
export default function BlogNewsletterSidePanel() {
  const {
    baseImage,
    baseWidth,
    baseHeight,
    signpostImage,
    signpostWidth,
    signpostHeight,
    alt,
    link,
    signpost,
    introWobble,
    cta,
  } = blogSidePanelData;

  // 푯말 원본 비율(찌그러짐 방지) — 래퍼가 aspectRatio로 비율을 유지한다.
  const aspectRatio = `${signpostWidth}/${signpostHeight}`;

  return (
    // 모바일에서는 사이드 패널을 숨김(데스크톱 전용 노출)
    <div className="group relative hidden w-full md:block">
      {/* 베이스 이미지 (문구·CTA pill baked-in) */}
      <Image
        src={baseImage}
        alt=""
        width={baseWidth}
        height={baseHeight}
        sizes="(max-width: 768px) 100vw, 328px"
        className="h-auto w-full"
      />

      {/* 푯말(문구 밑·버튼 오른쪽) — 위치/크기는 sidePanel.data.ts의 signpost(pc/mobile)로 조정.
          첫 진입 시 자동 흔들림(autoWobble) + 이후 호버 흔들림. 비율은 aspectRatio로 유지. */}
      <div
        className="absolute hidden md:block" // 데스크톱 위치
        style={{
          width: `${signpost.pc.widthPct}%`,
          left: `${signpost.pc.leftPct}%`,
          top: `${signpost.pc.topPct}%`,
          transform: 'translateX(-50%)',
          aspectRatio,
        }}
      >
        <WobbleSignpost
          src={signpostImage}
          alt=""
          autoWobble
          introCount={introWobble.count}
          introDurationMs={introWobble.durationMs}
        />
      </div>
      <div
        className="absolute block md:hidden" // 모바일 위치
        style={{
          width: `${signpost.mobile.widthPct}%`,
          left: `${signpost.mobile.leftPct}%`,
          top: `${signpost.mobile.topPct}%`,
          transform: 'translateX(-50%)',
          aspectRatio,
        }}
      >
        <WobbleSignpost
          src={signpostImage}
          alt=""
          autoWobble
          introCount={introWobble.count}
          introDurationMs={introWobble.durationMs}
        />
      </div>

      {/* CTA pill 영역만 투명 링크 (전체 클릭 아님).
          위치/크기는 sidePanel.data.ts의 cta(pc/mobile)로 조정 */}
      {link && (
        <>
          <PillLink
            link={link}
            ariaLabel={alt}
            pos={cta.pc}
            visibility="hidden md:block"
          />
          <PillLink
            link={link}
            ariaLabel={alt}
            pos={cta.mobile}
            visibility="block md:hidden"
          />
        </>
      )}
    </div>
  );
}

/** CTA 투명 링크 위치/크기 (%) — sidePanel.data.ts의 cta.pc / cta.mobile */
type CtaPos = {
  bottomPct: number;
  leftPct: number;
  rightPct: number;
  heightPct: number;
};

/**
 * CTA pill 영역에 겹치는 투명 링크. inline style(%)로 위치하며 pc/모바일을 분리한다.
 * 외부 링크(`http`)는 새 탭으로, 내부 경로는 `next/link`로 이동.
 */
function PillLink({
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
        rel="noopener"
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
