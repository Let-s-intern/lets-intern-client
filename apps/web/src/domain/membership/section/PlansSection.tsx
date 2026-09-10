'use client';

import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  CalendarDays,
  Flag,
  UserRoundCheck,
  Users,
  Workflow,
} from 'lucide-react';
import dayjs from '../lib/dayjs';
import { formatKRW } from '../data/membership';
import {
  getDiscountRate,
  PLAN_BENEFITS,
  PLAN_NAME,
  type PlanBenefitIcon,
} from '../data/plans';
import { useMembershipChallengeData } from '../lib/useMembershipChallengeData';

const BENEFIT_ICONS: Record<PlanBenefitIcon, typeof Flag> = {
  flag: Flag,
  bookOpen: BookOpen,
  workflow: Workflow,
  users: Users,
  userRoundCheck: UserRoundCheck,
};

// 대상 숫자를 0 → target 으로 카운트업한다. 요소가 60% 보일 때 1회 재생(빠른 스크롤 대응).
// 모션 최소화 환경/관측자 부재 시에는 즉시 최종값으로 둔다.
function useCountUpOnView(target: number, durationMs = 1200) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  // 폴백 가격 → API 가격으로 target 이 바뀔 때 0 부터 다시 세지 않고
  // 직전 target 에서 보간해 깜빡임(점프)을 막는다.
  const prevTargetRef = useRef(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof IntersectionObserver === 'undefined'
    ) {
      setValue(target);
      prevTargetRef.current = target;
      return;
    }
    let raf = 0;
    const startValue = prevTargetRef.current;
    const animate = () => {
      let startTs = 0;
      const tick = (ts: number) => {
        if (!startTs) startTs = ts;
        const p = Math.min((ts - startTs) / durationMs, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setValue(Math.round(startValue + (target - startValue) * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          animate();
          obs.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      prevTargetRef.current = target;
    };
  }, [target, durationMs]);
  return { ref, value };
}

// 단일 올패스 플랜 표시 섹션. 시안 3.png — 흰 카드 안 2열(좌: 포함 혜택 목록, 우: 가격).
// 이용 기한·정가·판매가·할인율은 모두 useMembershipChallengeData() 가 내려준 값에서 만든다.
// 결제는 하단 고정 ApplyBar(openPlanSheet → MembershipPaymentSheet)에 위임한다.
export default function PlansSection() {
  const { endDate, regularPrice, salePrice } = useMembershipChallengeData();
  const discountRate = getDiscountRate(regularPrice, salePrice);
  const { ref: saleRef, value: animatedSale } = useCountUpOnView(
    salePrice,
    700,
  );

  return (
    <section className="plans" id="plans">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">MARKETING ALL-IN-ONE PASS</span>
          {/* 의미가 끊기는 자리에서 자른다 — 601px 이상에서는 한 줄로 붙는다(base.css 의 .brk) */}
          <h2>
            <span className="brk">{PLAN_NAME}</span>
          </h2>
          <p>인턴·신입 마케팅 취준생 전용</p>
        </div>

        <div className="allpass rv">
          <div className="allpass-benefits">
            <span className="allpass-kicker">ALL-IN-ONE PASS</span>
            <ul className="allpass-benefit-list">
              {PLAN_BENEFITS.map((benefit) => {
                const Icon = BENEFIT_ICONS[benefit.icon];
                return (
                  <li className="allpass-benefit" key={benefit.title}>
                    <span className="allpass-benefit-ic" aria-hidden>
                      <Icon size={20} strokeWidth={2} />
                    </span>
                    <span className="allpass-benefit-t">{benefit.title}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="allpass-buy">
            {/* 섹션 헤더가 이미 상품명을 말한다. 시안 15 는 카드 우측에 영문 배지를 둔다. */}
            <h3 className="allpass-name">MARKETING ALL-IN-ONE PASS</h3>
            {/* 이용 기한은 챌린지 endDate 를 포맷해서 쓴다 — 날짜를 코드에 박지 않는다 */}
            <p className="allpass-period">
              <CalendarDays size={17} strokeWidth={2} aria-hidden />
              <span className="num">
                구매 시점부터 {dayjs(endDate).format('M월 D일')}까지 이용
              </span>
            </p>

            <div className="allpass-price">
              {/*
                시안 15 의 가격 카드에는 취소선도 할인 배지도 없다. 어드민에서 할인을
                걸면 그때 보여야 하므로, 값 자체를 지우지 않고 할인이 있을 때만 그린다.
                정가와 판매가가 같은데 "정가 175,900원 / 판매가 175,900원" 이 나란히
                있으면 읽는 사람이 무엇을 비교하라는 것인지 알 수 없다.
              */}
              {discountRate > 0 && (
                <p className="allpass-was">
                  <span className="allpass-was-label">정가</span>
                  <span className="allpass-was-num num">
                    {formatKRW(regularPrice)}원
                  </span>
                </p>
              )}
              <p className="allpass-sale-row">
                {discountRate > 0 && (
                  <span className="allpass-sale-label">판매가</span>
                )}
                {/*
                  할인율은 정가·판매가에서 계산한다. 계산이 성립하지 않는 값
                  (정가 0, 판매가 > 정가)이면 배지 자체를 렌더하지 않는다 —
                  "0% 할인" 이나 음수 할인율이 남는 쪽이 더 나쁘다.
                */}
                {discountRate > 0 && (
                  <span className="allpass-badge num">
                    {discountRate}% 할인
                  </span>
                )}
              </p>
              <p className="allpass-now-line">
                <span className="allpass-now num" ref={saleRef}>
                  {formatKRW(animatedSale)}
                </span>
                <span className="allpass-unit">원</span>
              </p>
            </div>
          </div>
        </div>

        {/*
          VOD 옵션 카드는 시안 15 에 없어 렌더하지 않는다. 카드 안 문구가
          "렛츠커리어 하반기 멤버십 구매자 전용" 이라 이 상품과도 맞지 않는다.
          되살리려면 이 블록과 상단 VodOptionCard import 를 함께 푼다.
        */}
      </div>
    </section>
  );
}
