import { useMemo } from 'react';
import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';
import { twMerge } from '@/lib/twMerge';
import type { SortKey, SortState } from '../utils/sortReservations';
import ReservationListView from './ReservationListView';

interface ReservationListModalProps {
  open: boolean;
  onClose: () => void;
  reservations: FeedbackAdminVo[];
  sort: SortState;
  onToggleSort: (key: SortKey) => void;
  /** 모달 내부 행의 "보기" → 단건 상세 모달 오픈. */
  onView: (feedbackId: number) => void;
  isLoading: boolean;
}

const sectionTitleClass = 'text-small18 text-neutral-0 font-semibold';

/**
 * 예약 현황 목록 모달 — 멘토 ReservationListModal 과 동일 구조.
 * 예약을 "예약 목록"(RESERVED, 예정) / "예약 변경 내역"(COMPLETED·CANCELED) 두 섹션으로 나눠 표시한다.
 */
export default function ReservationListModal({
  open,
  onClose,
  reservations,
  sort,
  onToggleSort,
  onView,
  isLoading,
}: ReservationListModalProps) {
  const reservedList = useMemo(
    () => reservations.filter((r) => r.status === 'RESERVED'),
    [reservations],
  );
  const changedList = useMemo(
    () => reservations.filter((r) => r.status !== 'RESERVED'),
    [reservations],
  );

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="예약 현황"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={twMerge(
          'relative z-10 flex max-h-[85dvh] w-full max-w-5xl flex-col',
          'overflow-hidden rounded-lg bg-white shadow-lg',
        )}
      >
        <div className="border-neutral-80 flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-medium20 text-neutral-0 font-semibold">
            예약 현황
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-neutral-40 hover:text-neutral-0 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto px-6 py-5">
          <section className="flex flex-col gap-3">
            <h3 className={sectionTitleClass}>예약 목록</h3>
            <ReservationListView
              reservations={reservedList}
              sort={sort}
              onToggleSort={onToggleSort}
              onView={onView}
              isLoading={isLoading}
              emptyMessage="예정된 예약이 없습니다."
            />
          </section>

          <section className="flex flex-col gap-3">
            <h3 className={sectionTitleClass}>예약 변경 내역</h3>
            <ReservationListView
              reservations={changedList}
              sort={sort}
              onToggleSort={onToggleSort}
              onView={onView}
              isLoading={isLoading}
              emptyMessage="예약 변경 내역이 없습니다."
            />
          </section>
        </div>
      </div>
    </div>
  );
}
