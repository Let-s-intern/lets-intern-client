import { PROGRAMS } from '../../data/constants';
import type {
  ChallengeComparisonRow,
  ComparisonRowConfig,
  ProgramId,
} from '../../types/types';

interface ChallengeComparisonTableProps {
  challenges: ChallengeComparisonRow[];
  rows: ComparisonRowConfig[];
  expandedRows: Record<string, boolean>;
  toggleRow: (key: string) => void;
  highlightedPrograms?: {
    primary: ProgramId | null;
    secondary: ProgramId[];
  };
}

const ChallengeComparisonTable = ({
  challenges,
  rows,
  expandedRows,
  toggleRow,
  highlightedPrograms = { primary: null, secondary: [] },
}: ChallengeComparisonTableProps) => {
  return (
    <div className="hidden overflow-x-auto lg:block">
      <div className="min-w-full overflow-hidden rounded-lg border-2 border-neutral-90 bg-white shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary-5">
              <th className="text-xsmall13 sticky left-0 z-10 w-[100px] min-w-[100px] border-r-2 border-neutral-90 bg-primary-5 px-3 py-3 text-left font-black text-neutral-0 shadow-[2px_0_10px_rgba(0,0,0,0.08)]">
                구분
              </th>
              {challenges.map((challenge) => {
                const program = PROGRAMS[challenge.programId];
                const isPrimary =
                  highlightedPrograms.primary === challenge.programId;
                const isSecondary = highlightedPrograms.secondary.includes(
                  challenge.programId,
                );
                const isHighlighted = isPrimary || isSecondary;
                return (
                  <th
                    key={challenge.programId}
                    className={`w-[155px] min-w-[155px] border-l border-neutral-90 px-2 py-3 text-center ${
                      isPrimary
                        ? 'bg-primary-20'
                        : isSecondary
                          ? 'bg-primary-10'
                          : ''
                    }`}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      {isHighlighted && (
                        <span className="mb-0.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                          추천
                        </span>
                      )}
                      <span className="break-keep text-xsmall14 font-black leading-tight text-neutral-0">
                        {program.title}
                      </span>
                      <span className="text-xsmall11 break-keep font-medium leading-snug text-neutral-40">
                        {program.subtitle}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const isCollapsible = row.collapsible;
              const isDefaultHidden = row.defaultHidden;
              const isExpanded = expandedRows[row.key];

              if (isDefaultHidden && !isExpanded) {
                return (
                  <tr key={row.label}>
                    <td
                      colSpan={challenges.length + 1}
                      className="border-t border-neutral-90 px-3 py-2 text-center"
                    >
                      <button
                        onClick={() => toggleRow(row.key)}
                        className="text-xsmall12 mx-auto flex items-center gap-1 font-semibold text-primary-dark transition-colors hover:text-primary"
                        type="button"
                      >
                        <span>+</span>
                        <span>{row.label} 보기</span>
                      </button>
                    </td>
                  </tr>
                );
              }

              // 커리큘럼 행은 2개의 실제 행으로 분리
              if (row.key === 'curriculum') {
                return (
                  <>
                    {/* 단계 행 */}
                    <tr
                      key={`${row.label}-steps`}
                      className={`border-t border-neutral-90 transition-all hover:bg-primary-5 ${idx % 2 === 0 ? 'bg-white' : 'from-neutral-98 bg-gradient-to-r to-white'}`}
                    >
                      <td
                        rowSpan={2}
                        className={`text-xsmall12 sticky left-0 z-10 whitespace-pre-line border-r-2 border-neutral-90 px-3 py-2.5 font-bold text-neutral-0 ${idx % 2 === 0 ? 'bg-white' : 'from-neutral-98 bg-gradient-to-r to-white'} shadow-[2px_0_8px_rgba(0,0,0,0.05)] transition-all hover:bg-primary-5`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span>{row.label}</span>
                          {isCollapsible && (
                            <button
                              onClick={() => toggleRow(row.key)}
                              className="text-xsmall11 font-bold text-primary-dark transition-colors hover:text-primary"
                              type="button"
                            >
                              {isExpanded ? '−' : '+'}
                            </button>
                          )}
                        </div>
                      </td>
                      {challenges.map((challenge) => {
                        const value = challenge[row.key];
                        const displayValue = value || '-';
                        const isPrimary =
                          highlightedPrograms.primary === challenge.programId;
                        const isSecondary = highlightedPrograms.secondary.includes(
                          challenge.programId,
                        );

                        let contentToShow = displayValue;
                        let techniquesSection = '';

                        if (displayValue !== '-') {
                          const parts = displayValue.split('\n\n');
                          contentToShow = parts[0]; // 단계 부분
                          if (parts[1]) {
                            techniquesSection = parts[1]; // 사용기법/템플릿/특별미션 부분
                          }
                        }

                        return (
                          <td
                            key={`${challenge.programId}-${row.key}-steps`}
                            className={`border-l border-t border-neutral-90 px-3 py-3.5 text-left align-top ${
                              isPrimary
                                ? 'bg-primary-20'
                                : isSecondary
                                  ? 'bg-primary-10'
                                  : ''
                            }`}
                          >
                            <div className="text-xsmall12 whitespace-pre-line break-keep font-medium leading-relaxed text-neutral-20">
                              {contentToShow}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                    {/* 사용기법 행 */}
                    <tr
                      key={`${row.label}-techniques`}
                      className={`transition-all hover:bg-primary-5 ${idx % 2 === 0 ? 'bg-white' : 'from-neutral-98 bg-gradient-to-r to-white'}`}
                    >
                      {challenges.map((challenge) => {
                        const value = challenge[row.key];
                        const displayValue = value || '-';
                        const isPrimary =
                          highlightedPrograms.primary === challenge.programId;
                        const isSecondary = highlightedPrograms.secondary.includes(
                          challenge.programId,
                        );

                        let techniquesSection = '';

                        if (displayValue !== '-') {
                          const parts = displayValue.split('\n\n');
                          if (parts[1]) {
                            techniquesSection = parts[1];
                          }
                        }

                        return (
                          <td
                            key={`${challenge.programId}-${row.key}-techniques`}
                            className={`border-l border-t border-neutral-90 px-3 py-3.5 text-left align-top ${
                              isPrimary
                                ? 'bg-primary-20'
                                : isSecondary
                                  ? 'bg-primary-10'
                                  : ''
                            }`}
                          >
                            <div className="text-xsmall12 whitespace-pre-line break-keep font-medium leading-relaxed text-neutral-20">
                              {techniquesSection || '\u00A0'}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  </>
                );
              }

              return (
                <tr
                  key={row.label}
                  className={`border-t border-neutral-90 transition-all hover:bg-primary-5 ${idx % 2 === 0 ? 'bg-white' : 'from-neutral-98 bg-gradient-to-r to-white'}`}
                >
                  <td
                    className={`text-xsmall12 sticky left-0 z-10 whitespace-pre-line border-r-2 border-neutral-90 px-3 py-2.5 font-bold text-neutral-0 ${idx % 2 === 0 ? 'bg-white' : 'from-neutral-98 bg-gradient-to-r to-white'} shadow-[2px_0_8px_rgba(0,0,0,0.05)] transition-all hover:bg-primary-5`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{row.label}</span>
                      {isCollapsible && (
                        <button
                          onClick={() => toggleRow(row.key)}
                          className="text-xsmall11 font-bold text-primary-dark transition-colors hover:text-primary"
                          type="button"
                        >
                          {isExpanded ? '−' : '+'}
                        </button>
                      )}
                    </div>
                  </td>
                  {challenges.map((challenge) => {
                    const value = challenge[row.key];
                    const displayValue = value || '-';
                    const isPrimary =
                      highlightedPrograms.primary === challenge.programId;
                    const isSecondary = highlightedPrograms.secondary.includes(
                      challenge.programId,
                    );

                    let contentToShow = displayValue;

                    if (
                      row.key === 'deliverable' &&
                      !isExpanded &&
                      displayValue !== '-'
                    ) {
                      const parts = displayValue.split('\n\n');
                      contentToShow = parts[0];
                    }

                    return (
                      <td
                        key={`${challenge.programId}-${row.key}`}
                        className={`border-l border-t border-neutral-90 px-3 py-3.5 text-left align-top ${
                          isPrimary
                            ? 'bg-primary-20'
                            : isSecondary
                              ? 'bg-primary-10'
                              : ''
                        }`}
                      >
                        <div
                          className={`text-xsmall12 whitespace-pre-line break-keep font-medium leading-relaxed text-neutral-20 ${
                            isCollapsible &&
                            !isExpanded &&
                            row.key !== 'deliverable'
                              ? 'line-clamp-2'
                              : ''
                          }`}
                        >
                          {row.key === 'pricing' ? (
                            <>
                              {contentToShow.split('\n').map((line, i) => (
                                <span key={i}>
                                  {line.includes('(환급금 없음)') ? (
                                    <span className="text-[9px] text-neutral-50">
                                      {line}
                                    </span>
                                  ) : (
                                    line
                                  )}
                                  {i < contentToShow.split('\n').length - 1 && (
                                    <br />
                                  )}
                                </span>
                              ))}
                            </>
                          ) : (
                            contentToShow
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChallengeComparisonTable;
