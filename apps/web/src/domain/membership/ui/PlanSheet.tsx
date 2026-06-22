import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { onOpenPlanSheet } from '../lib/planSheet';
import { setOverlayOpen } from '../lib/headerSync';
import {
  formatKRW,
  MEMBERSHIP_PLANS,
  type MembershipPlanKey,
} from '../data/membership';
import { PLAN_CARDS } from '../data/plans';

const PLAN_ORDER: MembershipPlanKey[] = ['PREMIUM', 'STANDARD', 'BASIC'];

// 시트 설명은 plans.ts 카드의 포함(미off) 혜택을 단일 출처로 사용한다(기능명세서 12.2).
const PLAN_DESC = Object.fromEntries(
  PLAN_CARDS.map((card) => [
    card.key,
    card.features
      .filter((f) => !f.off)
      .map((f) => f.text)
      .join(' · '),
  ]),
) as Record<MembershipPlanKey, string>;

// PricePlanBottomSheet.tsx 디자인 복사 — 플랜 선택 + 가격 + 총 결제 금액.
// 결제 버튼은 선택 플랜의 토스 결제 링크를 새 탭으로 연다.
export default function PlanSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<MembershipPlanKey>('STANDARD');

  useEffect(
    () =>
      onOpenPlanSheet((plan) => {
        if (plan) setSelected(plan);
        setIsOpen(true);
      }),
    [],
  );

  // 시트가 열렸을 때 배경 스크롤 잠금 + 부모 헤더 숨김.
  useEffect(() => {
    setOverlayOpen(isOpen);
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const total = MEMBERSHIP_PLANS[selected].price;

  const handlePay = () => {
    window.open(MEMBERSHIP_PLANS[selected].toss, '_blank', 'noopener');
  };

  if (typeof document === 'undefined') return null;

  // 오버레이는 document.body 로 포털한다. 섹션 안에 두면 임베드 시 absolute 기준점이
  // 섹션이 되어 보이는 영역 밖으로 밀려난다(=화면에 안 보임).
  return createPortal(
    // 포털은 .membership-root 밖(body)으로 나가므로 스코프드 CSS·변수를 받도록 래핑한다.
    <div className="membership-root">
      <div
        className={`sheet-ov ${isOpen ? 'open' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsOpen(false);
        }}
      >
        <div className="sheet" role="dialog" aria-modal="true">
          <div className="sheet-grip" />
          <span className="sheet-label">멤버십 플랜 선택 (필수)</span>

          {PLAN_ORDER.map((key) => {
            const plan = MEMBERSHIP_PLANS[key];
            return (
              <div
                key={key}
                className={`plan-opt ${selected === key ? 'on' : ''}`}
                onClick={() => setSelected(key)}
              >
                <span className="radio" />
                <div className="meta">
                  <div className="nm">{plan.label}</div>
                  <div className="desc">{PLAN_DESC[key]}</div>
                </div>
                <div className="price">
                  <span className="was num">
                    {formatKRW(plan.originalPrice)}원
                  </span>
                  <span className="now num">{formatKRW(plan.price)}원</span>
                </div>
              </div>
            );
          })}

          <div className="sheet-total">
            <span className="lbl">총 결제 금액</span>
            <span className="amt num">{formatKRW(total)}원</span>
          </div>

          <div className="sheet-actions">
            <button className="cancel" onClick={() => setIsOpen(false)}>
              이전 단계로
            </button>
            <button className="pay" onClick={handlePay}>
              결제하기
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
