import clsx from 'clsx';

interface Props {
  dayName: string;
  dateStr: string;
  isSelected: boolean;
  isToday: boolean;
}

const DayHeaderCell = ({ dayName, dateStr, isSelected, isToday }: Props) => {
  const date = new Date(dateStr);
  const isSunday = date.getDay() === 6;
  const dayNum = date.getDate();

  return (
    <div
      className={clsx(
        'flex flex-col items-center gap-2 rounded-sm border-2 py-2 md:gap-4 md:py-5',
        isSelected ? 'border-primary' : 'border-transparent',
      )}
    >
      <span
        className={clsx(
          'md:text-xsmall16 text-xxsmall12',
          isSunday ? 'text-red-500' : 'text-neutral-10',
        )}
      >
        {dayName}
      </span>
      <div>
        {isToday ? (
          <span className="bg-primary text-medium24 flex h-12 w-12 items-center justify-center rounded-full font-bold text-white">
            {dayNum}
          </span>
        ) : (
          <span
            className={clsx(
              'text-xsmall16 md:text-medium24 flex h-[30px] w-[22px] items-center justify-center font-bold md:h-12 md:w-12',
              isSunday ? 'text-red-500' : 'text-neutral-10',
            )}
          >
            {dayNum}
          </span>
        )}
      </div>
    </div>
  );
};

export default DayHeaderCell;
