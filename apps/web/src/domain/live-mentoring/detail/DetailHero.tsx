import Link from 'next/link';

import type {
  LiveMentorDetail,
  LiveMentoringDuration,
} from '@/api/live-mentoring/liveMentoringSchema';
import {
  durationLabel,
  formatPrice,
  LIST_PRICE_BY_DURATION,
} from '../constants';
import { LM_HERO_ID } from './DetailNavigation';

interface DetailHeroProps {
  detail: LiveMentorDetail;
  /** 진행 기간 표시 문자열. */
  period: string;
  /** 신청 시트가 들고 있는 선택 플랜. 히어로와 시트가 같은 값을 본다. */
  selectedDuration: LiveMentoringDuration | null;
  /** 플랜 선택 — 시트의 플랜 선택과 같은 핸들러다. */
  onSelectPlan: (duration: LiveMentoringDuration) => void;
}

/**
 * 멘토 프로필로 가는 입구. 화면 폭에 따라 놓는 자리만 다르고 모양은 같다.
 *
 * 어두운 배경에 녹아드는 반투명 카드로 둔다. 원색 버튼은 아래 구매 카드보다 먼저 눈에
 * 걸려 주인공이 바뀐다.
 *
 * 움직임은 두 겹이라 요소를 나눈다. 한 요소에 animation 을 둘 주면 하나만 남는다.
 * - Link: 들어올 때 한 번 떠오른다(fade-in-up, 공유 preset)
 * - 안쪽: 몇 초에 한 번 화살표 방향으로 톡톡 민다(`mentor-profile-nudge`, index.css).
 *   마우스를 올리면 흔들림을 끄고 화살표만 밀린다
 */
const MentorProfileLink = ({
  mentorId,
  className,
}: {
  mentorId: number;
  className: string;
}) => (
  <Link
    href={`/mentors/${mentorId}`}
    className={`motion-safe:animate-fade-in-up group shrink-0 ${className}`}
  >
    <span className="mentor-profile-nudge flex flex-col gap-0.5 rounded-md border border-white/20 bg-white/5 px-4 py-3 transition-colors group-hover:border-white/40 group-hover:bg-white/10">
      <span className="text-xxsmall12 md:text-xsmall14 text-white/70">
        이 멘토님, 어떤 분인지 궁금하다면?
      </span>
      <span className="text-xsmall14 md:text-xsmall16 flex items-center gap-1 font-semibold">
        프로필 구경하러 가기
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 3l5 5-5 5" />
        </svg>
      </span>
    </span>
  </Link>
);

/**
 * 상세 페이지 최상단 히어로 (시안 0).
 *
 * 어두운 배경 위에 상품명·소개 불릿·평점/후기/멘티 수를 얹고, 왼쪽에 멘토 프로필을
 * 둥근 정사각형으로 둔다. 아래로 진행 기간 바와 플랜 선택 카드가 흰 카드로 놓인다.
 *
 * 플랜 카드는 신청 시트와 **같은 상태**를 만진다. 여기서 고르고 하단 CTA 를 누르면
 * 시트가 그 플랜이 선택된 채 열리고, 시트에서 바꾸면 여기 표시도 따라 바뀐다.
 * 선택은 한 벌뿐이라 어느 쪽이 맞는지 물을 일이 없다.
 */
