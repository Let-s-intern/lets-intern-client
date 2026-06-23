import { Check, Circle, Sparkles, X } from 'lucide-react';
import { COMPARE, type ComparePanel } from '../data/compare';

// 비교 카드 1장 — 아이콘 칩 헤더 + 체크/엑스 항목 리스트.
// winner=강조(스파클·체크), loser=톤다운(중립 원·엑스).
function CompareCard({ kind, heading, items }: ComparePanel) {
  const isWinner = kind === 'winner';
  const HeadIcon = isWinner ? Sparkles : Circle;
  const ItemIcon = isWinner ? Check : X;

  return (
    <article className="cmp-card" data-kind={kind}>
      <div className="cmp-head">
        <span className="cmp-tag" aria-hidden>
          <HeadIcon size={16} strokeWidth={2.4} />
        </span>
        <h3>{heading}</h3>
      </div>
      <ul className="cmp-body">
        {items.map((text) => (
          <li className="cmp-item" key={text}>
            <span className="cmp-ic" aria-hidden>
              <ItemIcon size={15} strokeWidth={3} />
            </span>
            <p>{text}</p>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function CompareSection() {
  return (
    <section className="compare">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">{COMPARE.badge}</span>
          <h2>
            <span className="cmp-t-lose">{COMPARE.titleLead}</span>
            <span className="cmp-t-win">{COMPARE.titleHi}</span>
          </h2>
        </div>

        <div className="cmp-grid rv">
          <CompareCard {...COMPARE.loser} />
          <div className="cmp-vs" aria-hidden>
            VS
          </div>
          <CompareCard {...COMPARE.winner} />
        </div>
      </div>
    </section>
  );
}
