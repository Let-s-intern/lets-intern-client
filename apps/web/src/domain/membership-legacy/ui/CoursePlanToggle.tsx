import { COURSE_PLAN_VIEWS, type CoursePlanViewId } from '../data/coursePlan';

const VIEW_LIST = Object.values(COURSE_PLAN_VIEWS);

interface CoursePlanToggleProps {
  active: CoursePlanViewId;
  onChange: (view: CoursePlanViewId) => void;
}

export default function CoursePlanToggle({
  active,
  onChange,
}: CoursePlanToggleProps) {
  return (
    <div className="cp-toggle-wrap">
      <div className="cp-toggle" role="group" aria-label="플랜 보기 전환">
        {VIEW_LIST.map((view) => (
          <button
            key={view.id}
            type="button"
            className="cp-toggle-btn"
            aria-pressed={active === view.id}
            onClick={() => onChange(view.id)}
          >
            {view.label}
          </button>
        ))}
      </div>
    </div>
  );
}
