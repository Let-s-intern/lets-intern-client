import { useState } from 'react';
import {
  COURSE_PLAN_HEADER,
  OWNER_LEGEND,
  type CoursePlanViewId,
} from '../data/coursePlan';
import CoursePlanToggle from '../ui/CoursePlanToggle';
import CoursePlanMatrix from '../ui/CoursePlanMatrix';
import CoursePlanTimeline from '../ui/CoursePlanTimeline';

// owner 3종 범례 — 매트릭스·타임라인이 공유하는 색 의미를 한 줄로 안내.
function CoursePlanLegend() {
  return (
    <div className="cp-legend">
      {OWNER_LEGEND.map((item) => (
        <span
          className="cp-legend-item"
          data-owner={item.owner}
          key={item.owner}
        >
          <span className="cp-legend-dot" data-owner={item.owner} />
          <span className="cp-legend-text">
            <span className="cp-legend-label">{item.label}</span>
            <span className="cp-legend-hint">{item.hint}</span>
          </span>
        </span>
      ))}
    </div>
  );
}

export default function CoursePlanSection() {
  const [view, setView] = useState<CoursePlanViewId>('matrix');

  return (
    <section className="courseplan" id="course-plan">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">{COURSE_PLAN_HEADER.badge}</span>
          <h2>{COURSE_PLAN_HEADER.title}</h2>
          <p>{COURSE_PLAN_HEADER.sub}</p>
        </div>

        <div className="rv">
          <CoursePlanToggle active={view} onChange={setView} />
          <CoursePlanLegend />

          {/* key 로 뷰 전환마다 페이드 애니메이션을 재실행(.rv 리빌과 독립) */}
          <div className="cp-view" key={view}>
            {view === 'matrix' ? <CoursePlanMatrix /> : <CoursePlanTimeline />}
          </div>

          {view === 'matrix' && (
            <p className="cp-scroll-hint">← 좌우로 넘겨 전체 단계를 확인하세요</p>
          )}

          <p className="cp-playbook">
            구매자에게는 이 플랜의 풀버전 <strong>하반기 공채 준비 플레이북</strong>
            을 제공합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
