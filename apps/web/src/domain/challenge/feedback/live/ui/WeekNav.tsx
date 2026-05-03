import { formatWeekRange } from '../utils';

interface Props {
  weekStart: Date;
  onPrev: () => void;
  onNext: () => void;
}

const WeekNav = ({ weekStart, onPrev, onNext }: Props) => (
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={onPrev}
      className="hover:bg-primary-5 rounded-full p-1"
    >
      <img src="/icons/Chevron_Left_MD.svg" alt="<" className="h-4 w-4" />
    </button>
    <span className="text-xsmall16 min-w-[100px] text-center font-medium">
      {formatWeekRange(weekStart)}
    </span>
    <button
      type="button"
      onClick={onNext}
      className="hover:bg-primary-5 rounded-full p-1"
    >
      <img src="/icons/Chevron_Right_MD.svg" alt=">" className="h-4 w-4" />
    </button>
  </div>
);

export default WeekNav;
