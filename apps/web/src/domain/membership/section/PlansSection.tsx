import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Briefcase,
  FileText,
  Handshake,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import dayjs from '../lib/dayjs';
import { openPlanSheet } from '../lib/planSheet';
import {
  formatKRW,
  MEMBERSHIP_END_DATE,
  MEMBERSHIP_START_DATE,
} from '../data/membership';
import {
  getDiscountRate,
  PLAN_BENEFITS,
  PLAN_CTA,
  PLAN_FOOTNOTE,
  PLAN_NAME,
  PLAN_PRICE,
  type PlanBenefitIcon,
} from '../data/plans';
import VodOptionCard from '../ui/VodOptionCard';

// 혜택 아이콘 식별자 → lucide 컴포넌트 매핑(모듈 스코프로 고정, 리렌더 시 재생성 방지).
const BENEFIT_ICONS: Record<PlanBenefitIcon, LucideIcon> = {
  fileText: FileText,
  target: Target,
  briefcase: Briefcase,
  bookOpen: BookOpen,
  users: Users,
  handshake: Handshake,
  zap: Zap,
};

// 단일 올패스 플랜 표시 섹션. 등급 비교/탭 제거 → 하나의 상품 카드.
// 가격 위계(정가 취소선 → 특가 → 할인 배지)와 혜택 7종 스캔형 그리드로 구성.
// 결제는 기존 챌린지 시트(openPlanSheet → MembershipPaymentSheet)에 위임한다.
export default function PlansSection() {
  const startDate = MEMBERSHIP_START_DATE;
  const endDate = MEMBERSHIP_END_DATE;
  const months = dayjs(endDate).diff(dayjs(startDate), 'month') + 1;
  const discountRate = getDiscountRate(PLAN_PRICE.original, PLAN_PRICE.sale);

  return (
    <section className="plans" id="plans">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">멤버십 플랜</span>
          <h2>등급 비교는 그만, 단 하나의 올패스</h2>
          <p>고민 없이 하나로. 합격에 필요한 모든 걸 한 번에 담았어요.</p>
        </div>

        <div className="allpass rv">
          <div className="allpass-head">
            <span className="allpass-name">{PLAN_NAME}</span>
            <span className="allpass-period num">
              {dayjs(startDate).format('YY.MM.DD')} –{' '}
              {dayjs(endDate).format('MM.DD')} · {months}개월 이용
            </span>
          </div>

          <div className="allpass-price">
            <span className="allpass-was num">
              {formatKRW(PLAN_PRICE.original)}원
            </span>
            <div className="allpass-now-row">
              <span className="allpass-badge num">{discountRate}% OFF</span>
              <span className="allpass-now num">
                {formatKRW(PLAN_PRICE.sale)}
                <span className="allpass-unit">원 / {months}개월</span>
              </span>
            </div>
            <span className="allpass-vat">부가세 포함 · 선착순 100명 한정</span>
          </div>

          <ul className="allpass-benefits">
            {PLAN_BENEFITS.map((b) => {
              const Icon = BENEFIT_ICONS[b.icon];
              return (
                <li key={b.title} className="allpass-benefit">
                  <span className="allpass-ic" aria-hidden>
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <span className="allpass-bt">{b.title}</span>
                  <span className="allpass-bd">{b.detail}</span>
                </li>
              );
            })}
          </ul>

          <p className="allpass-foot">{PLAN_FOOTNOTE}</p>

          <button
            className="btn btn-primary btn-lg allpass-cta"
            onClick={() => openPlanSheet()}
          >
            {PLAN_CTA}
          </button>
        </div>

        <VodOptionCard />
      </div>
    </section>
  );
}
