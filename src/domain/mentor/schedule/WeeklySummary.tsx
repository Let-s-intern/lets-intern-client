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
    <div className="flex gap-6">
      <div className="flex flex-1 rounded-[16px] border border-neutral-80 bg-white p-6">
        <div className="flex flex-1 flex-col gap-3">
          <p className="text-xsmall14 font-semibold text-neutral-30">
            이번주 전체
          </p>
          <p className="text-medium24 font-semibold text-neutral-30">
            {totalCount}
          </p>
        </div>
      </div>
      <div className="flex flex-1 rounded-[16px] border border-neutral-80 bg-white p-6">
        <div className="flex flex-1 flex-col gap-3">
          <p className="text-[13px] font-semibold leading-4 text-primary">
            오늘 마감
          </p>
          <p className="text-medium24 font-semibold text-neutral-30">
            {todayDueCount}
          </p>
        </div>
      </div>
      <div className="flex flex-1 rounded-[16px] border border-neutral-80 bg-white p-6">
        <div className="flex flex-1 flex-col gap-3">
          <p className="text-[13px] font-semibold leading-4 text-[#f64e39]">
            미완료
          </p>
          <p className="text-medium24 font-semibold text-neutral-30">
            {incompleteCount}
          </p>
        </div>
      </div>
      <div className="flex flex-1 rounded-[16px] border border-neutral-80 bg-white p-6">
        <div className="flex flex-1 flex-col gap-3">
          <p className="text-[13px] font-semibold leading-4 text-neutral-30">
            진행률
          </p>
          <div className="flex flex-col items-start justify-center gap-1">
            <p className="text-medium24 font-semibold text-neutral-30">
              {progressRate}%
            </p>
            <div className="h-3 w-[180px] overflow-hidden rounded-full bg-neutral-95">
              <div
                className="h-full min-w-[34px] max-w-full rounded-full bg-primary-light transition-all"
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
