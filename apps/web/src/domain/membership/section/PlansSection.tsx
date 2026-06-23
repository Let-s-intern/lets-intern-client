import dayjs from '../lib/dayjs';
import {
  formatKRW,
  MEMBERSHIP_END_DATE,
  MEMBERSHIP_START_DATE,
} from '../data/membership';
import { getDiscountRate, PLAN_NAME, PLAN_PRICE } from '../data/plans';
import VodOptionCard from '../ui/VodOptionCard';

// 단일 올패스 플랜 표시 섹션. 등급 비교/탭 제거 → 하나의 상품 카드.
// 가격 위계(정가 취소선 → 할인 배지 → 오픈 특가 → 월/일 환산)만 보여준다.
// 정가 취소선은 기본으로 그어져 있고, 카드 호버 시 긋는 애니메이션을 다시 재생한다(CSS).
// 결제는 하단 고정 ApplyBar(openPlanSheet → MembershipPaymentSheet)에 위임한다.
export default function PlansSection() {
  const startDate = MEMBERSHIP_START_DATE;
  const endDate = MEMBERSHIP_END_DATE;
  const months = dayjs(endDate).diff(dayjs(startDate), 'month') + 1;
  const discountRate = getDiscountRate(PLAN_PRICE.original, PLAN_PRICE.sale);
  // 월/일 환산(마케팅 표기) — 특가 하나에서 파생해 가격 변경 시 자동 갱신.
  const totalDays = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
  const perMonth = Math.round(PLAN_PRICE.sale / months / 1000) * 1000;
  const perDay = Math.round(PLAN_PRICE.sale / totalDays / 100) * 100;

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
            <div className="allpass-compare">
              {/* 왼쪽: 오픈 특가 히어로 */}
              <div className="allpass-now-group">
                <span className="allpass-now-label">오픈 특가</span>
                <div className="allpass-now-line">
                  <span className="allpass-now num">
                    {formatKRW(PLAN_PRICE.sale)}
                    <span className="allpass-unit">원 / {months}개월</span>
                  </span>
                  <span className="allpass-badge num">{discountRate}% OFF</span>
                </div>
                <span className="allpass-vat">
                  부가세 포함 · 선착순 100명 한정
                </span>
              </div>

              {/* 오른쪽: 정가(취소선) */}
              <div className="allpass-was">
                <span className="allpass-was-label">정가</span>
                <span className="allpass-was-figure">
                  <span className="allpass-was-num num">
                    {formatKRW(PLAN_PRICE.original)}원
                  </span>
                  {/* 취소선 — 비교 영역이 보이면(.struck) 좌→우로 그어진다 */}
                  <span className="allpass-strike" aria-hidden />
                </span>
              </div>
            </div>
            <div className="allpass-permonth">
              <span className="allpass-permonth-eq">
                {months}개월{' '}
                <span className="num">{formatKRW(PLAN_PRICE.sale)}</span>원 ={' '}
                <strong className="num">월 {formatKRW(perMonth)}원</strong>
              </span>
              <span className="allpass-permonth-day num">
                하루 약 {formatKRW(perDay)}원 꼴
              </span>
            </div>
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
