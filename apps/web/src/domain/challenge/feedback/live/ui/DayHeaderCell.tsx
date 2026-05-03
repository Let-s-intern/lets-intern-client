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
        'flex flex-col items-center gap-4 rounded-sm border border-2 py-5',
        isSelected ? 'border-primary' : 'border-transparent',
      )}
    >
      <span
        className={clsx(
          'text-xssmall16',
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
              'text-medium24 flex h-12 w-12 items-center justify-center font-bold',
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
