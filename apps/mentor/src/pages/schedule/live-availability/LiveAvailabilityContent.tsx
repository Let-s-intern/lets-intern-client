import { addDays, format, startOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useMemo, useState } from 'react';

import { useMentorAlert } from '@/hooks/useMentorAlert';
import OutlinedButton from '@/common/button/OutlinedButton';
import MentorAlertModal from '@/common/modal/MentorAlertModal';

import type {
  AppliedBooking,
  MentorOpenSlot,
} from '../challenge-content/mentorOpenScheduleMock';
import { currentNow } from '../constants/mockNow';

// TODO: 실제 운영진 문의 링크로 교체 (예: 슬랙 채널, 카카오톡 고객센터, 내부 요청 폼 등)
const OPS_CONTACT_URL =
  'mailto:letsintern.official@gmail.com?subject=%5B%EB%A9%98%ED%86%A0%5D%20%EC%9D%BC%EC%A0%95%20%EB%B3%80%EA%B2%BD%20%EC%9A%94%EC%B2%AD';

export interface BlockedSlot {
  /** YYYY-MM-DD */
  date: string;
  /** "HH:mm" */
  time: string;
  challengeTitle?: string;
  /** 점유 챌린지 id — 스왑 시 해당 챌린지 슬롯에서 제거 */
  challengeId?: number;
  /** 멘티 신청 완료 시 멘티 이름 — 지정되면 스왑 불가 */
  menteeName?: string;
}

/**
 * 그리드 상단에 노출할 "라이브 피드백 기간" 바 정보.
 * 데이터가 없으면 바를 렌더하지 않는다 (optional prop).
 */
export interface LiveFeedbackPeriodInfo {
  /** 챌린지명 */
  challengeTitle: string;
  /** 기수 (n기) */
  generation?: number;
  /** 회차 (N회차) */
  th?: number;
  /** 예약 인원 */
  reservedCount?: number;
  /** 정원 */
  capacity?: number;
}

const WEEK_DAYS = ['월', '화', '수', '목', '금', '토', '일'] as const;
const START_HOUR = 9;
const END_HOUR = 22;
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

/** 예약 완료 셀/레전드에 쓰는 잠금 아이콘 */
const LockIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    className="shrink-0"
  >
    <rect
      x="5"
      y="11"
      width="14"
      height="9"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M8 11V8a4 4 0 0 1 8 0v3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

function toKey(date: string, time: string): string {
  return `${date}|${time}`;
}

function toDateString(d: Date): string {
  return format(d, 'yyyy-MM-dd');
}

function toInitialSet(slots: MentorOpenSlot[]): Set<string> {
  return new Set(slots.map((slot) => toKey(slot.date, slot.time)));
}

export interface LiveAvailabilityContentProps {
  initialSlots: MentorOpenSlot[];
  /**
   * 저장 핸들러. Promise 를 반환하면 mode='modal' 일 때 완료 후 onClose 가 호출된다.
   * Promise 가 reject 되면 onClose 가 호출되지 않으므로 모달 안에서 에러 토스트를 보여줄 수 있다.
   */
  onSave: (slots: MentorOpenSlot[]) => void | Promise<void>;
  /** 모드: 'modal' = 저장/취소 시 닫기 호출, 'page' = 닫기 호출 없음 */
  mode?: 'modal' | 'page';
  /** 'modal' 모드에서 닫기 콜백 (저장 후 + 취소 시 호출) */
  onClose?: () => void;
  /** 외부에서 컨텐츠를 다시 마운트할 때 초기화 트리거용 (모달의 isOpen 변화 등) */
  resetKey?: unknown;
  /**
   * 상단 바에 노출할 챌린지 이름 목록 — 라이브 피드백이 진행되는 모든 챌린지를 함께 표기.
   * 챌린지 단위 분리 편집을 폐기하고 통합 일정 편집으로 전환되며 추가됨.
   */
  challengeTitles?: string[];
  /** 다른 챌린지가 이미 점유한 슬롯 — 기본은 스왑 가능, menteeName이 있으면 잠김 */
  blockedSlots?: BlockedSlot[];
  /** 현재 챌린지에서 멘티가 이미 신청 완료한 슬롯 — 선택 해제 불가, 이름 표시 */
  appliedBookings?: AppliedBooking[];
  /**
   * BE 에서 받아온 RESERVED 상태 슬롯 — 회색 + "예약 완료" 라벨 + 클릭 비활성.
   * 멘티 이름이 응답에 포함되지 않는 BE API 응답 (mentor2.3) 매핑용.
   */
  reservedSlots?: Array<{ date: string; time: string }>;
  /** 점유 챌린지 슬롯을 현재 챌린지로 이전할 때 호출 (from → to) */
  onSwapFromOtherChallenge?: (
    fromChallengeId: number,
    slot: { date: string; time: string },
  ) => void;
  /** 해당 챌린지에 신청 예정인 멘티 수 — 최소 이만큼 오픈해야 저장 가능 */
  requiredSlotCount?: number;
  /** 기본으로 표시할 주의 날짜 (예: 라이브 피드백 period startDate) — 없으면 "다음 주" */
  focusDate?: string;
  /** 페이지 모드 등에서 헤더 타이틀/설명을 노출할지 여부 (기본 true) */
  showHeader?: boolean;
  /**
   * 헤더 우측 "예약현황 보기" 버튼 클릭 콜백.
   * showHeader 가 true 이고 이 콜백이 있을 때만 버튼이 노출된다.
   */
  onOpenReservation?: () => void;
  /**
   * 그리드 상단에 표시할 그 주의 "라이브 피드백 기간" 바 정보.
   * 미지정 시 바를 렌더하지 않는다.
   */
  livePeriod?: LiveFeedbackPeriodInfo;
}

