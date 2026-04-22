'use client';

import { addDays, format, startOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useMemo, useState } from 'react';

import BaseModal from '@/common/modal/BaseModal';
import { useMentorAlert } from '@/domain/mentor/hooks/useMentorAlert';
import MentorAlertModal from '@/domain/mentor/ui/MentorAlertModal';

// TODO: 실제 운영진 문의 링크로 교체 (예: 슬랙 채널, 카카오톡 고객센터, 내부 요청 폼 등)
const OPS_CONTACT_URL = 'mailto:letsintern.official@gmail.com?subject=%5B%EB%A9%98%ED%86%A0%5D%20%EC%9D%BC%EC%A0%95%20%EB%B3%80%EA%B2%BD%20%EC%9A%94%EC%B2%AD';

import type {
  AppliedBooking,
  MentorOpenSlot,
} from '../challenge-content/mentorOpenScheduleMock';
import { getColor } from '../constants/colors';
import { currentNow } from '../constants/mockNow';

export interface BlockedSlot {
  /** YYYY-MM-DD */
  date: string;
  /** "HH:mm" */
  time: string;
  colorIndex: number;
  challengeTitle?: string;
  /** 점유 챌린지 id — 스왑 시 해당 챌린지 슬롯에서 제거 */
  challengeId?: number;
  /** 멘티 신청 완료 시 멘티 이름 — 지정되면 스왑 불가 */
  menteeName?: string;
}

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

function toKey(date: string, time: string): string {
  return `${date}|${time}`;
}

function toDateString(d: Date): string {
  return format(d, 'yyyy-MM-dd');
}

function toTimeLabel(time: string): string {
  return time;
}

function toInitialSet(slots: MentorOpenSlot[]): Set<string> {
  return new Set(slots.map((slot) => toKey(slot.date, slot.time)));
}

interface MentorOpenScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSlots: MentorOpenSlot[];
  onSave: (slots: MentorOpenSlot[]) => void;
  /** 현재 편집 중인 챌린지 제목 — 상단 바에 표시 */
  challengeTitle?: string;
  /** 챌린지 컬러 인덱스 — 상단 바 + 선택 셀 색상 */
  colorIndex?: number;
  /** 다른 챌린지가 이미 점유한 슬롯 — 기본은 스왑 가능, menteeName이 있으면 잠김 */
  blockedSlots?: BlockedSlot[];
  /** 현재 챌린지에서 멘티가 이미 신청 완료한 슬롯 — 선택 해제 불가, 이름 표시 */
  appliedBookings?: AppliedBooking[];
  /** 점유 챌린지 슬롯을 현재 챌린지로 이전할 때 호출 (from → to) */
  onSwapFromOtherChallenge?: (
    fromChallengeId: number,
    slot: { date: string; time: string },
  ) => void;
  /** 해당 챌린지에 신청 예정인 멘티 수 — 최소 이만큼 오픈해야 저장 가능 */
  requiredSlotCount?: number;
  /** 상단 우측 "다른 챌린지로 이동" 드롭다운에 노출할 챌린지 목록 */
  otherChallenges?: Array<{
    challengeId: number;
    title: string;
    colorIndex: number;
  }>;
  /** 챌린지 전환 핸들러 */
  onSwitchChallenge?: (challengeId: number) => void;
  /** 기본으로 표시할 주의 날짜 (예: 라이브 피드백 period startDate) — 없으면 "다음 주" */
  focusDate?: string;
}

