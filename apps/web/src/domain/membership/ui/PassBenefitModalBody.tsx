'use client';

import {
  getChallengeThumbnailSrc,
  type ChallengeModalItem,
} from '../data/challengeModalItems';
import { guidebookUrl, type GuidebookItem } from '../data/guidebooks';
import { formatKRW } from '../data/membership';
import { MARKETER_VOD, type MarketerVodCard } from '../data/marketerVod';
import { MENTORING_COUPON } from '../data/mentoringCoupon';
import {
  PASS_BENEFIT_SOURCES,
  type PassBenefitId,
} from '../data/passBenefitModals';
import { useChallengeThumbnails } from '../lib/useChallengeThumbnails';
import { useGuidebookThumbnails } from '../lib/useGuidebookThumbnails';

/**
 * 개편 시안 6-1 ~ 6-4 — 혜택 모달의 본문.
 *
 * 네 본문이 한 파일에 있다. 챌린지·가이드북은 같은 카드 그리드고, VOD·멘토링은 서로
 * 다른 모양이라 공통으로 뽑을 것이 없다. 그래도 네 개가 함께 바뀌는 한 덩어리(시안 6)라
 * 붙여 둔다 — 파일 넷으로 쪼개면 시안 하나를 고칠 때 네 곳을 찾아다녀야 한다.
 *
 * 카드 문구는 기존 데이터의 **실제 상품명**을 쓴다. 시안 6-1·6-2 는 썸네일과 제목이
 * 어긋난 칸이 있는데(썸네일 "이력서 완성 가이드북" / 제목 "포트폴리오 2주 완성 챌린지")
 * 그건 시안 쪽 오타다.
 *
 * 이 컴포넌트는 모달이 열려 있을 때만 마운트된다. 썸네일 조회도 그때 시작하므로 랜딩
 * 첫 화면이 조회 10여 건을 끌고 가지 않는다.
 */
export default function PassBenefitModalBody({ id }: { id: PassBenefitId }) {
  if (id === 'challenge') return <ChallengeBody />;
  if (id === 'guidebook') return <GuidebookBody />;
  if (id === 'vod') return <VodBody />;
  return <MentoringBody />;
}

/** 챌린지·가이드북이 함께 쓰는 카드 한 장 */
function ThumbnailCard({
  href,
  label,
  src,
  linkLabel,
  external,
}: {
  href: string;
  label: string;
  src: string;
  linkLabel: string;
  external?: boolean;
}) {
  return (
    <a
      className="rounded-xxl flex flex-col bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)]"
      href={href}
      rel={external ? 'noreferrer' : undefined}
      target={external ? '_blank' : undefined}
    >
      {/*
        object-cover 를 쓰지 않는다. 썸네일에 글자가 들어 있어 비율이 다르면 제목이 잘린다.
      */}
      <img alt="" className="w-full rounded-lg" loading="lazy" src={src} />
      <div className="flex flex-1 flex-col justify-between pt-4">
        <strong className="text-xsmall16 text-neutral-0 font-bold">
          {label}
        </strong>
        {/*
          글자색은 `<a>` 가 아니라 안쪽 span 이 든다. `styles/base.css` 의
          `.membership-root a { color: inherit }` 이 명시도로 Tailwind 유틸을 이긴다.
        */}
        <span className="text-primary text-xsmall14 mt-6 self-end font-medium">
          {linkLabel} →
        </span>
      </div>
    </a>
  );
}

function ChallengeBody() {
  const thumbnails = useChallengeThumbnails();
  const items: readonly ChallengeModalItem[] = PASS_BENEFIT_SOURCES.challenge;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((item) => (
        <ThumbnailCard
          href={item.url}
          key={item.label}
          label={item.label}
          linkLabel="챌린지 자세히 보기"
          src={getChallengeThumbnailSrc(item, thumbnails[item.challengeType])}
        />
      ))}
    </div>
  );
}

function GuidebookBody() {
  const thumbnails = useGuidebookThumbnails();
  const items: readonly GuidebookItem[] = PASS_BENEFIT_SOURCES.guidebook;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((item) => (
        <ThumbnailCard
          external
          href={guidebookUrl(item.id)}
          key={item.label}
          label={item.label}
          linkLabel="가이드북 자세히 보기"
          src={thumbnails[item.id] || `/images/membership/${item.src}`}
        />
      ))}
    </div>
  );
}

