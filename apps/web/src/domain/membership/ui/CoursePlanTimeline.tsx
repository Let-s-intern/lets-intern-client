import {
  MONTH_GROUPS,
  PLACEHOLDER_TASK,
  WEEKS,
  type WeekItem,
} from '../data/coursePlan';

function WeekRow({ item }: { item: WeekItem }) {
  const isPlaceholder = item.title === PLACEHOLDER_TASK;
  const no = String(item.week).padStart(2, '0');

  return (
    <li className="cp-week" data-owner={item.owner ?? 'none'}>
      <span className="cp-week-no">{no}</span>
      <div className="cp-week-body">
        <p className={`cp-week-title${isPlaceholder ? ' is-empty' : ''}`}>
          {item.title}
        </p>
        {item.desc && <p className="cp-week-desc">{item.desc}</p>}
      </div>
    </li>
  );
}

export default function CoursePlanTimeline() {
  return (
    <div className="cp-timeline">
      <div className="cp-months">
        {MONTH_GROUPS.map((group) => {
          const weeks = WEEKS.filter((week) => week.month === group.month);
          return (
            <section className="cp-month" key={group.month}>
              <header className="cp-month-head">
                <span className="cp-month-name num">{group.month}</span>
                <span className="cp-month-trait">{group.trait}</span>
              </header>
              <ul className="cp-weeks">
                {weeks.map((week) => (
                  <WeekRow item={week} key={week.week} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
