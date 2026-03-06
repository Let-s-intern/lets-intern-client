'use client';

interface WeeklySummaryProps {
  totalCount: number;
  todayDueCount: number;
  incompleteCount: number;
  completedCount: number;
}

const WeeklySummary = ({
  totalCount,
  todayDueCount,
  incompleteCount,
  completedCount,
}: WeeklySummaryProps) => {
  const progressRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="rounded-lg border border-neutral-200 bg-white px-5 py-4">
        <p className="text-sm text-neutral-500">이번주 전체</p>
        <p className="mt-1 text-3xl font-bold text-neutral-900">{totalCount}</p>
      </div>
      <div className="rounded-lg border border-neutral-200 bg-white px-5 py-4">
        <p className="text-sm text-primary">오늘 마감</p>
        <p className="mt-1 text-3xl font-bold text-neutral-900">{todayDueCount}</p>
      </div>
      <div className="rounded-lg border border-neutral-200 bg-white px-5 py-4">
        <p className="text-sm text-red-500">미완료</p>
        <p className="mt-1 text-3xl font-bold text-neutral-900">{incompleteCount}</p>
      </div>
      <div className="rounded-lg border border-neutral-200 bg-white px-5 py-4">
        <p className="text-sm text-purple-500">진행률</p>
        <p className="mt-1 text-3xl font-bold text-neutral-900">{progressRate}%</p>
        <div className="mt-2 h-2 w-full rounded-full bg-neutral-200">
          <div
            className="h-2 rounded-full bg-purple-500 transition-all"
            style={{ width: `${progressRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default WeeklySummary;
