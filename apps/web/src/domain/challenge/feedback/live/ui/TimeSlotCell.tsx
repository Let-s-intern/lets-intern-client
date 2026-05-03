import clsx from 'clsx';
import type { SelectedSlot, SlotStatus } from '../types';

interface Props {
  status: SlotStatus;
  isSelected: boolean;
  date: string;
  time: string;
  onSelect: (slot: SelectedSlot) => void;
}

const STATUS_CONFIG: Record<SlotStatus, { label: string; className: string }> =
  {
    expired: { label: '시간 종료', className: 'font-regular text-neutral-70' },
    unavailable: { label: '운영 안함', className: 'text-neutral-70' },
    booked: { label: '예약 완료', className: 'bg-[#fef4f3] text-system-error' },
    available: {
      label: '예약 가능',
      className: 'cursor-pointer bg-[#edf7f2] text-secondary',
    },
  };

const TimeSlotCell = ({ status, isSelected, date, time, onSelect }: Props) => {
  const { label, className } = STATUS_CONFIG[status];

  return (
    <div
      onClick={
        status === 'available' ? () => onSelect({ date, time }) : undefined
      }
      className={clsx(
        'text-xsmall14 flex items-center justify-center border text-center',
        isSelected
          ? 'border-primary rounded-xs text-primary border-2'
          : ['border-transparent', className],
      )}
    >
      {label}
    </div>
  );
};

export default TimeSlotCell;
