import {
  CATEGORIES,
  MATRIX_CELL_MAP,
  matrixCellKey,
  type Category,
  type MatrixCell,
  type Owner,
  STEPS,
  type Step,
} from '../data/coursePlan';

// owner → 셀 태그 라벨. 색은 CSS(data-owner)로 처리.
const OWNER_LABEL: Record<Owner, string> = {
  self: '직접',
  free: '무료 자료',
  challenge: '챌린지',
  'challenge-deep': '챌린지 · 심화',
};

// 한 STEP 칸의 셀(들). document/step03 처럼 2셀이면 세로로 쌓는다.
function StepColumn({ cells }: { cells: MatrixCell[] }) {
  return (
    <div className="cpm-col">
      {cells.map((cell) => (
        <article
          key={cell.owner + cell.title}
          className="cpm-cell"
          data-owner={cell.owner}
        >
          <p className="cpm-cell-title">{cell.title}</p>
          <p className="cpm-cell-desc">{cell.desc}</p>
          <span className="cpm-cell-tag" data-owner={cell.owner}>
            {OWNER_LABEL[cell.owner]}
          </span>
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
      {STEPS.map((step) => (
        <div className="cpm-step" data-phase={step.phase} key={step.id}>
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
    </div>
  );
}