const MentorOpenScheduleModal = ({
  isOpen,
  onClose,
  initialSlots,
  onSave,
  challengeTitle,
  colorIndex,
  blockedSlots = [],
  appliedBookings = [],
  onSwapFromOtherChallenge,
  requiredSlotCount,
  otherChallenges = [],
  onSwitchChallenge,
  focusDate,
}: MentorOpenScheduleModalProps) => {
  const challengeColor =
    colorIndex !== undefined ? getColor(colorIndex) : null;
  const { alertProps, showConfirm } = useMentorAlert();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  /** 이미 신청 완료된 슬롯 클릭 시 — 챌린지·일시·멘티 정보를 명시 + 운영진 문의 옵션 */
  const handleAppliedSlotClick = (info: {
    menteeName: string;
    challengeTitle: string;
    date: string;
    time: string;
  }) => {
    const dateLabel = format(new Date(info.date), 'M월 d일 (EEE)', {
      locale: ko,
    });
    const description = [
      `${info.challengeTitle}`,
      `${dateLabel} · ${info.time}`,
      '',
      `${info.menteeName}님이 이미 신청 완료한 일정입니다.`,
      '변경이 필요하시면 운영진에게 문의해 주세요.',
    ].join('\n');

    showConfirm({
      title: '이미 신청 완료된 일정입니다',
      description,
      confirmText: '운영진 문의하기',
      cancelText: '확인',
      onConfirm: () => {
        if (typeof window !== 'undefined') {
          window.open(OPS_CONTACT_URL, '_blank', 'noopener,noreferrer');
        }
      },
    });
  };
  // 기본/최소 시작 주: focusDate가 있으면 그 주, 없으면 다음 주 월요일 (이번 주 이전은 편집 불가)
  const minWeekStart = useMemo(() => {
    if (focusDate) {
      return startOfWeek(new Date(focusDate), { weekStartsOn: 1 });
    }
    return addDays(startOfWeek(currentNow(), { weekStartsOn: 1 }), 7);
  }, [focusDate]);
  const [weekStart, setWeekStart] = useState<Date>(() => minWeekStart);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    () => new Set(),
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'select' | 'deselect' | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedKeys(toInitialSet(initialSlots));
    setWeekStart(minWeekStart);
  }, [isOpen, initialSlots, minWeekStart]);

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

  /** key → 해당 슬롯을 점유한 다른 챌린지 정보 */
  const blockedMap = useMemo(() => {
    const map = new Map<string, BlockedSlot>();
    for (const slot of blockedSlots) {
      map.set(toKey(slot.date, slot.time), slot);
    }
    return map;
  }, [blockedSlots]);

  /** key → 현재 챌린지에서 신청 완료된 멘티 이름 */
  const appliedMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const booking of appliedBookings) {
      map.set(toKey(booking.date, booking.time), booking.menteeName);
    }
    return map;
  }, [appliedBookings]);

  const selectedCount = selectedKeys.size;

  const handleCellMouseDown = (date: string, time: string) => {
    const key = toKey(date, time);
    // 다른 챌린지 점유 또는 현재 챌린지에서 이미 신청 완료된 슬롯은 토글 불가
    if (blockedMap.has(key) || appliedMap.has(key)) return;

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

  const handleCellMouseEnter = (date: string, time: string) => {
    if (!isDragging || !dragMode) return;

    const key = toKey(date, time);
    if (blockedMap.has(key) || appliedMap.has(key)) return;

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

  const canGoPrev = weekStart.getTime() > minWeekStart.getTime();
  const handlePrevWeek = () => {
    if (!canGoPrev) return;
    setWeekStart((prev) => {
      const candidate = addDays(prev, -7);
      return candidate.getTime() < minWeekStart.getTime()
        ? minWeekStart
        : candidate;
    });
  };

  const handleNextWeek = () => {
    setWeekStart((prev) => addDays(prev, 7));
  };

  const handleSave = () => {
    const nextSlots: MentorOpenSlot[] = [];

    for (const key of selectedKeys) {
      const [date, time] = key.split('|');
      nextSlots.push({ date, time });
    }

    nextSlots.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });

    onSave(nextSlots);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="flex h-[85vh] max-w-[980px] flex-col overflow-hidden"
    >
      <div className="flex h-full flex-col">
        {/* 챌린지 컬러 상단 바 */}
        {challengeColor && challengeTitle && (
          <div
            className={`relative flex items-center justify-between gap-2 border-b-2 px-6 py-3 ${challengeColor.body} ${challengeColor.border}`}
          >
            <span
              className={`rounded-[3px] px-2 py-1 text-xxsmall12 font-medium text-white ${challengeColor.badge}`}
            >
              {challengeTitle}
            </span>

            {otherChallenges.length > 0 && onSwitchChallenge && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSwitcherOpen((v) => !v)}
                  className="inline-flex items-center gap-1 rounded-md border border-neutral-80 bg-white px-3 py-1.5 text-xxsmall12 font-medium text-neutral-30 transition-colors hover:bg-neutral-95"
                >
                  다른 챌린지로 이동
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    className={`transition-transform ${isSwitcherOpen ? 'rotate-180' : ''}`}
                  >
                    <path
                      d="M2 3.5L5 6.5L8 3.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {isSwitcherOpen && (
                  <div className="absolute right-0 top-full z-30 mt-1 min-w-[220px] rounded-md border border-neutral-80 bg-white shadow-lg">
                    <ul className="py-1">
                      {otherChallenges.map((c) => {
                        const itemColor = getColor(c.colorIndex);
                        return (
                          <li key={c.challengeId}>
                            <button
                              type="button"
                              onClick={() => {
                                onSwitchChallenge(c.challengeId);
                                setIsSwitcherOpen(false);
                              }}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xxsmall12 font-medium text-neutral-20 hover:bg-neutral-95"
                            >
                              <span
                                className={`h-2 w-2 shrink-0 rounded-full ${itemColor.badge}`}
                              />
                              <span className="truncate">{c.title}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="border-b border-neutral-85 px-6 py-5">
          <h2 className="text-medium20 font-semibold text-neutral-10">
            멘토 일정 오픈하기
          </h2>
          <p className="mt-1 text-xsmall14 text-neutral-40">
            클릭 또는 드래그로 가능 시간을 설정해 주세요.
            {blockedSlots.length > 0 && (
              <>
                {' '}
                <span className="text-neutral-30">
                  다른 챌린지가 이미 점유한 시간대는 선택할 수 없습니다.
                </span>
              </>
            )}
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
                disabled={!canGoPrev}
                className="h-8 rounded-md border border-neutral-80 px-3 text-xsmall14 text-neutral-40 transition-colors hover:bg-neutral-95 disabled:cursor-not-allowed disabled:border-neutral-85 disabled:bg-neutral-95 disabled:text-neutral-50"
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

          <div className="mb-4 flex flex-col gap-1 rounded-md bg-primary-5 px-3 py-2 text-xsmall14 text-primary-90">
            <p>
              · 마우스로 드래그하여 여러 시간대를 선택한 후 "저장하기" 버튼을
              클릭하세요. 저장하기 전까지는 임시 상태입니다.
            </p>
            {requiredSlotCount !== undefined && (
              <p>
                · 신청 예정인 멘티가{' '}
                <span className="font-semibold">{requiredSlotCount}명</span>
                이므로 최소 {requiredSlotCount}개 이상의 시간대를 열어야 저장할
                수 있습니다.
              </p>
            )}
            <p>
              · 멘티가 이미 신청 완료한 시간은 변경할 수 없습니다.
            </p>
            <p>
              · 다른 챌린지가 점유한 시간은 선택할 수 없으며, 클릭 시 현재
              챌린지로 이전할 수 있습니다.
            </p>
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
                    const cellDate = toDateString(days[dayIndex]);
                    const key = toKey(cellDate, time);
                    const isSelected = selectedKeys.has(key);
                    const blocker = blockedMap.get(key);
                    const currentMenteeName = appliedMap.get(key);

                    // 현재 챌린지에서 이미 신청 완료 → 잠김 + 멘티 이름 (클릭 시 안내)
                    if (currentMenteeName) {
                      const lockedClass = challengeColor
                        ? `${challengeColor.body} ${challengeColor.text}`
                        : 'bg-primary-10 text-primary';
                      return (
                        <button
                          key={`${time}-${dayIndex}`}
                          type="button"
                          onClick={() =>
                            handleAppliedSlotClick({
                              menteeName: currentMenteeName,
                              challengeTitle: challengeTitle ?? '현재 챌린지',
                              date: cellDate,
                              time,
                            })
                          }
                          title={`${currentMenteeName}님 신청 완료 — 클릭해 안내 확인`}
                          className={`border-b border-r border-neutral-90 px-2 py-1.5 text-center text-xsmall14 font-medium opacity-80 transition-opacity last:border-r-0 hover:opacity-70 ${lockedClass}`}
                        >
                          <span className="flex flex-col leading-tight">
                            <span className="text-xxsmall12 font-normal opacity-70">
                              신청 완료
                            </span>
                            <span className="truncate">
                              {currentMenteeName}님
                            </span>
                          </span>
                        </button>
                      );
                    }

                    if (blocker) {
                      const blockerColor = getColor(blocker.colorIndex);
                      const isLocked = !!blocker.menteeName;
                      const handleBlockerClick = () => {
                        if (isLocked) {
                          handleAppliedSlotClick({
                            menteeName: blocker.menteeName!,
                            challengeTitle:
                              blocker.challengeTitle ?? '다른 챌린지',
                            date: cellDate,
                            time,
                          });
                          return;
                        }
                        if (
                          !onSwapFromOtherChallenge ||
                          blocker.challengeId === undefined
                        )
                          return;
                        showConfirm({
                          title: '이 일정을 지금 챌린지로 옮길까요?',
                          description: `현재 '${blocker.challengeTitle ?? '다른 챌린지'}'가 점유한 시간대입니다.`,
                          confirmText: '옮기기',
                          cancelText: '취소',
                          onConfirm: () => {
                            onSwapFromOtherChallenge(blocker.challengeId!, {
                              date: cellDate,
                              time,
                            });
                            setSelectedKeys((prev) => {
                              const next = new Set(prev);
                              next.add(key);
                              return next;
                            });
                          },
                        });
                      };
                      return (
                        <button
                          key={`${time}-${dayIndex}`}
                          type="button"
                          onClick={handleBlockerClick}
                          title={
                            isLocked
                              ? `${blocker.menteeName}님 신청 완료 — 클릭해 안내 확인`
                              : blocker.challengeTitle
                                ? `${blocker.challengeTitle} 일정 · 클릭 시 현재 챌린지로 이동`
                                : '다른 챌린지 일정'
                          }
                          className={`border-b border-r border-neutral-90 px-2 py-1.5 text-center text-xsmall14 font-medium transition-opacity last:border-r-0 hover:opacity-70 ${blockerColor.body} ${blockerColor.text} ${
                            isLocked ? 'opacity-80' : ''
                          }`}
                        >
                          {isLocked ? (
                            <span className="flex flex-col leading-tight">
                              <span className="text-xxsmall12 font-normal opacity-70">
                                신청 완료
                              </span>
                              <span className="truncate">
                                {blocker.menteeName}님
                              </span>
                            </span>
                          ) : (
                            '다른 일정'
                          )}
                        </button>
                      );
                    }

                    const selectedClass = challengeColor
                      ? `${challengeColor.body} ${challengeColor.text} font-semibold`
                      : 'bg-primary-10 font-semibold text-primary';

                    return (
                      <button
                        key={`${time}-${dayIndex}`}
                        type="button"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          handleCellMouseDown(cellDate, time);
                        }}
                        onMouseEnter={() =>
                          handleCellMouseEnter(cellDate, time)
                        }
                        className={`border-b border-r border-neutral-90 px-2 py-2 text-center text-xsmall14 transition-colors last:border-r-0 ${
                          isSelected
                            ? selectedClass
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
          {requiredSlotCount !== undefined ? (
            (() => {
              const hasEnough = selectedCount >= requiredSlotCount;
              return (
                <p className="text-xsmall14">
                  <span className="text-neutral-40">신청 멘티 </span>
                  <span className="font-semibold text-neutral-10">
                    {requiredSlotCount}명
                  </span>
                  <span className="text-neutral-40"> · 열어둔 시간 </span>
                  <span
                    className={`font-semibold ${
                      hasEnough ? 'text-primary' : 'text-red-500'
                    }`}
                  >
                    {selectedCount}개
                  </span>
                  {!hasEnough && (
                    <span className="ml-2 text-red-500">
                      {requiredSlotCount - selectedCount}개 더 필요
                    </span>
                  )}
                </p>
              );
            })()
          ) : (
            <p className="text-xsmall14 text-neutral-40">
              선택된 가능 시간: {selectedCount}개
            </p>
          )}
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
              disabled={
                requiredSlotCount !== undefined &&
                selectedCount < requiredSlotCount
              }
              className="rounded-md bg-primary px-4 py-2 text-xsmall14 font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-neutral-80 disabled:text-neutral-50"
            >
              저장하기
            </button>
          </div>
        </div>
      </div>

      <MentorAlertModal {...alertProps} />
    </BaseModal>
  );
};

export default MentorOpenScheduleModal;
