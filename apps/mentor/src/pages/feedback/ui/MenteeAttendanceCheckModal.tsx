import { useEffect, useMemo, useRef, useState } from 'react';

import type { FeedbackAttendanceStatus } from '@/api/feedback/feedbackSchema';
import BaseModal from '@/common/modal/BaseModal';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';

/**
 * 멘티 참여 상태 확인 모달.
 *
 * 멘토가 라이브 피드백 종료 후 멘티의 참여 상태(PRESENT/ABSENT)를 마킹한다.
 * - Jitsi 회의실 모달을 닫으면 자동으로 열린다.
 * - 프로그램 일정(예약 모달)의 "참여 상태 확인" 버튼으로도 열린다.
 * - "저장하기"는 라이브 피드백 종료 시각(`endDate`) 이후에만 활성화된다.
 */

/** 드롭다운에서 선택 가능한 출석 상태 (PENDING 은 미선택 placeholder 로만 사용) */
const SELECTABLE_STATUSES: ReadonlyArray<{
  value: Extract<FeedbackAttendanceStatus, 'PRESENT' | 'ABSENT'>;
  label: string;
}> = [
  { value: 'PRESENT', label: '참석' },
  { value: 'ABSENT', label: '불참' },
];

/** 안내 배너 일시 포맷: `2026.06.05 (수) 11:30` */
function formatGateDate(endDate: string): string {
  const d = dayjs(endDate);
  if (!d.isValid()) return endDate;
  return d.format('YYYY.MM.DD (ddd) HH:mm');
}

interface MenteeAttendanceCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 표시할 멘티 이름 (예: "김대기") */
  menteeName: string;
  /** 저장 게이트 기준 — 라이브 피드백 종료 일시 (ISO) */
  endDate: string;
  /** 기존에 저장된 참여 상태 (없으면 placeholder) */
  currentStatus: FeedbackAttendanceStatus | null;
  /** 저장 콜백 — 선택한 상태를 전달 */
  onSave: (
    status: Extract<FeedbackAttendanceStatus, 'PRESENT' | 'ABSENT'>,
  ) => void;
  /** 저장 진행 중 (버튼 로딩/비활성) */
  isSaving?: boolean;
}

const MenteeAttendanceCheckModal = ({
  isOpen,
  onClose,
  menteeName,
  endDate,
  currentStatus,
  onSave,
  isSaving = false,
}: MenteeAttendanceCheckModalProps) => {
  const [selected, setSelected] = useState<Extract<
    FeedbackAttendanceStatus,
    'PRESENT' | 'ABSENT'
  > | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 모달이 열릴 때 기존 상태를 초기 선택값으로 반영 (PENDING/null 은 미선택)
  useEffect(() => {
    if (!isOpen) return;
    setSelected(
      currentStatus === 'PRESENT' || currentStatus === 'ABSENT'
        ? currentStatus
        : null,
    );
    setIsDropdownOpen(false);
  }, [isOpen, currentStatus]);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // 모달이 열려 있는 동안 1초마다 현재 시각을 갱신해, 종료 시각이 지나면
  // (모달을 닫지 않아도) 저장 버튼이 자동으로 활성화되도록 한다.
  const [now, setNow] = useState(() => dayjs().valueOf());
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => setNow(dayjs().valueOf()), 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // 저장 게이트: 종료 시각 이후에만 "저장" 가능. (선택 자체는 항상 허용)
  const canSave = useMemo(() => {
    const end = dayjs(endDate);
    if (!end.isValid()) return false;
    return now >= end.valueOf();
  }, [endDate, now]);

  const selectedLabel = selected
    ? SELECTABLE_STATUSES.find((s) => s.value === selected)?.label
    : null;

  const handleSave = () => {
    if (!canSave || !selected || isSaving) return;
    onSave(selected);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="mx-4 w-[480px] max-w-full rounded-2xl"
    >
      <div className="flex flex-col gap-6 p-6">
        {/* 헤더 */}
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-neutral-900">
            LIVE 피드백 참여 상태를 확인해 주세요
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-neutral-400 transition-colors hover:text-neutral-600"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* 멘티 참여 상태 선택 */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-neutral-800">
            {menteeName} 멘티 참여 상태
          </span>
          <div className="relative" ref={dropdownRef}>
            {/* 선택은 종료 전에도 미리 가능. 저장만 종료 시각 이후로 게이트한다. */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={twMerge(
                'flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm transition-colors',
                'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400',
              )}
            >
              <span className={selectedLabel ? '' : 'text-neutral-400'}>
                {selectedLabel ?? '참여 상태 선택'}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className={twMerge(
                  'transition-transform',
                  isDropdownOpen && 'rotate-180',
                )}
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg">
                {SELECTABLE_STATUSES.map((status) => (
                  <li key={status.value}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(status.value);
                        setIsDropdownOpen(false);
                      }}
                      className={twMerge(
                        'flex w-full items-center px-4 py-3 text-left text-sm transition-colors hover:bg-neutral-50',
                        selected === status.value
                          ? 'text-primary font-semibold'
                          : 'text-neutral-700',
                      )}
                    >
                      {status.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 안내 배너 */}
        <div className="bg-primary-5 flex items-start gap-2 rounded-lg px-4 py-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary mt-0.5 shrink-0"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M12 8h.01M11 12h1v4h1"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-primary text-xs leading-5">
            멘티 참여 상태는 LIVE 피드백 종료 후
            <br />
            {formatGateDate(endDate)}부터 저장할 수 있어요.
          </p>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-neutral-300 bg-white py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave || !selected || isSaving}
            className={twMerge(
              'flex-1 rounded-lg py-3 text-sm font-semibold text-white transition-colors',
              canSave && selected && !isSaving
                ? 'bg-primary hover:bg-primary-hover'
                : 'cursor-not-allowed bg-neutral-200',
            )}
          >
            저장하기
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default MenteeAttendanceCheckModal;
