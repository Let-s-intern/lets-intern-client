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
    <div className="flex rounded-[16px] border border-neutral-80 bg-white p-4 md:p-6">
      <div className="flex flex-1 flex-col gap-3">
        <p
          className={
            labelClassName ??
            'text-xsmall14 font-semibold text-neutral-30'
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
      <SummaryCard label="이번주 전체">
        <p className="text-medium24 font-semibold text-neutral-30">
          {totalCount}
        </p>
      </SummaryCard>
      <SummaryCard
        label="오늘 마감"
        labelClassName="text-[13px] font-semibold leading-4 text-primary"
      >
        <p className="text-medium24 font-semibold text-neutral-30">
          {todayDueCount}
        </p>
      </SummaryCard>
      <SummaryCard
        label="미완료"
        labelClassName="text-[13px] font-semibold leading-4 text-[#f64e39]"
      >
        <p className="text-medium24 font-semibold text-neutral-30">
          {incompleteCount}
        </p>
      </SummaryCard>
      <SummaryCard
        label="진행률"
        labelClassName="text-[13px] font-semibold leading-4 text-neutral-30"
      >
        <div className="flex flex-col items-start justify-center gap-1">
          <p className="text-medium24 font-semibold text-neutral-30">
            {progressRate}%
          </p>
          <div className="h-3 w-full max-w-[180px] overflow-hidden rounded-full bg-neutral-95">
            <div
              className="h-full min-w-[34px] max-w-full rounded-full bg-primary-light transition-all"
              style={{ width: `${progressRate}%` }}
            />
          </div>
        </div>
      </SummaryCard>
    </div>
  );
};

export default WeeklySummary;
