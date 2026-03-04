'use client';

interface WeeklySummaryProps {
  totalCount: number;
  todayDueCount: number;
  incompleteCount: number;
}

const summaryCards = [
  { label: '이번주 전체', key: 'totalCount' as const },
  { label: '오늘 마감', key: 'todayDueCount' as const },
  { label: '미완료', key: 'incompleteCount' as const },
];

const WeeklySummary = ({
  totalCount,
  todayDueCount,
  incompleteCount,
}: WeeklySummaryProps) => {
  const values = { totalCount, todayDueCount, incompleteCount };

  return (
    <div className="grid grid-cols-3 gap-4">
      {summaryCards.map((card) => (
        <div
          key={card.key}
          className="rounded-lg border border-neutral-200 bg-white px-5 py-4"
        >
          <p className="text-sm text-neutral-500">{card.label}</p>
          <p className="mt-1 text-3xl font-bold text-neutral-900">
            {values[card.key]}
          </p>
        </div>
      ))}
    </div>
  );
};

export default WeeklySummary;
