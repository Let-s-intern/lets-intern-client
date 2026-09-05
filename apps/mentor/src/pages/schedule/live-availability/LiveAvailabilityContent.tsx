import { SLOT_START_TIMES } from '@letscareer/utils';
import { addDays, format, startOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Fragment, useEffect, useMemo, useState } from 'react';

import { useMentorAlert } from '@/hooks/useMentorAlert';
import OutlinedButton from '@/common/button/OutlinedButton';
import MentorAlertModal from '@/common/modal/MentorAlertModal';

import type {
  AppliedBooking,
  MentorOpenSlot,
} from '../challenge-content/mentorOpenScheduleMock';
import { currentNow } from '../constants/mockNow';
import {
  type ScheduleWindow,
  isWithinWindow,
} from '../data/feedbackScheduleRules';
import {
  type ChallengePeriod,
  toChallengePeriodCellKeys,
} from './utils/challengePeriod';

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
  /** 'YYYY-MM-DD' — 이 기간에 해당하는 요일 컬럼에 걸쳐 표시 */
  startDate: string;
  endDate: string;
}

/** 기간 바 색상 팔레트 — 인덱스(i % 3)별 순환 */
const PERIOD_COLORS = [
  'border-green-200 bg-green-50 text-green-700',
  'border-amber-200 bg-amber-50 text-amber-700',
  'border-primary-20 bg-primary-5 text-primary',
];

const WEEK_DAYS = ['월', '화', '수', '목', '금', '토', '일'] as const;

/**
 * 슬롯 시각 목록은 `@letscareer/utils` 가 정한다. 여기서 다시 만들지 않는다.
 *
 * 예전에는 이 파일이 09:00~22:00 만 만들었다(22:30 을 명시적으로 건너뛰었다).
 * 멘티 화면은 22:30 까지 열려 있어 범위가 어긋나 있었고, 어드민은 또 다른 상한을
 * 들고 있었다. 정책은 하나인데 세 곳에 따로 적혀 있던 것이 사고의 원인이었다
 * (2026-08-14 운영 문의).
 */
const TIME_SLOTS = SLOT_START_TIMES;

/**
 * 챌린지 기간 셀 안내. 슬롯을 막지 않으므로 "선택할 수 없다"고 쓰지 않는다 —
 * 열 수는 있고, 다만 1대1 신청이 들어오지 않는다는 사실만 알린다.
 */
const CHALLENGE_PERIOD_NOTICE =
  '이 기간은 챌린지 참여자 우선이라 1대1 신청은 받지 않아요.';

/** 안내 배너 앞에 붙는 정보 아이콘 */
const InfoIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    className="shrink-0"
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 11v5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="7.5" r="1.25" fill="currentColor" />
  </svg>
);

/** 기간 바의 예약 인원 표시용 사람 아이콘 (디자인 시안 제공 에셋) */
const PeopleIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden
    className="shrink-0"
  >
    <path
      d="M14 13.3359C14 12.1748 12.8869 11.187 11.3333 10.821M10 13.3359C10 11.8632 8.20914 10.6693 6 10.6693C3.79086 10.6693 2 11.8632 2 13.3359M10 8.66927C11.4728 8.66927 12.6667 7.47536 12.6667 6.0026C12.6667 4.52984 11.4728 3.33594 10 3.33594M6 8.66927C4.52724 8.66927 3.33333 7.47536 3.33333 6.0026C3.33333 4.52984 4.52724 3.33594 6 3.33594C7.47276 3.33594 8.66667 4.52984 8.66667 6.0026C8.66667 7.47536 7.47276 8.66927 6 8.66927Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

/**
 * 이미 지난 시간대인가.
 *
 * 그리드는 주 단위로 앞뒤를 오갈 수 있어 지난 날짜·오늘 지난 시간이 그대로 보인다.
 * 막지 않으면 멘토가 과거 슬롯을 열 수 있고, 서버도 거르지 않아 그대로 저장된다.
 *
 * 멘티가 그 슬롯을 예약할 수는 없다 — 노출용 조회에 24시간 리드타임 필터가 있다.
 * 그래서 남는 피해는 의미 없는 슬롯이 쌓이는 것과, 멘토가 잘못 열었다는 사실을
 * 끝까지 모른다는 것이다.
 */
