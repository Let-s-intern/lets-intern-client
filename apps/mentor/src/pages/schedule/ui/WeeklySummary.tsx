'use client';

interface WeeklySummaryProps {
  totalCount: number;
  todayDueCount: number;
  incompleteCount: number;
  completedCount: number;
}

function SummaryCard({
  label,
  labelClassName,
  children,
}: {
  label: string;
  labelClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-neutral-80 flex rounded-xl border bg-white p-4 md:p-6">
      <div className="flex flex-1 flex-col gap-3">
        <p
          className={
            labelClassName ?? 'text-xsmall14 text-neutral-30 font-semibold'
          }
        >
          {label}
        </p>
        {children}
      </div>
    </div>
  );
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
    <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
      <SummaryCard label="전체">
        <p className="text-medium24 text-neutral-30 font-semibold">
          {totalCount}
        </p>
      </SummaryCard>
      <SummaryCard
        label="오늘마감"
        labelClassName="text-[13px] font-semibold leading-4 text-primary"
      >
        <p className="text-medium24 text-neutral-30 font-semibold">
          {todayDueCount}
        </p>
      </SummaryCard>
      <SummaryCard
        label="미완료"
        labelClassName="text-[13px] font-semibold leading-4 text-[#f64e39]"
      >
        <p className="text-medium24 text-neutral-30 font-semibold">
          {incompleteCount}
        </p>
      </SummaryCard>
      <SummaryCard
        label="진행상황"
        labelClassName="text-[13px] font-semibold leading-4 text-neutral-30"
      >
        <div className="flex flex-col items-start justify-center gap-1">
          <p className="text-medium24 text-neutral-30 font-semibold">
            {progressRate}%
          </p>
          <div className="bg-neutral-95 h-3 w-full max-w-[180px] overflow-hidden rounded-full">
            <div
              className="bg-primary-light h-full min-w-[34px] max-w-full rounded-full transition-all"
              style={{ width: `${progressRate}%` }}
            />
          </div>
        </div>
      </SummaryCard>
    </div>
  );
};

export default WeeklySummary;
