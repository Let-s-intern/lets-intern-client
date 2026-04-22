'use client';

import { addDays, format, startOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useMemo, useState } from 'react';

import BaseModal from '@/common/modal/BaseModal';

import type { MentorOpenSlot } from '../challenge-content/mentorOpenScheduleMock';

const WEEK_DAYS = ['월', '화', '수', '목', '금', '토', '일'] as const;
const START_HOUR = 9;
const END_HOUR = 17;
const SLOT_MINUTE_STEP = 30;

function createTimeSlots(): string[] {
  const slots: string[] = [];

  for (let hour = START_HOUR; hour <= END_HOUR; hour += 1) {
    for (let minute = 0; minute < 60; minute += SLOT_MINUTE_STEP) {
      if (hour === END_HOUR && minute > 0) continue;
      const hh = String(hour).padStart(2, '0');
      const mm = String(minute).padStart(2, '0');
      slots.push(`${hh}:${mm}`);
    }
  }

  return slots;
}

const TIME_SLOTS = createTimeSlots();

function toKey(dayIndex: number, time: string): string {
  return `${dayIndex}|${time}`;
}

function toTimeLabel(time: string): string {
  return time;
}

function toInitialSet(slots: MentorOpenSlot[]): Set<string> {
  return new Set(slots.map((slot) => toKey(slot.dayIndex, slot.time)));
}

interface MentorOpenScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSlots: MentorOpenSlot[];
  onSave: (slots: MentorOpenSlot[]) => void;
}

const MentorOpenScheduleModal = ({
  isOpen,
  onClose,
  initialSlots,
  onSave,
}: MentorOpenScheduleModalProps) => {
  const [weekStart, setWeekStart] = useState<Date>(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    () => new Set(),
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'select' | 'deselect' | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedKeys(toInitialSet(initialSlots));
  }, [isOpen, initialSlots]);

  useEffect(() => {
    if (!isDragging) return;

    const stopDrag = () => {
      setIsDragging(false);
      setDragMode(null);
    };

    window.addEventListener('mouseup', stopDrag);

    return () => {
      window.removeEventListener('mouseup', stopDrag);
    };
  }, [isDragging]);

  const days = useMemo(
    () => WEEK_DAYS.map((_, index) => addDays(weekStart, index)),
    [weekStart],
  );

  const selectedCount = selectedKeys.size;

  const handleCellMouseDown = (dayIndex: number, time: string) => {
    const key = toKey(dayIndex, time);

    setSelectedKeys((prev) => {
      const next = new Set(prev);
      const isSelected = next.has(key);

      if (isSelected) {
        next.delete(key);
        setDragMode('deselect');
      } else {
        next.add(key);
        setDragMode('select');
      }

      return next;
    });

    setIsDragging(true);
  };

  const handleCellMouseEnter = (dayIndex: number, time: string) => {
    if (!isDragging || !dragMode) return;

    const key = toKey(dayIndex, time);

    setSelectedKeys((prev) => {
      const next = new Set(prev);

      if (dragMode === 'select') {
        next.add(key);
      } else {
        next.delete(key);
      }

      return next;
    });
  };

  const handlePrevWeek = () => {
    setWeekStart((prev) => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setWeekStart((prev) => addDays(prev, 7));
  };

  const handleSave = () => {
    const nextSlots: MentorOpenSlot[] = [];

    for (const key of selectedKeys) {
      const [dayIndexText, time] = key.split('|');
      nextSlots.push({ dayIndex: Number(dayIndexText), time });
    }

    nextSlots.sort((a, b) => {
      if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex;
      return a.time.localeCompare(b.time);
    });

    onSave(nextSlots);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-h-[90vh] max-w-[980px] overflow-hidden"
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-neutral-85 px-6 py-5">
          <h2 className="text-medium20 font-semibold text-neutral-10">
            멘토 일정 오픈하기
          </h2>
          <p className="mt-1 text-xsmall14 text-neutral-40">
            클릭 또는 드래그로 가능 시간을 설정해 주세요.
          </p>
        </div>

        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-small18 font-semibold text-neutral-10">
                주간 일정표
              </p>
              <p className="text-xsmall14 text-neutral-40">
                {format(weekStart, 'yyyy년 M월', { locale: ko })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevWeek}
                className="h-8 rounded-md border border-neutral-80 px-3 text-xsmall14 text-neutral-40"
              >
                이전 주
              </button>
              <button
                type="button"
                onClick={handleNextWeek}
                className="h-8 rounded-md border border-neutral-80 px-3 text-xsmall14 text-neutral-40"
              >
                다음 주
              </button>
            </div>
          </div>

          <div className="mb-4 rounded-md bg-primary-5 px-3 py-2 text-xsmall14 text-primary-90">
            마우스로 드래그하여 여러 시간대를 선택한 후 "저장하기" 버튼을
            클릭하세요. 저장하기 전까지는 임시 상태입니다.
          </div>

          <div className="overflow-hidden rounded-md border border-neutral-85">
            <div className="grid select-none grid-cols-[72px_repeat(7,minmax(88px,1fr))]">
              <div className="bg-neutral-98 border-b border-r border-neutral-85 px-2 py-2 text-center text-xsmall14 font-medium text-neutral-40">
                시간
              </div>
              {days.map((day, index) => (
                <div
                  key={index}
                  className="bg-neutral-98 border-b border-r border-neutral-85 px-2 py-2 text-center last:border-r-0"
                >
                  <p className="text-xxsmall12 text-neutral-40">
                    {WEEK_DAYS[index]}
                  </p>
                  <p className="text-small18 font-semibold text-neutral-10">
                    {format(day, 'd')}
                  </p>
                </div>
              ))}

              {TIME_SLOTS.map((time) => (
                <div key={`row-${time}`} className="contents">
                  <div className="border-b border-r border-neutral-85 bg-white px-2 py-2 text-center text-xsmall14 text-neutral-40">
                    {toTimeLabel(time)}
                  </div>
                  {WEEK_DAYS.map((_, dayIndex) => {
                    const key = toKey(dayIndex, time);
                    const isSelected = selectedKeys.has(key);

                    return (
                      <button
                        key={`${time}-${dayIndex}`}
                        type="button"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          handleCellMouseDown(dayIndex, time);
                        }}
                        onMouseEnter={() =>
                          handleCellMouseEnter(dayIndex, time)
                        }
                        className={`border-b border-r border-neutral-90 px-2 py-2 text-center text-xsmall14 transition-colors last:border-r-0 ${
                          isSelected
                            ? 'bg-primary-10 font-semibold text-primary'
                            : 'bg-neutral-98 text-neutral-40'
                        }`}
                      >
                        {isSelected ? '가능' : '불가능'}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-85 px-6 py-4">
          <p className="text-xsmall14 text-neutral-40">
            선택된 가능 시간: {selectedCount}개
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-neutral-80 px-4 py-2 text-xsmall14 font-medium text-neutral-40"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-md bg-primary px-4 py-2 text-xsmall14 font-semibold text-white"
            >
              저장하기
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default MentorOpenScheduleModal;
