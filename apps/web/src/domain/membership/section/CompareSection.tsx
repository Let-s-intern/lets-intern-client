'use client';

import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { COMPARE_COMBOS, COMPARE_COPY, getComboTotal } from '../data/compare';
import AllInOneCard from '../ui/AllInOneCard';
import CompareTabs from '../ui/CompareTabs';
import { useMembershipChallengeData } from '../lib/useMembershipChallengeData';
import IndividualPurchaseCard from '../ui/IndividualPurchaseCard';

/**
 * 개별 구매 대비 올인원 패스 가격 비교 (시안 4.png).
 *
 * 좌측 금액은 `data/compare.ts` 에 하드코딩돼 있다. 어드민 연동판(lib/useComparePrices.ts)도
 * 만들었으나 되돌렸다 — 조합에 든 챌린지 중 하나라도 모집 중이 아니면 합계를 믿을 수 없어
 * 탭이 통째로 사라졌고, 타입당 1회씩 조회가 붙었다. 그 파일은 지우지 않고 남겨 두었다.
 *
 * 개별 합계가 올인원 특가 이하로 내려간 탭은 비교가 성립하지 않으므로 숨긴다.
 * 값이 정적이라 렌더 전에 판정할 수 있고, 전부 숨겨지면 섹션을 렌더하지 않는다.
 */
export default function CompareSection() {
  const [activeId, setActiveId] = useState(COMPARE_COMBOS[0].id);

  // 개별 합계가 올인원 특가 이하면 "올인원이 더 싸다" 는 주장이 깨지므로 그 탭을 뺀다.
  // 값이 전부 하드코딩이라 렌더 전에 판정할 수 있다 — 조회를 기다릴 것이 없다.
  const { salePrice } = useMembershipChallengeData();
  const visibleCombos = COMPARE_COMBOS.filter(
    (combo) => getComboTotal(combo) > salePrice,
  );

  const activeCombo =
    visibleCombos.find((combo) => combo.id === activeId) ?? visibleCombos[0];

  // 활성 탭이 숨겨졌으면 남은 첫 탭으로 옮긴다.
  useEffect(() => {
    if (!activeCombo || activeCombo.id === activeId) return;
    setActiveId(activeCombo.id);
  }, [activeCombo, activeId]);

  const items = activeCombo?.items ?? [];
  const total = activeCombo ? getComboTotal(activeCombo) : 0;

  if (visibleCombos.length === 0 || !activeCombo) return null;

  return (
    <section className="compare">
      <div className="wrap">
        <div className="sec-head rv">
          <h2>
            <span className="cmp-t-lead">{COMPARE_COPY.titleLead}</span>
            <span className="cmp-t-hi">{COMPARE_COPY.titleHi}</span>
          </h2>
          <p>{COMPARE_COPY.subtitle}</p>
        </div>

        <CompareTabs
          combos={visibleCombos}
          activeId={activeId}
          onChange={setActiveId}
        />

        <div
          className="cmp-panel rv"
          id="cmp-panel"
          role="tabpanel"
          aria-labelledby={`cmp-tab-${activeId}`}
        >
          <div className="cmp-col">
            <span className="cmp-col-label">
              {COMPARE_COPY.individualLabel}
            </span>
            <IndividualPurchaseCard items={items} total={total} />
          </div>

          <div className="cmp-arrow" aria-hidden>
            <ChevronRight size={56} strokeWidth={2.6} />
          </div>

          <div className="cmp-col">
            <span className="cmp-col-label cmp-col-label-hi">
              {COMPARE_COPY.allInOneLabel}
            </span>
            <AllInOneCard />
          </div>
        </div>
      </div>
    </section>
  );
}
