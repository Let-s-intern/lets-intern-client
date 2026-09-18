import { useState } from 'react';
import {
  COURSE_PLAN_BODY,
  COURSE_PLAN_HEADER,
  COURSE_PLAN_TYPES,
  type CoursePlanTypeId,
  type CoursePlanViewId,
} from '../data/coursePlan';
import CoursePlanToggle from '../ui/CoursePlanToggle';
import CoursePlanMatrix from '../ui/CoursePlanMatrix';
import CoursePlanTimeline from '../ui/CoursePlanTimeline';
import CoursePlanLegend from '../ui/CoursePlanLegend';

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
  // 기본은 TYPE A. 유형을 바꿔도 보기(view)는 그대로 둔다
  const [type, setType] = useState<CoursePlanTypeId>('a');

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

            {/* 시안 8 상단의 유형 선택. 고른 유형이 매트릭스·주 단위와 그 위 문구를 바꾼다. */}
            <div className="cp-types" role="group" aria-label="내 상황 고르기">
              {COURSE_PLAN_TYPES.map((option) => (
                <button
                  type="button"
                  className="cp-type"
                  aria-pressed={type === option.id}
                  onClick={() => setType(option.id)}
                  key={option.id}
                >
                  <span className="cp-type-label">{option.label}</span>
                  <strong className="cp-type-title">{option.title}</strong>
                  <span className="cp-type-desc">{option.desc}</span>
                </button>
              ))}
            </div>

            <CoursePlanToggle active={view} onChange={setView} />

            <div className="cp-matrix-head">
              <h4>{COURSE_PLAN_BODY.matrixTitle[type]}</h4>
              <p>{COURSE_PLAN_BODY.matrixSub}</p>
            </div>

            {/* key 로 뷰 전환마다 페이드 애니메이션을 재실행(.rv 리빌과 독립) */}
            <div className="cp-view" key={view}>
              {view === 'matrix' ? (
                <CoursePlanMatrix type={type} />
              ) : (
                <CoursePlanTimeline type={type} />
              )}
            </div>

            {/* 시안 8 범례 — 어느 배지가 자료이고 어느 배지가 함께하는 단계인지. 두 보기가 같다 */}
            <CoursePlanLegend />
            <p className="cp-playbook">{COURSE_PLAN_BODY.matrixFootnote}</p>

            {/*
              플레이북 앱 화면(애니메이션 WebP, 2.29MB)과 그 아래 마무리 문구를 뺐다.
              시안 8 에 없고, 시안 9 의 대시보드 목업이 같은 화면을 이미 보여준다.
              에셋과 데이터(PLAYBOOK_SHOT_*, PLAYBOOK_CAPTION_LINES)는 남겨 뒀다.
            */}
          </div>
        </div>
      </div>
    </section>
  );
}
