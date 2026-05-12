import type { SelectedSlot, SlotStatus } from '../types';
import { TIME_SLOTS } from '../types';

function formatTimeRange(time: string): string {
  const [hour, minute] = time.split(':').map(Number);
  const endMinutes = hour * 60 + minute + 30;
  const endHour = Math.floor(endMinutes / 60);
  const endMinute = endMinutes % 60;
  const fmt = (h: number, m: number) => `${h}:${String(m).padStart(2, '0')}`;
  return `${fmt(hour, minute)} ~ ${fmt(endHour, endMinute)}`;
}

interface Props {
  date: string;
  slots: Record<string, SlotStatus>;
  selectedSlot: SelectedSlot | null;
  onSlotSelect: (slot: SelectedSlot) => void;
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
      {TIME_SLOTS.map((time) => {
        const status = slots[time] ?? 'unavailable';
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
            onClick={() => onSlotSelect({ date, time })}
            className={`text-xxsmall12 flex flex-1 items-center justify-center rounded-sm border py-2 transition-colors ${STATE_CLASSES[slotState]}`}
          >
            {formatTimeRange(time)}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlotButtons;