const DetailHero = ({
  detail,
  period,
  selectedDuration,
  onSelectPlan,
}: DetailHeroProps) => {
  const { profile, durationPrices, price } = detail;
  // 대표 표시는 최저가 기준 — 목록 카드와 같은 규칙이다.
  const cheapest = durationPrices.reduce(
    (min, option) => (option.price < min.price ? option : min),
    durationPrices[0],
  );
  // 개설이 없으면 가격이 null 이다(승인 전 미리보기). 할인 계산도 생략한다.
  const listPrice = LIST_PRICE_BY_DURATION[cheapest?.duration] ?? price;
  const discountRate =
    price !== null && listPrice !== null && listPrice > price
      ? Math.round((1 - price / listPrice) * 100)
      : 0;

  return (
    <section
      id={LM_HERO_ID}
      className="bg-neutral-0 text-static-100 relative overflow-hidden"
    >
      <div className="mw-1180 relative flex flex-col gap-8 px-5 py-12 md:py-16">
        {/*
          히어로는 소개 묶음과 구매 카드 두 덩어리로만 나눈다. 예전에는 배지·제목·불릿·후기·
          진행 기간·플랜이 모두 같은 간격으로 늘어서 잘게 흩어져 보였다.

          멘토 사진은 소개 묶음 왼쪽에 작게 둔다. 큰 사진을 옆 칸에 세우면 사진 한 장이
          히어로 무게를 다 가져가고, 배경으로 깔면 구매 카드가 사진을 덮는다.
        */}
        <div className="flex items-start gap-6">
          {/*
            정사각형에 모서리만 둥글린다. 라운드는 바로 아래 구매 카드와 같은 값이라 두 덩어리가
            한 벌로 보인다. 작아서 모바일에서도 제목 옆에 함께 둔다.
            얼굴이 위쪽에 있는 사진이 많아 위 기준으로 자른다.
          */}
          {profile.profileImage && (
            <img
              src={profile.profileImage}
              alt={profile.nickname ?? '멘토 프로필'}
              className="bg-neutral-90 h-24 w-24 shrink-0 rounded-md object-cover object-top md:h-40 md:w-40 lg:h-52 lg:w-52"
            />
          )}

          {/*
            칸을 사진 높이까지 늘리고 후기 줄만 바닥에 붙인다. 배지·제목·불릿은 사진 윗선,
            후기는 사진 아랫선에 맞는다. 글이 사진보다 길면(모바일) 남는 공간이 없어 그대로 이어진다.
          */}
          <div className="flex min-w-0 flex-1 flex-col gap-3 self-stretch">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-xxsmall12 rounded-sm px-2 py-1 font-bold">
                BEST
              </span>
              <span className="bg-primary-20 text-primary-dark text-xxsmall12 rounded-sm px-2 py-1 font-semibold">
                선착순 마감
              </span>
            </div>

            <h1 className="text-medium24 md:text-xlarge30 max-w-[640px] font-bold leading-snug">
              {detail.title}
            </h1>

            <ul className="flex flex-col gap-1.5">
              {detail.template.hero.bullets.map((bullet, i) => (
                <li
                  key={i}
                  /* 멘토 설정의 미리보기가 편집 중인 줄로 따라올 때 쓴다(LC-3268). */
                  data-preview-item={i}
                  className="text-xsmall14 md:text-xsmall16 whitespace-pre-line text-white/85"
                >
                  - {bullet}
                </li>
              ))}
            </ul>

            <div className="text-xsmall14 md:text-xsmall16 mt-auto flex flex-wrap items-center gap-x-5 gap-y-2">
              {/*
                후기가 없으면 별점을 아예 빼고 "후기 0건"만 남긴다.
                서버는 평점을 null 로 줄 때도, 0.0 으로 줄 때도 있어 둘 다 걸러낸다 —
                ★★★★★ 옆의 (0.0) 은 "최악의 평점"으로 읽힌다.
              */}
              {detail.rating !== null && detail.reviewCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <span className="text-[#FFB800]" aria-hidden="true">
                    ★★★★★
                  </span>
                  <span className="font-semibold">
                    ({detail.rating.toFixed(1)})
                  </span>
                </span>
              )}
              <span>후기 {detail.reviewCount}건</span>
            </div>
          </div>

          {/* 데스크톱은 오른쪽 위가 비어 있어 그 자리에 둔다. */}
          <MentorProfileLink
            mentorId={detail.mentorId}
            className="hidden md:block"
          />
        </div>

        {/* 모바일은 제목 칸이 좁아 구매 카드 바로 위에 둔다. */}
        <MentorProfileLink mentorId={detail.mentorId} className="md:hidden" />

        {/*
            구매 카드 — 진행 기간을 카드 머리 행으로 넣고 구분선으로 나눈다.
            라이브 클래스 상세(`LiveBasicInfo`)의 가격 카드와 같은 구성이다.
            플랜은 고른 값이 그대로 신청 시트로 이어진다.
          */}
        <div className="bg-neutral-95 text-neutral-0 flex flex-col gap-4 rounded-md px-6 py-5">
          <div className="border-neutral-80 flex flex-col gap-1 border-b pb-4 md:flex-row md:items-center md:justify-between">
            <span className="text-xsmall14 md:text-xsmall16 flex items-center gap-2 font-semibold">
              <span aria-hidden="true">📢</span> 진행 기간
            </span>
            <span className="text-xsmall14 text-neutral-30">{period}</span>
          </div>

          <p className="text-xsmall16 font-bold">{detail.title}</p>

          <div className="flex flex-col gap-0.5">
            {discountRate > 0 && (
              <span className="text-neutral-45 text-xsmall14 whitespace-nowrap line-through">
                {formatPrice(listPrice as number)}
              </span>
            )}
            <span className="text-medium22 flex flex-wrap items-baseline gap-2 whitespace-nowrap font-bold">
              {discountRate > 0 && (
                <span className="text-system-error">{discountRate}%</span>
              )}
              {price === null ? '가격 준비 중' : formatPrice(price)}
            </span>
          </div>

          <ul className="flex flex-col gap-3">
            {durationPrices.map((option) => {
              const optionList =
                LIST_PRICE_BY_DURATION[option.duration] ?? option.price;
              return (
                <li
                  key={option.duration}
                  className="text-xsmall14 flex flex-wrap items-center justify-between gap-x-3 gap-y-1"
                >
                  <label className="flex min-w-0 cursor-pointer items-center gap-2">
                    {/*
                        name 을 시트의 라디오와 다르게 둔다. 같은 name 이면 둘이 하나의
                        네이티브 라디오 그룹으로 묶여 시트에서 고르는 순간 여기가 풀린다.
                      */}
                    <input
                      type="radio"
                      name="live-mentoring-hero-plan"
                      checked={selectedDuration === option.duration}
                      onChange={() => onSelectPlan(option.duration)}
                      aria-label={`[LIVE] 1:1 멘토링 (${durationLabel(option.duration)})`}
                      className="accent-primary h-4 w-4"
                    />
                    [LIVE] 1:1 멘토링 ({durationLabel(option.duration)})
                  </label>
                  <span className="text-neutral-45 ml-auto flex shrink-0 items-center gap-2 whitespace-nowrap">
                    <span className="line-through">
                      {formatPrice(optionList)}
                    </span>
                    <span className="text-neutral-0 font-bold">
                      {formatPrice(option.price)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DetailHero;