function isPastCell(date: string, time: string, now: Date): boolean {
  const cellStart = new Date(`${date}T${time}`);
  if (Number.isNaN(cellStart.getTime())) return false;
  return cellStart.getTime() < now.getTime();
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
   * 그리드 상단(날짜 헤더 아래)에 표시할 "라이브 피드백 기간" 바 목록.
   * 각 기간은 현재 보이는 주와 겹치는 요일 컬럼에 걸쳐 렌더된다.
   * 미지정 시 바를 렌더하지 않는다.
   */
  livePeriods?: LiveFeedbackPeriodInfo[];
  /**
   * 슬롯 오픈 허용 기간 — 미션 시작일 -3d 00:00:00 ~ -2d 23:59:59
   * (`feedbackScheduleRules.computeSlotOpenWindow`로 파생).
   * 지정 시 기간 밖에서는 슬롯 선택/저장이 비활성화되고 안내가 노출된다.
   * 미지정/`null`(BE 미션 일자 미반영)이면 게이팅하지 않는다(현행 유지 — forward-compatible).
   */
  slotOpenWindow?: ScheduleWindow | null;
  /**
   * 멘토가 배정된 챌린지의 진행 기간 — 겹치는 셀에 음영과 안내를 붙인다.
   *
   * 이 기간의 슬롯은 서버가 1대1 예약 가능 목록에서 제외한다. 슬롯을 **막지는
   * 않는다** — 챌린지 피드백에 쓰이는 슬롯이라 막으면 챌린지 수용력이 줄어든다.
   * 열되 무슨 일이 벌어지는지 보여준다.
   */
  challengePeriods?: ChallengePeriod[];
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
  livePeriods = [],
  slotOpenWindow,
  challengePeriods = [],
}: LiveAvailabilityContentProps) => {
  const { alertProps, showConfirm } = useMentorAlert();

  // 슬롯 오픈 기간 게이팅 — window가 있고 현재 시각이 기간 밖이면 편집·저장을 잠근다.
  // window 미지정(BE 미션 일자 미반영)이면 게이팅하지 않는다(폴백 = 현행 유지).
  const isSlotOpenClosed = useMemo(
    () => !!slotOpenWindow && !isWithinWindow(currentNow(), slotOpenWindow),
    [slotOpenWindow],
  );

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
  // 기본 시작 주: focusDate가 있으면 그 주, 없으면 이번 주 월요일 (주 이동 제한 없음)
  const initialWeekStart = useMemo(() => {
    if (focusDate) {
      return startOfWeek(new Date(focusDate), { weekStartsOn: 1 });
    }
    return startOfWeek(currentNow(), { weekStartsOn: 1 });
  }, [focusDate]);
  const [weekStart, setWeekStart] = useState<Date>(() => initialWeekStart);
  const initialKeys = useMemo(() => toInitialSet(initialSlots), [initialSlots]);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    () => new Set(initialKeys),
  );
  // 마지막 저장 시점의 슬롯 집합 — 되돌리기 기준 + 저장 직후 즉시 반영(변경사항 0)용.
  const [savedKeys, setSavedKeys] = useState<Set<string>>(
    () => new Set(initialKeys),
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'select' | 'deselect' | null>(null);

  // resetKey 변경 시 (모달 재오픈 등) 초기 상태로 리셋
  useEffect(() => {
    setSelectedKeys(toInitialSet(initialSlots));
    setSavedKeys(toInitialSet(initialSlots));
    setWeekStart(initialWeekStart);
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

  /** 현재 보이는 주의 7일 'YYYY-MM-DD' 문자열 — 기간 바 컬럼 스팬 계산용 */
  const dayStrs = useMemo(() => days.map(toDateString), [days]);

  /** 현재 주와 겹치는 기간 바 목록 — 헤더 블록 행 수·컬럼 스팬 계산용 */
  const visiblePeriods = useMemo(
    () =>
      livePeriods
        .map((period, colorIdx) => {
          const within = dayStrs.map(
            (ds) => ds >= period.startDate && ds <= period.endDate,
          );
          return {
            period,
            colorIdx,
            startIdx: within.indexOf(true),
            endIdx: within.lastIndexOf(true),
          };
        })
        .filter(({ startIdx }) => startIdx !== -1),
    [livePeriods, dayStrs],
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

  /**
   * 챌린지 기간에 걸리는 셀 key 집합 — 음영·안내 표시용.
   * 보이는 주만 펼치므로 챌린지가 몇 개든 `days × times` 를 넘지 않는다.
   */
  const challengePeriodKeys = useMemo(
    () => toChallengePeriodCellKeys(challengePeriods, dayStrs, TIME_SLOTS),
    [challengePeriods, dayStrs],
  );

  /**
   * 이미 지난 셀 key 집합 — 새로 고르지 못하게 막고 비활성으로 그린다.
   *
   * 렌더 시점의 시각으로만 계산한다. 슬롯은 30분 단위라 초 단위로 다시 그릴 이유가
   * 없고, 주를 넘기거나 셀을 누르면 어차피 다시 계산된다.
   */
  const pastKeys = useMemo(() => {
    const now = currentNow();
    const set = new Set<string>();
    for (const date of dayStrs) {
      for (const time of TIME_SLOTS) {
        if (isPastCell(date, time, now)) set.add(toKey(date, time));
      }
    }
    return set;
  }, [dayStrs]);

  const selectedCount = selectedKeys.size;

  /** 마지막 저장 시점 대비 변경된(추가/삭제된) 셀 개수 — "변경사항 N개"·되돌리기 노출용 */
  const changedKeys = useMemo(() => {
    const set = new Set<string>();
    for (const key of selectedKeys) {
      if (!savedKeys.has(key)) set.add(key);
    }
    for (const key of savedKeys) {
      if (!selectedKeys.has(key)) set.add(key);
    }
    return set;
  }, [selectedKeys, savedKeys]);
  const changedCount = changedKeys.size;

  const handleCellMouseDown = (date: string, time: string) => {
    // 슬롯 오픈 기간 밖이면 편집 불가
    if (isSlotOpenClosed) return;
    const key = toKey(date, time);
    // 다른 챌린지 점유 또는 현재 챌린지에서 이미 신청 완료된 슬롯은 토글 불가
    if (blockedMap.has(key) || appliedMap.has(key) || reservedSet.has(key))
      return;
    /*
      지난 시간은 새로 열지 못한다. 다만 이미 열려 있던 것은 해제할 수 있게 둔다 —
      전부 막으면 예전에 잘못 연 슬롯을 화면에서 지울 방법이 사라진다.
    */
    if (pastKeys.has(key) && !selectedKeys.has(key)) return;

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
    if (isSlotOpenClosed) return;
    if (!isDragging || !dragMode) return;

    const key = toKey(date, time);
    if (blockedMap.has(key) || appliedMap.has(key) || reservedSet.has(key))
      return;
    // 드래그로 훑어도 지난 칸은 건너뛴다. 해제 방향은 위와 같은 이유로 허용한다.
    if (pastKeys.has(key) && dragMode === 'select') return;

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

  const [isSavingLocal, setIsSavingLocal] = useState(false);
  const handleSave = async () => {
    // 슬롯 오픈 기간 밖에서는 저장 불가 (버튼도 비활성이나 방어적으로 차단)
    if (isSlotOpenClosed) return;
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
      // 저장 성공 → 저장 기준을 현재 선택으로 갱신(즉시 반영: 변경사항 0).
      setSavedKeys(new Set(selectedKeys));
      if (mode === 'modal') {
        onClose?.();
      }
    } catch {
      // 호출자에서 에러 처리 — 모달은 열린 채로 두어 토스트 등을 노출할 수 있게 한다.
    } finally {
      setIsSavingLocal(false);
    }
  };

  // 되돌리기 — 마지막 저장 시점으로 복원(닫지 않음; 닫기는 헤더 X). 변경이 있을 때만 노출.
  const handleCancel = () => {
    setSelectedKeys(new Set(savedKeys));
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
        <div className="bg-primary-5 text-xsmall14 text-primary-90 mb-3 flex items-center gap-1.5 break-keep rounded-md px-3 py-2">
          <InfoIcon />
          <span>
            마우스로 드래그하여 여러 시간대를 선택한 후 &ldquo;저장하기&rdquo;
            버튼을 클릭해야 최종반영이 됩니다, 저장하기 전까지는 임시
            상태입니다.
          </span>
        </div>
        {requiredSlotCount !== undefined && (
          <p className="text-xxsmall12 text-neutral-40 mb-3">
            신청 예정인 멘티가{' '}
            <span className="font-semibold">{requiredSlotCount}명</span>
            이므로 최소 {requiredSlotCount}개 이상의 시간대를 열어야 저장할 수
            있습니다.
          </p>
        )}
        {isSlotOpenClosed && slotOpenWindow && (
          <div
            role="alert"
            className="text-xsmall14 mb-3 flex items-center gap-1.5 break-keep rounded-md bg-amber-50 px-3 py-2 text-amber-700"
          >
            <InfoIcon />
            <span>
              지금은 슬롯 오픈 기간이 아닙니다. 오픈 가능 기간은{' '}
              <span className="font-semibold">
                {format(slotOpenWindow.start, 'M월 d일 (EEE) HH:mm', {
                  locale: ko,
                })}{' '}
                ~{' '}
                {format(slotOpenWindow.end, 'M월 d일 (EEE) HH:mm', {
                  locale: ko,
                })}
              </span>
              입니다.
            </span>
          </div>
        )}

        {/* 주 네비(좌) + 레전드(우) — 한 줄 */}
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrevWeek}
              aria-label="이전 주"
              className="text-neutral-40 hover:text-neutral-10 flex h-7 w-7 items-center justify-center rounded-md transition-colors"
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

          {/* 레전드 — 예약 가능 / 예약 불가능 / 예약 완료(잠금) / 변경사항 / 지난 시간 (우측 한 줄) */}
          <div className="text-xxsmall12 text-neutral-40 flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="bg-primary-10 border-neutral-80 h-3 w-3 rounded-[3px] border" />
              예약 가능
            </span>
            <span className="flex items-center gap-1.5">
              <span className="bg-neutral-90 border-neutral-80 h-3 w-3 rounded-[3px] border" />
              예약 불가능
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
            {pastKeys.size > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="bg-neutral-90 border-neutral-80 h-3 w-3 rounded-[3px] border" />
                지난 시간
              </span>
            )}
            {challengePeriodKeys.size > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="bg-neutral-95 border-neutral-80 h-3 w-3 rounded-[3px] border" />
                챌린지 기간
              </span>
            )}
          </div>
        </div>

        {challengePeriodKeys.size > 0 && (
          <p
            role="note"
            className="text-xxsmall12 text-neutral-40 bg-neutral-95 mb-3 break-keep rounded-md px-3 py-2"
          >
            {CHALLENGE_PERIOD_NOTICE} 이 시간에도 일정은 그대로 열 수 있어요.
          </p>
        )}

        <div className="border-neutral-85 min-h-0 flex-1 overflow-y-auto rounded-md border">
          <div className="grid select-none grid-cols-[96px_repeat(7,minmax(88px,1fr))]">
            {/* 헤더 블록 — 요일/날짜 + 기간 바를 한 덩어리로 sticky 고정.
                좌측 "멘토링 시작 시간" 라벨은 기간 바 행까지 세로 병합된다(시안 동일). */}
            <div className="border-neutral-85 sticky top-0 z-10 col-span-full grid grid-cols-[96px_repeat(7,minmax(88px,1fr))] border-b bg-white">
              <div
                style={{
                  gridColumn: 1,
                  gridRow: `1 / ${2 + visiblePeriods.length}`,
                }}
                className="border-neutral-85 text-xxsmall12 text-neutral-40 flex flex-col items-center justify-center border-r px-2 py-2 text-center font-medium leading-tight"
              >
                <span>멘토링</span>
                <span>시작 시간</span>
              </div>
              {days.map((day, index) => {
                // 일요일(마지막 컬럼)은 요일·날짜 모두 빨간색으로 강조
                const isSunday = index === WEEK_DAYS.length - 1;
                return (
                  <div
                    key={index}
                    style={{ gridColumn: index + 2, gridRow: 1 }}
                    className="px-2 py-2 text-center"
                  >
                    <p
                      className={`text-xxsmall12 ${isSunday ? 'text-red-500' : 'text-neutral-40'}`}
                    >
                      {WEEK_DAYS[index]}
                    </p>
                    <p
                      className={`text-small18 font-semibold ${isSunday ? 'text-red-500' : 'text-neutral-10'}`}
                    >
                      {format(day, 'd')}
                    </p>
                  </div>
                );
              })}

              {/* 기간 바 행 — 컬럼 디바이더(배경 셀) 위에 바를 겹쳐 그린다.
                  바는 기간 컬럼 폭을 최소로 하되, 제목이 길면 주 끝까지만 늘어나고 넘치면 말줄임. */}
              {visiblePeriods.map(
                ({ period, colorIdx, startIdx, endIdx }, row) => {
                  const periodCols = endIdx - startIdx + 1;
                  const colsToWeekEnd = WEEK_DAYS.length - startIdx;
                  return (
                    <Fragment
                      key={`live-period-${period.challengeTitle}-${period.startDate}-${colorIdx}`}
                    >
                      {WEEK_DAYS.map((_, dayIndex) => (
                        <div
                          key={`divider-${dayIndex}`}
                          style={{ gridColumn: dayIndex + 2, gridRow: row + 2 }}
                          className={
                            dayIndex === WEEK_DAYS.length - 1
                              ? ''
                              : 'border-neutral-85 border-r'
                          }
                        />
                      ))}
                      <div
                        style={{
                          gridColumn: `${startIdx + 2} / -1`,
                          gridRow: row + 2,
                        }}
                        className="px-1 py-1"
                      >
                        <div
                          style={{
                            minWidth: `${(periodCols / colsToWeekEnd) * 100}%`,
                          }}
                          className={`flex w-max max-w-full items-center gap-2 rounded-md border px-3 py-1 ${
                            PERIOD_COLORS[colorIdx % PERIOD_COLORS.length]
                          }`}
                        >
                          <span className="text-xxsmall12 min-w-0 truncate font-medium">
                            {period.challengeTitle}
                            {period.generation !== undefined &&
                              ` ${period.generation}기`}
                            {period.th !== undefined && ` ${period.th}회차`}{' '}
                            LIVE 피드백 기간
                          </span>
                          {/* 라이브 미션 시작일 ~ 마감일 (예약 기간 = 미션 시작일~종료일) */}
                          <span className="text-xxsmall12 shrink-0 font-medium tabular-nums opacity-90">
                            {format(new Date(period.startDate), 'M.d', {
                              locale: ko,
                            })}
                            {' ~ '}
                            {format(new Date(period.endDate), 'M.d', {
                              locale: ko,
                            })}
                          </span>
                          <span className="text-xxsmall12 ml-auto flex shrink-0 items-center gap-1 font-semibold">
                            <PeopleIcon />
                            {period.reservedCount ?? 0}
                            {period.capacity !== undefined
                              ? ` / ${period.capacity}`
                              : ''}
                          </span>
                        </div>
                      </div>
                    </Fragment>
                  );
                },
              )}
            </div>

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
                    const canSwap =
                      !!onSwapFromOtherChallenge &&
                      blocker.challengeId !== undefined;
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
                      if (!canSwap) return;
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
                            : /*
                               * 스왑 콜백을 넘기지 않으면 클릭해도 아무 일이 없다.
                               * 1대1 라이브 멘토링처럼 이전이 계약에 없는 화면에서
                               * "클릭 시 이동"이라고 적으면 눌러도 반응이 없는 것처럼 읽힌다.
                               */
                              canSwap
                              ? `${blocker.challengeTitle} 일정 · 클릭 시 현재 챌린지로 이동`
                              : blocker.challengeTitle
                                ? `${blocker.challengeTitle}(으)로 이미 열어 둔 시간이라 선택할 수 없습니다`
                                : '다른 일정이 점유한 시간입니다'
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
                          // 왜 못 고르는지가 셀에서 바로 보여야 한다 — 사유를 모르면
                          // 멘토는 "왜 여기만 안 눌리지"로 읽는다.
                          <span className="block truncate">
                            {blocker.challengeTitle ?? '다른 일정'}
                          </span>
                        )}
                      </button>
                    );
                  }

                  /*
                    지난 시간 + 아직 안 연 칸 → 비활성. 왜 안 눌리는지 셀에서 바로
                    보여야 한다. 이미 열려 있는 지난 칸은 여기로 오지 않는다 —
                    아래 일반 셀로 그려서 해제해 지울 수 있게 남긴다.
                  */
                  if (pastKeys.has(key) && !isSelected) {
                    return (
                      <div
                        key={`${time}-${dayIndex}`}
                        title="이미 지난 시간입니다"
                        aria-disabled="true"
                        /*
                          글자를 남기는 이유 — 이 팔레트의 회색 단계(85·90·95)는 육안
                          구분이 거의 안 된다. 챌린지 기간이 95, 예약 불가능이 90 을
                          이미 쓰고 있어 색만으로는 셋이 같아 보인다.
                        */
                        className="border-neutral-90 text-xxsmall10 bg-neutral-90 text-neutral-45 flex items-center justify-center border-b border-r px-2 py-2 text-center last:border-r-0"
                      >
                        지난 시간
                      </div>
                    );
                  }

                  // 선택됨 + 초기 상태 대비 변경(추가)된 셀 → "변경사항"(연보라 테두리)
                  // 선택됨 + 기존 저장 슬롯 → "예약 가능"
                  // 미선택 → 빈 셀 (예약 불가능 상태 없음)
                  const isChanged = isSelected && changedKeys.has(key);
                  /*
                   * 챌린지 기간 — 서버가 이 시간대 슬롯을 1대1 예약 가능 목록에서
                   * 뺀다. 클릭은 그대로 되고 표시만 달라진다.
                   */
                  const inChallengePeriod = challengePeriodKeys.has(key);
                  const cellClass = isChanged
                    ? 'bg-primary-15 text-primary font-semibold'
                    : isSelected
                      ? 'bg-primary-10 text-primary font-semibold'
                      : inChallengePeriod
                        ? 'bg-neutral-95 text-neutral-40 hover:bg-neutral-90'
                        : 'bg-white text-neutral-40 hover:bg-neutral-95';

                  return (
                    <button
                      key={`${time}-${dayIndex}`}
                      type="button"
                      data-challenge-period={inChallengePeriod || undefined}
                      title={
                        pastKeys.has(key)
                          ? '이미 지난 시간입니다. 눌러서 지울 수 있어요.'
                          : inChallengePeriod
                            ? CHALLENGE_PERIOD_NOTICE
                            : undefined
                      }
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
          {changedCount > 0 && (
            <button
              type="button"
              onClick={handleCancel}
              className="border-neutral-80 text-xsmall14 text-neutral-40 rounded-md border px-4 py-2 font-medium"
            >
              되돌리기
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={
              isSavingLocal ||
              isSlotOpenClosed ||
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