/**
 * 멘토가 라이브 피드백 가능 시간을 선택/저장하는 콘텐츠 컴포넌트.
 * 모달과 페이지 양쪽에서 동일한 UI/로직을 재사용하기 위해 추출됨.
 */
const LiveAvailabilityContent = ({
  initialSlots,
  onSave,
  mode = 'modal',
  onClose,
  resetKey,
  challengeTitles,
  blockedSlots = [],
  appliedBookings = [],
  reservedSlots = [],
  onSwapFromOtherChallenge,
  requiredSlotCount,
  focusDate,
  showHeader = true,
  onOpenReservation,
  livePeriod,
}: LiveAvailabilityContentProps) => {
  const { alertProps, showConfirm } = useMentorAlert();

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
  const initialKeys = useMemo(() => toInitialSet(initialSlots), [initialSlots]);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    () => new Set(initialKeys),
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'select' | 'deselect' | null>(null);

  // resetKey 변경 시 (모달 재오픈 등) 초기 상태로 리셋
  useEffect(() => {
    setSelectedKeys(toInitialSet(initialSlots));
    setWeekStart(minWeekStart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

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

  /** BE RESERVED 슬롯 key 집합 — 멘티 이름 없는 잠금 표시 */
  const reservedSet = useMemo(() => {
    const set = new Set<string>();
    for (const slot of reservedSlots) {
      set.add(toKey(slot.date, slot.time));
    }
    return set;
  }, [reservedSlots]);

  const selectedCount = selectedKeys.size;

  /** 초기 상태 대비 변경된(추가/삭제된) 셀 개수 — "변경사항 N개" 표기용 */
  const changedKeys = useMemo(() => {
    const set = new Set<string>();
    for (const key of selectedKeys) {
      if (!initialKeys.has(key)) set.add(key);
    }
    for (const key of initialKeys) {
      if (!selectedKeys.has(key)) set.add(key);
    }
    return set;
  }, [selectedKeys, initialKeys]);
  const changedCount = changedKeys.size;

  const handleCellMouseDown = (date: string, time: string) => {
    const key = toKey(date, time);
    // 다른 챌린지 점유 또는 현재 챌린지에서 이미 신청 완료된 슬롯은 토글 불가
    if (blockedMap.has(key) || appliedMap.has(key) || reservedSet.has(key))
      return;

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
    if (blockedMap.has(key) || appliedMap.has(key) || reservedSet.has(key))
      return;

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

  const [isSavingLocal, setIsSavingLocal] = useState(false);
  const handleSave = async () => {
    const nextSlots: MentorOpenSlot[] = [];

    for (const key of selectedKeys) {
      const [date, time] = key.split('|');
      nextSlots.push({ date, time });
    }

    nextSlots.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });

    setIsSavingLocal(true);
    try {
      // onSave 가 Promise 를 반환하면 await — 실패하면 throw 되어 onClose 가 호출되지 않는다.
      await onSave(nextSlots);
      if (mode === 'modal') {
        onClose?.();
      }
    } catch {
      // 호출자에서 에러 처리 — 모달은 열린 채로 두어 토스트 등을 노출할 수 있게 한다.
    } finally {
      setIsSavingLocal(false);
    }
  };

  const handleCancel = () => {
    if (mode === 'modal') {
      onClose?.();
      return;
    }
    // 페이지 모드: 변경 폐기 후 초기 상태로 복귀
    setSelectedKeys(toInitialSet(initialSlots));
  };

  return (
    <div className="flex h-full flex-col">
      {/* 라이브 피드백이 진행되는 모든 챌린지를 한 줄에 태그로 노출 */}
      {challengeTitles && challengeTitles.length > 0 && (
        <div className="border-neutral-80 bg-neutral-95 flex flex-wrap items-center gap-2 border-b px-6 py-3">
          {challengeTitles.map((title) => (
            <span
              key={title}
              className="text-xxsmall12 bg-neutral-30 rounded-[3px] px-2 py-1 font-medium text-white"
            >
              {title}
            </span>
          ))}
        </div>
      )}

      {showHeader && (
        <div className="border-neutral-85 flex items-center justify-between gap-4 border-b px-6 py-5">
          <h2 className="text-medium20 text-neutral-10 font-semibold">
            LIVE 피드백 일정 오픈하기
          </h2>
          {mode === 'modal' && onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="text-neutral-40 hover:text-neutral-10 -mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 py-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-small18 text-neutral-10 font-semibold">
            예약 가능 시간 설정
          </p>
          {showHeader && onOpenReservation && (
            <OutlinedButton
              variant="secondary"
              size="sm"
              onClick={onOpenReservation}
              className="shrink-0"
            >
              예약 현황 보기
            </OutlinedButton>
          )}
        </div>

        {/* 참고사항 배너 — 한 줄 */}
        <div className="bg-primary-5 text-xsmall14 text-primary-90 mb-3 truncate rounded-md px-3 py-2">
          마우스로 드래그하여 여러 시간대를 선택한 후 "저장하기" 버튼을 클릭해야
          최종반영 됩니다, 저장하기 전까지는 임시 상태입니다.
        </div>
        {requiredSlotCount !== undefined && (
          <p className="text-xxsmall12 text-neutral-40 mb-3">
            신청 예정인 멘티가{' '}
            <span className="font-semibold">{requiredSlotCount}명</span>
            이므로 최소 {requiredSlotCount}개 이상의 시간대를 열어야 저장할 수
            있습니다.
          </p>
        )}

        {/* 주 네비(좌) + 레전드(우) — 한 줄 */}
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrevWeek}
              disabled={!canGoPrev}
              aria-label="이전 주"
              className="text-neutral-40 hover:text-neutral-10 disabled:text-neutral-70 flex h-7 w-7 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed"
            >
              ‹
            </button>
            <p className="text-xsmall14 text-neutral-10 font-semibold tabular-nums">
              {format(weekStart, 'MM.dd')} ~{' '}
              {format(addDays(weekStart, 6), 'MM.dd')}
            </p>
            <button
              type="button"
              onClick={handleNextWeek}
              aria-label="다음 주"
              className="text-neutral-40 hover:text-neutral-10 flex h-7 w-7 items-center justify-center rounded-md transition-colors"
            >
              ›
            </button>
          </div>

          {/* 레전드 — 예약 가능 / 예약 완료(잠금) / 변경사항 (우측 한 줄) */}
          <div className="text-xxsmall12 text-neutral-40 flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="bg-primary-10 border-neutral-80 h-3 w-3 rounded-[3px] border" />
              예약 가능
            </span>
            <span className="flex items-center gap-1.5">
              <span className="bg-neutral-90 text-neutral-40 flex h-3 w-3 items-center justify-center rounded-[3px]">
                <LockIcon />
              </span>
              예약 완료
            </span>
            <span className="flex items-center gap-1.5">
              <span className="bg-primary-15 border-primary-40 h-3 w-3 rounded-[3px] border" />
              변경사항
            </span>
          </div>
        </div>

        <div className="border-neutral-85 min-h-0 flex-1 overflow-y-auto rounded-md border">
          <div className="grid select-none grid-cols-[96px_repeat(7,minmax(88px,1fr))]">
            <div className="border-neutral-85 text-xxsmall12 text-neutral-40 sticky top-0 z-10 flex flex-col items-center justify-center border-b border-r bg-white px-2 py-2 text-center font-medium leading-tight">
              <span>멘토링</span>
              <span>시작 시간</span>
            </div>
            {days.map((day, index) => (
              <div
                key={index}
                className="border-neutral-85 sticky top-0 z-10 border-b border-r bg-white px-2 py-2 text-center last:border-r-0"
              >
                <p className="text-xxsmall12 text-neutral-40">
                  {WEEK_DAYS[index]}
                </p>
                <p className="text-small18 text-neutral-10 font-semibold">
                  {format(day, 'd')}
                </p>
              </div>
            ))}

            {/* 날짜 헤더 아래 — 그 주의 라이브 피드백 기간 바(간단 표기). 전체 컬럼 스팬. */}
            {livePeriod && (
              <div className="border-neutral-85 border-primary-20 bg-primary-5 col-span-full flex items-center gap-2 border-b px-3 py-1.5">
                <span className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full" />
                <span className="text-xxsmall12 text-primary-90 min-w-0 truncate font-medium">
                  {livePeriod.challengeTitle}
                  {livePeriod.generation !== undefined &&
                    ` ${livePeriod.generation}기`}
                  {livePeriod.th !== undefined && ` ${livePeriod.th}회차`} LIVE
                  피드백 기간
                </span>
                <span className="text-xxsmall12 text-primary-90 ml-auto flex shrink-0 items-center gap-1 font-semibold">
                  <span aria-hidden>👥</span>
                  {livePeriod.reservedCount ?? 0}/{livePeriod.capacity ?? 0}
                </span>
              </div>
            )}

            {TIME_SLOTS.map((time) => (
              <div key={`row-${time}`} className="contents">
                <div
                  data-time-label
                  className="border-neutral-85 text-xsmall14 text-neutral-40 border-b border-r bg-white px-2 py-2 text-center"
                >
                  {time}
                </div>
                {WEEK_DAYS.map((_, dayIndex) => {
                  const cellDate = toDateString(days[dayIndex]);
                  const key = toKey(cellDate, time);
                  const isSelected = selectedKeys.has(key);
                  const blocker = blockedMap.get(key);
                  const currentMenteeName = appliedMap.get(key);

                  // BE RESERVED 슬롯 → 예약 완료, 잠금 아이콘, 드래그 불가
                  if (reservedSet.has(key)) {
                    return (
                      <div
                        key={`${time}-${dayIndex}`}
                        title="예약이 완료된 시간입니다"
                        aria-disabled="true"
                        className="border-neutral-90 text-xxsmall12 bg-neutral-90 text-neutral-30 flex items-center justify-center gap-1 border-b border-r px-2 py-2 text-center font-medium last:border-r-0"
                      >
                        <LockIcon />
                        <span>예약 완료</span>
                      </div>
                    );
                  }

                  // 현재 챌린지에서 이미 신청 완료 → 잠김 + 멘티 이름 (클릭 시 안내)
                  if (currentMenteeName) {
                    return (
                      <button
                        key={`${time}-${dayIndex}`}
                        type="button"
                        onClick={() =>
                          handleAppliedSlotClick({
                            menteeName: currentMenteeName,
                            challengeTitle:
                              challengeTitles?.join(' · ') ?? '현재 챌린지',
                            date: cellDate,
                            time,
                          })
                        }
                        title={`${currentMenteeName}님 신청 완료 — 클릭해 안내 확인`}
                        className="border-neutral-90 text-xsmall14 bg-primary-10 text-primary border-b border-r px-2 py-1.5 text-center font-medium opacity-80 transition-opacity last:border-r-0 hover:opacity-70"
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
                        className={`border-neutral-90 text-xsmall14 bg-neutral-90 text-neutral-30 border-b border-r px-2 py-1.5 text-center font-medium transition-opacity last:border-r-0 hover:opacity-70 ${
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

                  // 선택됨 + 초기 상태 대비 변경(추가)된 셀 → "변경사항"(연보라 테두리)
                  // 선택됨 + 기존 저장 슬롯 → "예약 가능"
                  // 미선택 → 빈 셀 (예약 불가능 상태 없음)
                  const isChanged = isSelected && changedKeys.has(key);
                  const cellClass = isChanged
                    ? 'bg-primary-15 text-primary font-semibold'
                    : isSelected
                      ? 'bg-primary-10 text-primary font-semibold'
                      : 'bg-white text-neutral-40 hover:bg-neutral-95';

                  return (
                    <button
                      key={`${time}-${dayIndex}`}
                      type="button"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        handleCellMouseDown(cellDate, time);
                      }}
                      onMouseEnter={() => handleCellMouseEnter(cellDate, time)}
                      className={`border-neutral-90 text-xxsmall12 border-b border-r px-2 py-2 text-center transition-colors last:border-r-0 ${cellClass}`}
                    >
                      {isSelected ? '예약 가능' : ''}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-neutral-85 flex items-center justify-between border-t px-6 py-4">
        {requiredSlotCount !== undefined ? (
          (() => {
            const hasEnough = selectedCount >= requiredSlotCount;
            return (
              <p className="text-xsmall14">
                <span className="text-neutral-40">신청 멘티 </span>
                <span className="text-neutral-10 font-semibold">
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
            onClick={handleCancel}
            className="border-neutral-80 text-xsmall14 text-neutral-40 rounded-md border px-4 py-2 font-medium"
          >
            되돌리기
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={
              isSavingLocal ||
              (requiredSlotCount !== undefined &&
                selectedCount < requiredSlotCount)
            }
            className="bg-primary text-xsmall14 hover:bg-primary-hover disabled:bg-neutral-80 rounded-md px-4 py-2 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:text-neutral-50"
          >
            {isSavingLocal
              ? '저장 중...'
              : changedCount > 0
                ? `변경사항 ${changedCount}개 저장하기`
                : '저장하기'}
          </button>
        </div>
      </div>

      <MentorAlertModal {...alertProps} />
    </div>
  );
};

export default LiveAvailabilityContent;
