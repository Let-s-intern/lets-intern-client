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
  const progressRate =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="flex-1 rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex flex-col items-center gap-3">
          <p className="self-stretch text-sm font-semibold text-neutral-600">
            이번주 전체
          </p>
          <p className="self-stretch text-2xl font-semibold text-neutral-600">
            {totalCount}
          </p>
        </div>
      </div>
      <div className="flex-1 rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex flex-col items-center gap-3">
          <p className="self-stretch text-xs font-semibold text-primary">
            오늘 마감
          </p>
          <p className="self-stretch text-2xl font-semibold text-neutral-600">
            {todayDueCount}
          </p>
        </div>
      </div>
      <div className="flex-1 rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex flex-col items-center gap-3">
          <p className="self-stretch text-xs font-semibold text-red-500">
            미완료
          </p>
          <p className="self-stretch text-2xl font-semibold text-neutral-600">
            {incompleteCount}
          </p>
        </div>
      </div>
      <div className="flex-1 rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex flex-col items-center gap-3">
          <p className="self-stretch text-xs font-semibold text-neutral-600">
            진행률
          </p>
          <div className="flex self-stretch flex-col items-start justify-center gap-1">
            <p className="text-2xl font-semibold text-neutral-600">
              {progressRate}%
            </p>
            <div className="h-3 w-44 overflow-hidden rounded-[400px] bg-neutral-100">
              <div
                className="h-full min-w-[2rem] max-w-full rounded-[400px] bg-primary-light transition-all"
                style={{ width: `${progressRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySummary;
