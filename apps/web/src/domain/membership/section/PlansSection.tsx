'use client';

import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  CalendarDays,
  Clock,
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
  PLAN_PRICE_NOTICE,
  type PlanBenefitIcon,
} from '../data/plans';
import { useMembershipChallengeData } from '../lib/useMembershipChallengeData';
import VodOptionCard from '../ui/VodOptionCard';

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
// 이용 기한·정가·특가·할인율은 모두 useMembershipChallengeData() 가 내려준 값에서 만든다.
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
          <span className="eyebrow">가격 플랜</span>
          {/* 의미가 끊기는 자리에서 자른다 — 601px 이상에서는 한 줄로 붙는다(base.css 의 .brk) */}
          <h2>
            <span className="brk">공채 준비에 필요한 것만 모아,</span>
            <span className="brk">부담은 줄였어요</span>
          </h2>
          <p>9월 서류부터 11월 면접까지 필요한 준비를 한 번에 이용하세요</p>
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
            <h3 className="allpass-name">{PLAN_NAME}</h3>
            {/* 이용 기한은 챌린지 endDate 를 포맷해서 쓴다 — 날짜를 코드에 박지 않는다 */}
            <p className="allpass-period">
              <CalendarDays size={17} strokeWidth={2} aria-hidden />
              <span className="num">
                {dayjs(endDate).format('M월 D일')}까지 이용
              </span>
            </p>

            <div className="allpass-price">
              <p className="allpass-was">
                <span className="allpass-was-label">정가</span>
                <span className="allpass-was-num num">
                  {formatKRW(regularPrice)}원
                </span>
              </p>
              <p className="allpass-sale-row">
                <span className="allpass-sale-label">얼리버드 특가</span>
                {/*
                  할인율은 정가·특가에서 계산한다. 계산이 성립하지 않는 값
                  (정가 0, 특가 > 정가)이면 배지 자체를 렌더하지 않는다 —
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

            <p className="allpass-notice">
              <Clock size={17} strokeWidth={2} aria-hidden />
              <span>{PLAN_PRICE_NOTICE}</span>
            </p>
          </div>
        </div>

        <div className="plan-plus rv" aria-hidden>
          <span className="plan-plus-icon">+</span>
          <span className="plan-plus-label">옵션 추가</span>
        </div>

        <VodOptionCard />
      </div>
    </section>
  );
}
