import clsx from 'clsx';
import { memo } from 'react';
import type { SelectedSlot, SlotStatus } from '../types';

interface Props {
  status: SlotStatus;
  isSelected: boolean;
  date: string;
  time: string;
  onSelect: (slot: SelectedSlot) => void;
}

const STATUS_CONFIG: Record<
  SlotStatus,
  { label: string; mobileLabel: string; className: string }
> = {
  expired: {
    label: '시간 종료',
    mobileLabel: '',
    className: 'font-regular text-neutral-70',
  },
  unavailable: {
    label: '운영 안함',
    mobileLabel: '',
    className: 'text-neutral-70',
  },
  booked: {
    label: '예약 마감',
    mobileLabel: '마감',
    className: 'bg-[#fef4f3] text-system-error',
  },
  available: {
    label: '예약 가능',
    mobileLabel: '가능',
    className: 'cursor-pointer bg-[#edf7f2] text-secondary',
  },
};

const TimeSlotCell = memo(
  ({ status, isSelected, date, time, onSelect }: Props) => {
    const { label, mobileLabel, className } = STATUS_CONFIG[status];

    return (
      <div
        onClick={
          status === 'available' ? () => onSelect({ date, time }) : undefined
        }
        className={clsx(
          'text-xxsmall12 md:text-xsmall14 flex items-center justify-center text-center',
          isSelected
            ? 'border-primary rounded-xs text-primary border-2'
            : ['border-neutral-80 border-r', className],
        )}
      >
        <span className="md:hidden">{mobileLabel}</span>
        <span className="hidden md:inline">{label}</span>
      </div>
    );
  },
);

export default TimeSlotCell;
