import { PROGRAMS } from '../../constants';
import type { ChallengeComparisonRow, ComparisonRowConfig } from '../../types';

interface ChallengeComparisonCardsProps {
  challenges: ChallengeComparisonRow[];
  rows: ComparisonRowConfig[];
  expandedRows: Record<string, boolean>;
  toggleRow: (key: string) => void;
}

const ChallengeComparisonCards = ({
  challenges,
  rows,
  expandedRows,
  toggleRow,
}: ChallengeComparisonCardsProps) => {
  return (
    <div className="flex flex-col gap-4 lg:hidden">
      {challenges.map((challenge) => {
        const program = PROGRAMS[challenge.programId];
        return (
          <div
            key={challenge.programId}
            className="to-neutral-98 flex flex-col gap-2.5 rounded-lg border-2 border-neutral-90 bg-gradient-to-br from-white p-4 shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="flex flex-col gap-1 border-b-2 border-neutral-90 pb-2.5">
              <span className="text-small16 font-black text-neutral-0">
                {program.title}
              </span>
              <span className="text-xsmall12 font-medium text-neutral-40">
                {program.subtitle}
              </span>
            </div>
            {rows.map((row) => {
              const value = challenge[row.key];
              const displayValue = value || '-';
              const isCollapsible = row.collapsible;
              const isDefaultHidden = row.defaultHidden;
              const rowKey = `mobile-${row.key}`;
              const isExpanded = expandedRows[rowKey];

              if (isDefaultHidden && !isExpanded) {
                return (
                  <div key={row.key} className="flex justify-center py-1">
                    <button
                      onClick={() => toggleRow(rowKey)}
                      className="text-xsmall11 flex items-center gap-1 font-semibold text-primary-dark transition-colors hover:text-primary"
                      type="button"
                    >
                      <span>+</span>
                      <span>{row.label} 보기</span>
                    </button>
                  </div>
                );
              }

              return (
                <div key={row.key} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xsmall12 whitespace-pre-line font-bold text-neutral-40">
                      {row.label}
                    </span>
                    {isCollapsible && (
                      <button
                        onClick={() => toggleRow(rowKey)}
                        className="text-xsmall11 font-bold text-primary-dark transition-colors hover:text-primary"
                        type="button"
                      >
                        {isExpanded ? '−' : '+'}
                      </button>
                    )}
                  </div>
                  <span
                    className={`text-xsmall12 whitespace-pre-line font-medium leading-relaxed text-neutral-10 ${
                      isCollapsible &&
                      !isExpanded &&
                      row.key !== 'deliverable'
                        ? 'line-clamp-2'
                        : ''
                    }`}
                  >
                    {row.key === 'deliverable' &&
                    !isExpanded &&
                    displayValue !== '-'
                      ? displayValue.split('\n\n')[0]
                      : displayValue}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ChallengeComparisonCards;
