import { useState } from 'react';
import {
  COURSE_PLAN_BODY,
  COURSE_PLAN_HEADER,
  type CoursePlanViewId,
} from '../data/coursePlan';
import CoursePlanToggle from '../ui/CoursePlanToggle';
import CoursePlanMatrix from '../ui/CoursePlanMatrix';
import CoursePlanTimeline from '../ui/CoursePlanTimeline';

/** 헤드라인 한 줄에서 강조 어절만 파란색(.hl)으로 감싼다. */
function HeadlineLine({
  line,
  highlights,
}: {
  line: string;
  highlights: readonly string[];
}) {
  const hit = highlights.find((word) => line.includes(word));
  if (!hit) return <>{line}</>;
  const at = line.indexOf(hit);
  return (
    <>
      {line.slice(0, at)}
      <span className="hl">{hit}</span>
      <HeadlineLine
        line={line.slice(at + hit.length)}
        highlights={highlights.filter((word) => word !== hit)}
      />
    </>
  );
}

export default function CoursePlanSection() {
  const [view, setView] = useState<CoursePlanViewId>('matrix');

  return (
    <section className="courseplan" id="course-plan">
      {/* 시안 6-0 — 헤더 밴드는 흰 배경. 아래 본문 밴드(연한 파랑)와 배경이 갈린다. */}
      <div className="cp-head-band">
        <div className="wrap">
          <div className="sec-head rv">
            <span className="eyebrow">{COURSE_PLAN_HEADER.badge}</span>
            <h2>
              {COURSE_PLAN_HEADER.titleLines.map((line, i) => (
                <span key={i}>
                  <HeadlineLine
                    line={line}
                    highlights={COURSE_PLAN_HEADER.titleHighlights}
                  />
                  {i < COURSE_PLAN_HEADER.titleLines.length - 1 && <br />}
                </span>
              ))}
            </h2>
            <p>
              {COURSE_PLAN_HEADER.subLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < COURSE_PLAN_HEADER.subLines.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      {/* 시안 6-1 — 플레이북 본문 밴드. 연한 파랑 배경. */}
      <div className="cp-body-band">
        <div className="wrap">
          <div className="rv">
            <div className="cp-lead">
              <h3>
                {COURSE_PLAN_BODY.titleLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < COURSE_PLAN_BODY.titleLines.length - 1 && <br />}
                  </span>
                ))}
              </h3>
              <p>{COURSE_PLAN_BODY.sub}</p>
            </div>

            <CoursePlanToggle active={view} onChange={setView} />

            <div className="cp-matrix-head">
              <h4>{COURSE_PLAN_BODY.matrixTitle}</h4>
              <p>{COURSE_PLAN_BODY.matrixSub}</p>
            </div>

            {/* key 로 뷰 전환마다 페이드 애니메이션을 재실행(.rv 리빌과 독립) */}
            <div className="cp-view" key={view}>
              {view === 'matrix' ? (
                <CoursePlanMatrix />
              ) : (
                <CoursePlanTimeline />
              )}
            </div>

            <p className="cp-playbook">
              구매자에게는 이 플랜의 풀버전{' '}
              <strong>하반기 공채 준비 플레이북</strong>을 제공합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
