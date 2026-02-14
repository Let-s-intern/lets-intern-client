'use client';

import { CHALLENGE_COMPARISON } from '../constants';
import { useExpandableRows } from '../hooks/useExpandableRows';
import type { ComparisonRowConfig, ProgramId } from '../types';
import ChallengeComparisonCards from './comparison/ChallengeComparisonCards';
import ChallengeComparisonTable from './comparison/ChallengeComparisonTable';
import FrequentComparisonCarousel from './comparison/FrequentComparisonCarousel';

const COMPARISON_ROWS: ComparisonRowConfig[] = [
  { label: '추천 대상', key: 'target' },
  { label: '기간', key: 'duration' },
  { label: '플랜별 가격\n(환급금 기준)', key: 'pricing' },
  { label: '피드백 횟수', key: 'feedback' },
  { label: '결과물', key: 'deliverable', collapsible: true },
  {
    label: '커리큘럼',
    key: 'curriculum',
    collapsible: true,
    defaultHidden: true,
  },
  {
    label: '주요 특징',
    key: 'features',
    collapsible: true,
    defaultHidden: true,
  },
];

interface ComparisonSectionProps {
  highlightedPrograms?: {
    primary: ProgramId | null;
    secondary: ProgramId[];
  };
}

const ComparisonSection = ({
  highlightedPrograms = { primary: null, secondary: [] },
}: ComparisonSectionProps) => {
  const { expandedRows, toggleRow } = useExpandableRows();

  return (
    <section className="flex w-full flex-col gap-8" id="curation-comparison">
      <div className="flex flex-col gap-2">
        <h3 className="text-medium22 font-bold text-neutral-0">
          어떤 챌린지가 나에게 맞을까?
        </h3>
        <p className="text-xsmall15 text-neutral-40">
          가격부터 결과물까지, 한눈에 비교하고 나에게 딱 맞는 챌린지를
          골라보세요.
        </p>
      </div>

      <ChallengeComparisonTable
        challenges={CHALLENGE_COMPARISON}
        rows={COMPARISON_ROWS}
        expandedRows={expandedRows}
        toggleRow={toggleRow}
        highlightedPrograms={highlightedPrograms}
      />

      <ChallengeComparisonCards
        challenges={CHALLENGE_COMPARISON}
        rows={COMPARISON_ROWS}
        expandedRows={expandedRows}
        toggleRow={toggleRow}
        highlightedPrograms={highlightedPrograms}
      />

      <FrequentComparisonCarousel />
    </section>
  );
};

export default ComparisonSection;
