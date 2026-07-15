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
        className="border-neutral-80 text-neutral-0 rounded border px-2 py-1 text-sm"
      >
        ‹
      </button>
      <span className="text-xsmall14 text-neutral-0 min-w-[160px] text-center font-medium">
        {formatWeekLabel(weekStart)}
      </span>
      <button
        type="button"
        onClick={onNext}
        aria-label="다음 주"
        className="border-neutral-80 text-neutral-0 rounded border px-2 py-1 text-sm"
      >
        ›
      </button>
      <button
        type="button"
        onClick={onToday}
        className="border-neutral-80 text-neutral-40 ml-1 rounded border px-3 py-1 text-xs"
      >
        오늘
      </button>
    </div>
  );
}
