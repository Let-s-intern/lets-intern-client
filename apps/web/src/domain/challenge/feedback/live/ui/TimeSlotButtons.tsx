import type { SelectedSlot, SlotStatus } from '../types';

interface SlotEntry {
  status: SlotStatus;
  label: string;
}

interface Props {
  date: string;
  slots: Record<string, SlotEntry>;
  selectedSlot: SelectedSlot | null;
  onSlotSelect: (date: string, time: string) => void;
}

const STATE_CLASSES: Record<'selected' | 'unavailable' | 'available', string> =
  {
    selected: 'border-primary font-semibold bg-primary-10 text-primary',
    unavailable:
      'border-neutral-90 bg-neutral-90 text-neutral-60 cursor-default',
    available: 'border-neutral-80 text-neutral-20 hover:bg-neutral-90',
  };

const TimeSlotButtons = ({
  date,
  slots,
  selectedSlot,
  onSlotSelect,
}: Props) => {
  return (
    <div className="grid w-full grid-cols-3 gap-x-4 gap-y-3 md:grid-cols-4">
      {Object.entries(slots).map(([time, { status, label }]) => {
        const isSelected =
          selectedSlot?.date === date && selectedSlot?.time === time;
        const isUnavailable =
          status === 'unavailable' ||
          status === 'expired' ||
          status === 'booked';

        const slotState = isSelected
          ? 'selected'
          : isUnavailable
            ? 'unavailable'
            : 'available';

        return (
          <button
            key={time}
            type="button"
            disabled={isUnavailable}
            onClick={() => onSlotSelect(date, time)}
            className={`text-xxsmall12 flex flex-1 items-center justify-center rounded-sm border py-2 transition-colors ${STATE_CLASSES[slotState]}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlotButtons;
