import { formatWeekLabel } from './weekUtils';

interface WeekNavigatorProps {
  /** 표시 주의 월요일(ISO 자정) */
  weekStart: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

/** 주간 그리드 상단의 이전/다음/오늘 이동 컨트롤. */
export default function WeekNavigator({
  weekStart,
  onPrev,
  onNext,
  onToday,
}: WeekNavigatorProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrev}
        aria-label="이전 주"
        className="rounded border border-neutral-80 px-2 py-1 text-sm text-neutral-0"
      >
        ‹
      </button>
      <span className="min-w-[160px] text-center text-xsmall14 font-medium text-neutral-0">
        {formatWeekLabel(weekStart)}
      </span>
      <button
        type="button"
        onClick={onNext}
        aria-label="다음 주"
        className="rounded border border-neutral-80 px-2 py-1 text-sm text-neutral-0"
      >
        ›
      </button>
      <button
        type="button"
        onClick={onToday}
        className="rounded ml-1 border border-neutral-80 px-3 py-1 text-xs text-neutral-40"
      >
        오늘
      </button>
    </div>
  );
}
