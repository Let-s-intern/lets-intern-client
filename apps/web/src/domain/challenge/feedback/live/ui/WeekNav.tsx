import { formatWeekRange } from '../utils';

interface Props {
  weekStart: Date;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const WeekNav = ({
  weekStart,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
}: Props) => (
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={onPrev}
      disabled={!canGoPrev}
      className="hover:bg-primary-5 rounded-full p-1 disabled:opacity-30"
    >
      <img src="/icons/Chevron_Left_MD.svg" alt="<" className="h-4 w-4" />
    </button>
    <span className="text-xsmall16 min-w-[100px] text-center font-medium">
      {formatWeekRange(weekStart)}
    </span>
    <button
      type="button"
      onClick={onNext}
      disabled={!canGoNext}
      className="hover:bg-primary-5 rounded-full p-1 disabled:opacity-30"
    >
      <img src="/icons/Chevron_Right_MD.svg" alt=">" className="h-4 w-4" />
    </button>
  </div>
);

export default WeekNav;
