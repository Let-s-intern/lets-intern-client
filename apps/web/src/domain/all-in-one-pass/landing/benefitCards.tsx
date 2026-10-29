import clsx from 'clsx';
import type { BenefitDetailCard } from './benefitDetail';
import type { LandingVod } from './landingContent';

export const CARD_CLASS =
  'rounded-[22px] flex flex-col bg-white p-5 border border-neutral-80 transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]';

/** 빈 탭·로딩 공통 안내 문구 */
export function TabPlaceholder({
  children = '콘텐츠를 준비하고 있어요.',
}: {
  children?: string;
}) {
  return (
    <p className="text-xsmall14 text-neutral-40 py-16 text-center">
      {children}
    </p>
  );
}

/** 콘텐츠 카드(챌린지·가이드북·라이브) — href 있으면 새 탭 링크, 없으면 비클릭. */
export function BenefitCard({
  card,
  className,
}: {
  card: BenefitDetailCard;
  className?: string;
}) {
  const inner = (
    <>
      {card.thumbnail ? (
        <img
          alt=""
          className="w-full rounded-lg"
          loading="lazy"
          src={card.thumbnail}
        />
      ) : (
        <div className="bg-neutral-95 aspect-[4/3] w-full rounded-lg" />
      )}
      <div className="flex flex-1 flex-col justify-between gap-7 pt-7">
        <strong className="text-small18 text-neutral-0 font-bold">
          {card.title}
        </strong>
        {card.href && card.ctaLabel && (
          <span className="text-primary text-xsmall14 self-end font-medium">
            {card.ctaLabel} →
          </span>
        )}
      </div>
    </>
  );

  return card.href ? (
    <a
      className={clsx(CARD_CLASS, className)}
      href={card.href}
      rel="noreferrer"
      target="_blank"
    >
      {inner}
    </a>
  ) : (
    <div className={clsx(CARD_CLASS, 'cursor-default', className)}>{inner}</div>
  );
}

/** VOD 카드 — 썸네일+제목+설명(길면 말줄임). url 이 없어 비클릭. */
export function VodCard({ vod }: { vod: LandingVod }) {
  return (
    <div className={CARD_CLASS}>
      {vod.thumbnail ? (
        <img
          alt=""
          className="w-full rounded-lg"
          loading="lazy"
          src={vod.thumbnail}
        />
      ) : (
        <div className="bg-neutral-95 aspect-video w-full rounded-lg" />
      )}
      <strong className="text-small18 text-neutral-0 mt-4 line-clamp-2 font-bold">
        {vod.title}
      </strong>
      <p className="text-xsmall14 text-neutral-40 mt-2 line-clamp-3">
        {vod.description}
      </p>
    </div>
  );
}
