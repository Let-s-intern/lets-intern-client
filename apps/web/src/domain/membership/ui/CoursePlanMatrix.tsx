import {
  CATEGORIES,
  MATRIX_CELL_MAP,
  matrixCellKey,
  Owner,
  PHASES,
  PLACEHOLDER_TASK,
  STEPS,
  type MatrixCell,
} from '../data/coursePlan';

// owner → 셀에 붙는 라벨 텍스트. 색은 CSS(data-owner)로 처리.
const OWNER_LABEL: Record<Owner, string> = {
  self: '직접',
  free: '무료 자료',
  challenge: '챌린지',
};

function CellContent({ cell }: { cell: MatrixCell }) {
  // 미확정 셀: 과업 없음 → placeholder 로 비워둠을 명시.
  if (!cell.task) {
    return <span className="cp-cell-empty">{PLACEHOLDER_TASK}</span>;
  }

  return (
    <>
      <span className="cp-cell-task">{cell.task}</span>
      {cell.owner && (
        <span className="cp-tag" data-owner={cell.owner}>
          {OWNER_LABEL[cell.owner]}
        </span>
      )}
    </>
  );
}

// 단계 헤더 행 — 좌상단 코너 + STEP01~05.
function StepHeaderRow() {
  return (
    <div className="cp-matrix-row cp-matrix-head" role="row">
      <div className="cp-corner" role="columnheader">
        단계 / 카테고리
      </div>
      {STEPS.map((step) => (
        <div
          key={step.id}
          className="cp-step-head"
          data-phase={step.phase}
          role="columnheader"
        >
          <span className="cp-step-no">STEP {step.no}</span>
          <span className="cp-step-label">{step.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function CoursePlanMatrix() {
  return (
    <div className="cp-matrix-wrap">
      {/* 준비 / 실전 두 구간 표시 — 가로축 흐름 안내 */}
      <div className="cp-phase-bar" aria-hidden="true">
        {PHASES.map((phase) => (
          <span key={phase.id} className="cp-phase" data-phase={phase.id}>
            <strong>{phase.label}</strong>
            <em>{phase.range}</em>
          </span>
        ))}
      </div>

      <div className="cp-matrix-scroll">
        <div className="cp-matrix" role="table">
          <StepHeaderRow />
          {CATEGORIES.map((category) => (
            <div className="cp-matrix-row" role="row" key={category.id}>
              <div className="cp-cat-head" role="rowheader">
                {category.label}
              </div>
              {STEPS.map((step) => {
                const cell = MATRIX_CELL_MAP.get(
                  matrixCellKey(step.id, category.id),
                );
                return (
                  <div
                    key={step.id}
                    className="cp-cell"
                    data-owner={cell?.owner ?? 'none'}
                    role="cell"
                  >
                    {cell && <CellContent cell={cell} />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
