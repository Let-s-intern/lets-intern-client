import clsx from 'clsx';
import type { DaySchedule, SelectedSlot } from '../types';
import { TIME_SLOTS } from '../types';
import { toDateString } from '../utils';
import TimeSlotCell from './TimeSlotCell';

const DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일'] as const;

interface Props {
  schedule: DaySchedule[];
  selectedSlot: SelectedSlot | null;
  onSlotSelect: (slot: SelectedSlot) => void;
}

const TimeSlotGrid = ({ schedule, selectedSlot, onSlotSelect }: Props) => {
  const todayStr = toDateString(new Date());

  return (
    <div className="overflow-hidden">
      {/* 요일 헤더 */}
      <div className="overflow-y-auto [scrollbar-gutter:stable]">
        <div className="border-neutral-80 mb-0.5 grid grid-cols-[repeat(8,1fr)] border-b">
          <div className="border-neutral-80 text-xxsmall16 text-neutral-10 flex flex-col items-center justify-center border-r py-3 text-center leading-tight">
            <span>멘토링</span>
            <span>시작 시간</span>
          </div>
          {schedule.map((day, i) => {
            const date = new Date(day.date);
            const isSunday = date.getDay() === 0;
            const isToday = day.date === todayStr;
            const isSelected = selectedSlot?.date === day.date;

            return (
              <div
                key={day.date}
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
                  {DAY_NAMES[i]}
                </span>
                <div>
                  {isToday ? (
                    <span className="bg-primary text-medium24 flex h-12 w-12 items-center justify-center rounded-full font-bold text-white">
                      {date.getDate()}
                    </span>
                  ) : (
                    <span
                      className={clsx(
                        'text-medium24 flex h-12 w-12 items-center justify-center font-bold',
                        isSunday ? 'text-red-500' : 'text-neutral-10',
                      )}
                    >
                      {date.getDate()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 시간 행 (스크롤) */}
      <div className="max-h-[513px] overflow-y-auto [scrollbar-gutter:stable]">
        {TIME_SLOTS.map((time, i) => (
          <div
            key={time}
            className={clsx(
              'border-neutral-80 grid grid-cols-[repeat(8,1fr)] border-b',
              i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]',
            )}
          >
            <div
              className={clsx(
                'border-neutral-80 text-xsmall16 text-neutral-20 flex h-10 items-center justify-center border-r font-medium',
                i % 2 === 0 ? 'bg-white' : 'bg-[#F5F6FF]',
              )}
            >
              {time}
            </div>
            {schedule.map((day) => (
              <TimeSlotCell
                key={day.date}
                status={day.slots[time] ?? 'unavailable'}
                isSelected={
                  selectedSlot?.date === day.date && selectedSlot?.time === time
                }
                date={day.date}
                time={time}
                onSelect={onSlotSelect}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotGrid;
