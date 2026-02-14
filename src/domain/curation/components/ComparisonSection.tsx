'use client';

import { CHALLENGE_COMPARISON } from '../constants';
import { useExpandableRows } from '../hooks/useExpandableRows';
import type { ComparisonRowConfig } from '../types';
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

const ComparisonSection = () => {
  const { expandedRows, toggleRow } = useExpandableRows();

  return (
    <section className="flex w-full flex-col gap-8" id="curation-comparison">
      <div className="flex flex-col gap-2">
        <h3 className="text-medium22 font-bold text-neutral-0">
          챌린지별 비교 표
        </h3>
        <p className="text-xsmall15 text-neutral-40">
          가격, 기간, 피드백, 주요 결과물을 한눈에 비교하세요.
        </p>
      </div>

      <ChallengeComparisonTable
        challenges={CHALLENGE_COMPARISON}
        rows={COMPARISON_ROWS}
        expandedRows={expandedRows}
        toggleRow={toggleRow}
      />

      <ChallengeComparisonCards
        challenges={CHALLENGE_COMPARISON}
        rows={COMPARISON_ROWS}
        expandedRows={expandedRows}
        toggleRow={toggleRow}
      />

      <FrequentComparisonCarousel />
    </section>
  );
};

export default ComparisonSection;
