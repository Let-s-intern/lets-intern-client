import { Fragment } from 'react';
import {
  COURSE_TAG_LABEL,
  type CoursePlanTypeId,
  PRESTART_SEMINAR,
  WEEK_FLOW,
  WEEK_PLANS,
  type WeekPlan,
  type WeekSupport,
  weekMonth,
  weekPhase,
} from '../data/coursePlan';

// 클래스 접두사를 cpw- 로 둔다. membership-legacy 의 같은 이름 CSS 파일이 옛 wk-* 규칙을
// 그대로 갖고 있어, 두 화면을 오가면 같은 이름 규칙이 섞일 수 있다.

function FlowOverview() {
  return (
    <section className="cpw-flow" aria-labelledby="cpw-flow-label">
      <p className="cpw-flow-label" id="cpw-flow-label">
        10주 흐름 한눈에 보기
      </p>
      <ol className="cpw-flow-list">
        {WEEK_FLOW.map((phase) => (
          <li className="cpw-flow-item" data-phase={phase.id} key={phase.id}>
            <span className="cpw-flow-range">{phase.range}</span>
            <strong className="cpw-flow-title">{phase.title}</strong>
            <span className="cpw-flow-desc">{phase.desc}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** 1주차보다 앞선 세미나 한 줄. 「시작 전」은 고정 문구다 */
function PrestartRow() {
  return (
    <p className="cpw-prestart">
      <strong className="cpw-prestart-label">
        {PRESTART_SEMINAR.whenNote}
      </strong>
      <span>
        {PRESTART_SEMINAR.when} ·{' '}
        <span className="cpw-prestart-title">{PRESTART_SEMINAR.title}</span> (
        {PRESTART_SEMINAR.desc})
      </span>
    </p>
  );
}

function SupportItem({ support }: { support: WeekSupport }) {
  return (
    <li className="cpw-support" data-tag={support.tag}>
      <span className="cpw-support-tag">
        {COURSE_TAG_LABEL[support.tag]}
        {support.when && ` · ${support.when}`}
      </span>
      <strong className="cpw-support-title">{support.title}</strong>
      {support.speaker && (
        <span className="cpw-support-speaker">{support.speaker}</span>
      )}
    </li>
  );
}

function WeekCard({ plan }: { plan: WeekPlan }) {
  return (
    // 왼쪽 막대 색은 월이 아니라 구간(주차 번호)을 따른다
    <article className="cpw-week" data-phase={weekPhase(plan.week)}>
      <div className="cpw-week-when">
        <span className="cpw-week-no">{plan.week}주차</span>
        {/* 시안은 끝 날짜를 「– 9.27 일」로 다음 줄에 둔다 */}
        <span className="cpw-week-range">
          {plan.range.replace(' – ', '\n– ')}
        </span>
      </div>
      <div className="cpw-week-body">
        <h6 className="cpw-week-title">{plan.title}</h6>
        <ul className="cpw-week-todos">
          {plan.todos.map((todo) => (
            <li key={todo}>{todo}</li>
          ))}
        </ul>
        <p className="cpw-week-output">
          이번 주 산출물 · <strong>{plan.output}</strong>
        </p>
      </div>
      <div className="cpw-week-supports">
        <p className="cpw-supports-label">렛츠커리어가 함께합니다</p>
        <ul className="cpw-support-list">
          {plan.supports.map((support) => (
            <SupportItem support={support} key={support.tag + support.title} />
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function CoursePlanTimeline({
  type,
}: {
  type: CoursePlanTypeId;
}) {
  return (
    <div className="cpw">
      <FlowOverview />
      {WEEK_PLANS[type].map((plan) => {
        const month = weekMonth(plan.week);
        const startsMonth =
          plan.week === 1 || month !== weekMonth(plan.week - 1);
        return (
          <Fragment key={plan.week}>
            {startsMonth && <h5 className="cpw-month">{month}</h5>}
            {plan.week === 1 && <PrestartRow />}
            <WeekCard plan={plan} />
          </Fragment>
        );
      })}
    </div>
  );
}
