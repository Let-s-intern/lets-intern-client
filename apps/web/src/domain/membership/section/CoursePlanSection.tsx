import { useState } from 'react';
import {
  COURSE_PLAN_BODY,
  COURSE_PLAN_HEADER,
  COURSE_PLAN_TYPES,
  PLAYBOOK_CAPTION_LINES,
  PLAYBOOK_SHOT_ALT,
  PLAYBOOK_SHOT_SIZE,
  PLAYBOOK_SHOT_SRC,
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

            {/*
              시안 8 상단의 유형 선택. 고르면 10주 계획이 바뀐다고 시안은 말하지만,
              유형별로 다른 매트릭스를 받은 적이 없다. 없는 표를 지어내면 고른 사람이
              같은 표를 보고 속았다고 느낀다. 지금은 자기 유형을 확인하는 안내로만 두고,
              고를 수 있는 컨트롤로 만들지 않는다. 유형별 계획을 받으면 여기에 붙인다.
            */}
            <div className="cp-types">
              {COURSE_PLAN_TYPES.map((type, i) => (
                <div
                  className="cp-type"
                  data-lead={i === 0 ? 'true' : undefined}
                  key={type.id}
                >
                  <span className="cp-type-label">{type.label}</span>
                  <strong className="cp-type-title">{type.title}</strong>
                  <span className="cp-type-desc">{type.desc}</span>
                </div>
              ))}
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

            {/* 시안 8 범례 — 어느 배지가 자료이고 어느 배지가 함께하는 단계인지 */}
            <p className="cp-playbook">{COURSE_PLAN_BODY.matrixFootnote}</p>

            {/* 구매자가 실제로 받는 화면. `.cp-view` 밖이라 `.rv` 리빌이 안전하다 —
                토글로 리마운트되는 자리에 두면 IntersectionObserver 가 놓친다. */}
            <img
              className="cp-playbook-shot rv"
              src={PLAYBOOK_SHOT_SRC}
              alt={PLAYBOOK_SHOT_ALT}
              width={PLAYBOOK_SHOT_SIZE.width}
              height={PLAYBOOK_SHOT_SIZE.height}
              loading="lazy"
              decoding="async"
            />

            <p className="cp-playbook-caption rv">
              {PLAYBOOK_CAPTION_LINES.map((line, i) => (
                <span className="brk" key={i}>
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
