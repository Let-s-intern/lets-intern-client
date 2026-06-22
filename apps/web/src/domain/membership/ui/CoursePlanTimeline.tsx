import type { CSSProperties } from 'react';
import {
  FLOW_CHIPS,
  FLOW_LABEL,
  MONTH_GROUPS,
  type MonthGroup,
  WEEKS,
  type WeekItem,
} from '../data/coursePlan';

// 주차 번호 표기. 12·13 묶음이면 "12·13".
function weekNo(item: WeekItem): string {
  const head = String(item.week).padStart(2, '0');
  if (item.weekEnd === undefined) return head;
  return `${head}·${item.weekEnd}`;
}

function WeekCard({ item }: { item: WeekItem }) {
  return (
    <article className="wk-card">
      <div className="wk-top">
        <span className="wk-no">{weekNo(item)}</span>
        <span className="wk-wk">WEEK</span>
        {item.isChallenge && <span className="wk-ch">챌린지</span>}
      </div>
      <p className="wk-card-title">{item.title}</p>
      <p className="wk-card-desc">{item.desc}</p>
    </article>
  );
}

// 월 블록 — 헤더(큰 숫자·타이틀·서브·배지) + 액센트 라인 + 4열 카드 그리드.
// --m-accent 등 월별 색은 래퍼에 인라인 변수로 주입(시안 그대로).
function MonthBlock({ group }: { group: MonthGroup }) {
  const weeks = WEEKS.filter((week) => week.month === group.month);
  const style = {
    '--m-accent': group.accent,
    '--m-badge-bg': group.badgeBg,
    '--m-badge-fg': group.badgeFg,
  } as CSSProperties;

  return (
    <section className="wk-month" style={style}>
      <div className="wk-mhead">
        <div className="wk-mtitle">
          <span className="wk-mon">{group.month}</span>
          <div className="wk-mtitle-txt">
            <b>{group.title}</b>
            <span className="wk-msub">{group.sub}</span>
          </div>
        </div>
        <span className="wk-badge">{group.badge}</span>
      </div>
      <div className="wk-line" />
      <div className="wk-cards">
        {weeks.map((week) => (
          <WeekCard item={week} key={week.week} />
        ))}
      </div>
    </section>
  );
}

export default function CoursePlanTimeline() {
  return (
    <div className="wk-timeline">
      {MONTH_GROUPS.map((group) => (
        <MonthBlock group={group} key={group.month} />
      ))}

      <div className="wk-flow">
        <p>
          <strong className="wk-flow-label">{FLOW_LABEL}</strong>
          {FLOW_CHIPS.map((chip, i) => (
            <span className="wk-flow-chip" key={chip}>
              {i > 0 && <span className="wk-flow-arrow"> → </span>}
              {chip}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
