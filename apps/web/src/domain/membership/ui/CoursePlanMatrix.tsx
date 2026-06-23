import type { CSSProperties } from 'react';
import {
  CATEGORIES,
  COURSE_TAG_LABEL,
  MATRIX_CELL_MAP,
  matrixCellKey,
  type Category,
  type MatrixCell,
  type Owner,
  STEPS,
  type Step,
} from '../data/coursePlan';

// 렛츠커리어가 직접 함께하는 챌린지 셀인지. (셀 색 강조용)
// 무료 자료·템플릿·체크리스트(자료 제공) 셀은 강조 없이 흰 배경으로 둔다.
const isProvided = (owner: Owner) =>
  owner === 'challenge' || owner === 'challenge-deep';

// 한 STEP 칸의 셀(들). document/step03 처럼 2셀이면 세로로 쌓는다.
// 모든 셀에 분류 배지(무료 자료·템플릿 제공·체크리스트 제공·챌린지)를 단다.
// 셀 색은 owner 기준(data-owner/data-provided)으로 그대로 유지한다.
function StepColumn({ cells }: { cells: MatrixCell[] }) {
  return (
    <div className="cpm-col">
      {cells.map((cell) => (
        <article
          key={cell.owner + cell.title}
          className="cpm-cell"
          data-owner={cell.owner}
          data-provided={isProvided(cell.owner) ? 'true' : undefined}
        >
          <span className="cpm-cell-tag" data-tag={cell.tag}>
            {COURSE_TAG_LABEL[cell.tag]}
          </span>
          <p className="cpm-cell-title">{cell.title}</p>
          <p className="cpm-cell-desc">{cell.desc}</p>
        </article>
      ))}
    </div>
  );
}

// 데스크탑 STEP 헤더 행. 준비/실전 구간을 phase 로 색 안내.
function StepHeader() {
  return (
    <div className="cpm-steps" aria-hidden="true">
      <div className="cpm-steps-corner" />
      {STEPS.map((step, i) => (
        <div
          className="cpm-step"
          data-phase={step.phase}
          style={{ '--i': i } as CSSProperties}
          key={step.id}
        >
          <span className="cpm-step-no">STEP {step.no}</span>
          <span className="cpm-step-label">{step.label}</span>
        </div>
      ))}
    </div>
  );
}

// 카테고리 한 줄(=행). 데스크탑은 [카테고리 라벨 | STEP01..05] 그리드,
// 모바일은 카테고리 카드로 자연 분해되며 STEP 칸이 세로로 쌓인다.
function CategoryRow({ category }: { category: Category }) {
  return (
    <div className="cpm-row">
      <div className="cpm-cat">
        <span className="cpm-cat-label">{category.label}</span>
        <span className="cpm-cat-hint">{category.hint}</span>
      </div>
      <div className="cpm-cells">
        {STEPS.map((step: Step) => {
          const cells =
            MATRIX_CELL_MAP.get(matrixCellKey(step.id, category.id)) ?? [];
          return (
            <div
              className="cpm-step-cell"
              data-phase={step.phase}
              key={step.id}
            >
              <span className="cpm-step-tag" data-phase={step.phase}>
                STEP {step.no}
              </span>
              <StepColumn cells={cells} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CoursePlanMatrix() {
  return (
    <div className="cpm">
      <StepHeader />
      <div className="cpm-body">
        {CATEGORIES.map((category) => (
          <CategoryRow category={category} key={category.id} />
        ))}
      </div>
      <p className="cpm-note">
        <span className="cpm-note-chip" data-tag="free">
          무료 자료
        </span>
        <span className="cpm-note-chip" data-tag="template">
          템플릿 제공
        </span>
        <span className="cpm-note-chip" data-tag="checklist">
          체크리스트 제공
        </span>
        는 멤버십에 포함된 자료 제공,{' '}
        <span className="cpm-note-chip" data-tag="challenge">
          챌린지
        </span>{' '}
        는 렛츠커리어가 함께하는 단계예요.
      </p>
    </div>
  );
}