function VodBody() {
  const cards: readonly MarketerVodCard[] = PASS_BENEFIT_SOURCES.vod;

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {cards.map((card) => (
          <div
            className="rounded-xxl flex flex-col bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.06)] md:p-6"
            key={card.title}
          >
            {/* 배너 — 제목·배지·연사 소개가 그림 안에 들어 있다. alt 로 문구를 전한다. */}
            <img
              alt={card.bannerAlt}
              className="w-full rounded-lg"
              loading="lazy"
              src={`/images/membership/${card.banner}`}
            />

            <strong className="text-xsmall16 text-neutral-0 mt-6 block font-bold leading-snug">
              {card.title}
            </strong>

            <ul className="mt-4 flex flex-1 flex-col gap-2">
              {card.bullets.map((bullet) => (
                <li className="flex gap-2" key={bullet}>
                  <span aria-hidden="true" className="text-primary shrink-0">
                    ✓
                  </span>
                  <span className="text-xsmall14 text-neutral-40">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>

            <p className="border-neutral-90 text-xsmall14 text-neutral-45 mt-6 border-t pt-5 text-right line-through">
              정가 {formatKRW(card.regularPrice)}원
            </p>

            {/*
              링크 없는 카드는 애초에 목록에서 빠지므로(`PASS_BENEFIT_VOD_CARDS`)
              여기서 주소를 다시 검사하지 않는다.
            */}
            <a
              className="bg-primary mt-3 rounded-lg px-5 py-3 text-center"
              href={card.url}
            >
              <span className="text-xsmall14 font-bold text-white">
                자세히 보기 →
              </span>
            </a>
          </div>
        ))}
      </div>

      <p className="text-xsmall14 text-primary mt-10 text-center font-bold">
        {MARKETER_VOD.footnote}
      </p>
    </>
  );
}

function MentoringBody() {
  return (
    <>
      <div className="rounded-xxl grid overflow-hidden bg-[#232433] md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        {/* 좌측 — 할인율 */}
        <div className="p-8 md:border-r md:border-white/10 md:p-10">
          <span className="inline-block rounded-full bg-[#F1642B] px-3 py-1.5 text-xs font-bold text-white">
            {MENTORING_COUPON.passOnly}
          </span>

          <strong className="mt-8 block text-5xl font-bold text-white md:text-6xl">
            {MENTORING_COUPON.rate}
          </strong>

          <strong className="text-small18 mt-4 block font-bold leading-snug text-white">
            {MENTORING_COUPON.rateTitleLines.map((line) => (
              <span className="block" key={line}>
                {line}
              </span>
            ))}
          </strong>

          <p className="text-xsmall14 text-neutral-70 mt-6 leading-relaxed">
            {MENTORING_COUPON.rateBody.map((line) => (
              <span className="block" key={line}>
                {line}
              </span>
            ))}
          </p>

          <p className="text-neutral-60 mt-6 text-xs">
            {MENTORING_COUPON.rateFine}
          </p>
        </div>

        {/* 우측 — 현직자 예시 */}
        <div className="p-8 md:p-10">
          <div className="flex items-baseline justify-between gap-3">
            <strong className="text-xsmall16 font-bold text-white">
              {MENTORING_COUPON.mentorsTitle}
            </strong>
            <span className="text-neutral-60 text-xs">
              {MENTORING_COUPON.mentorsNote}
            </span>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {MENTORING_COUPON.mentors.map((mentor) => (
              <div
                className="flex items-center gap-3 rounded-lg bg-white/5 p-4"
                key={`${mentor.company}-${mentor.role}`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold text-white ${mentor.color}`}
                >
                  {mentor.short}
                </span>
                <span className="min-w-0">
                  <strong className="text-xsmall14 block font-bold text-white">
                    {mentor.company}
                  </strong>
                  <span className="text-neutral-60 block text-xs">
                    {mentor.role}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-neutral-50">
        {MENTORING_COUPON.footnote}
      </p>
    </>
  );
}
