'use client';

import { ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { COMPARE_COMBOS, COMPARE_COPY } from '../data/compare';
import { useComparePrices } from '../lib/useComparePrices';
import AllInOneCard from '../ui/AllInOneCard';
import CompareTabs from '../ui/CompareTabs';
import IndividualPurchaseCard from '../ui/IndividualPurchaseCard';

/**
 * 개별 구매 대비 올인원 패스 가격 비교 (시안 4.png).
 *
 * 좌측 금액은 어드민 챌린지 가격에서 온다. 조회가 2단(active → detail)이라 값이 비싸므로
 * 두 가지로 아낀다 — 섹션이 뷰포트에 들어오기 전에는 조회하지 않고, 들어온 뒤에도
 * **활성 탭 1개만** 조회한다. 탭을 오가면 TanStack Query 캐시가 재요청을 막는다.
 *
 * 결정 7 — 개별 합계가 올인원가 이하로 내려간 탭은 비교가 성립하지 않으므로 탭 목록에서
 * 숨긴다. 탭은 활성일 때만 조회하므로 역전은 그 탭을 한 번 열어본 뒤에야 알 수 있다.
 * 숨겨서 활성 탭이 사라지면 남은 첫 탭으로 옮기고, 전부 숨겨지면 섹션을 렌더하지 않는다.
 */
export default function CompareSection() {
  const [activeId, setActiveId] = useState(COMPARE_COMBOS[0].id);
  const [unusableIds, setUnusableIds] = useState<string[]>([]);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // 뷰포트 진입 전에는 가격을 부르지 않는다. 관측자가 없는 환경(SSR 직후·구형)에서는
  // 아끼기를 포기하고 바로 조회한다 — 금액이 영원히 스켈레톤으로 남는 편이 더 나쁘다.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 쓸 수 없다고 판정된 조합은 탭에서 뺀다 — 역전(개별이 더 쌈)이거나
  // 항목 중 모집 중인 기수가 없어 합계를 신뢰할 수 없는 경우다.
  const visibleCombos = COMPARE_COMBOS.filter(
    (combo) => !unusableIds.includes(combo.id),
  );
  const activeCombo =
    COMPARE_COMBOS.find((combo) => combo.id === activeId) ?? COMPARE_COMBOS[0];

  const { items, total, isLoading, isUsable } = useComparePrices(activeCombo, {
    enabled: inView,
  });

  useEffect(() => {
    // 조회를 실제로 돌린 뒤에만 판정한다.
    //
    // 뷰포트 진입 전에는 쿼리가 꺼져 있고, 꺼둔 쿼리는 isLoading 이 false 다.
    // inView 를 빼면 아직 아무것도 안 불러온 상태에서 "쓸 수 없음" 으로 찍혀
    // 세 조합이 차례로 숨겨지고 섹션이 사라진다. 그러면 관측 대상도 없어져
    // 영영 조회가 시작되지 않는다.
    if (!inView || isLoading || isUsable) return;
    setUnusableIds((prev) =>
      prev.includes(activeCombo.id) ? prev : [...prev, activeCombo.id],
    );
  }, [inView, isLoading, isUsable, activeCombo.id]);

  // 활성 탭이 숨겨졌으면 남은 탭으로 옮긴다.
  useEffect(() => {
    if (!unusableIds.includes(activeId)) return;
    const next = COMPARE_COMBOS.find(
      (combo) => !unusableIds.includes(combo.id),
    );
    if (next) setActiveId(next.id);
  }, [unusableIds, activeId]);

  if (visibleCombos.length === 0) return null;

  return (
    <section className="compare" ref={sectionRef}>
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
            <IndividualPurchaseCard
              items={items}
              total={total}
              isLoading={isLoading}
            />
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
