import { useMemo, useState } from 'react';
import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';
import {
  useChangeAdminFeedbackSlotMutation,
  useMentorFeedbackSlotsQuery,
} from '@/api/feedback/feedback';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { twMerge } from '@/lib/twMerge';
import { formatReservationDateTime } from '../../utils/format';
import {
  formatSlotTimeRange,
  groupSlotsByDate,
} from '../utils/groupSlotsByDate';

interface ReservationChangeModalProps {
  /** 변경 대상 예약 행. null 이면 모달을 렌더하지 않는다(닫힘). */
  reservation: FeedbackAdminVo | null;
  onClose: () => void;
}

const SUCCESS_MESSAGE = '예약 일시가 변경되었습니다.';
const ERROR_MESSAGE = '예약 변경에 실패했습니다. 다시 시도해 주세요.';

/** 라벨 + 값 정보 행 (예약 정보 카드용) */
function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="text-xsmall14 flex gap-3">
      <span className="text-neutral-40 w-20 shrink-0">{label}</span>
      <span className="text-neutral-0 break-words">{value || '-'}</span>
    </div>
  );
}

/** 고정 안내문구 행 */
function NoticeRow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xxsmall12 text-neutral-40 flex gap-1.5 leading-5">
      <span aria-hidden="true">ⓘ</span>
      <span>{children}</span>
    </p>
  );
}

/**
 * 예약 정보·날짜/시간 선택·변경 실행을 담는 모달 본문.
 * reservation 이 확정된 상태에서만 렌더되어 내부 훅이 안전하게 동작한다.
 */
function ChangeBody({
  reservation,
  onClose,
}: {
  reservation: FeedbackAdminVo;
  onClose: () => void;
}) {
  const { snackbar } = useAdminSnackbar();
  const mentorId = reservation.mentorId;

  // 같은 멘토의 OPEN 슬롯만 후보로 조회한다.
  const { data: openSlots, refetch } = useMentorFeedbackSlotsQuery(mentorId, {
    statusList: ['OPEN'],
  });

  const { mutate: changeSlot, isPending } =
    useChangeAdminFeedbackSlotMutation();

  const dateGroups = useMemo(
    () => groupSlotsByDate(openSlots ?? []),
    [openSlots],
  );

  const [selectedDateKey, setSelectedDateKey] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  const selectedGroup = dateGroups.find((g) => g.dateKey === selectedDateKey);
  const slotsForDate = selectedGroup?.slots ?? [];

  const hasNoSlots = dateGroups.length === 0;
  const canSubmit =
    !isPending && selectedSlotId != null && mentorId != null && !hasNoSlots;

  const handleDateChange = (dateKey: string) => {
    setSelectedDateKey(dateKey);
    // 날짜가 바뀌면 이전 시간대 선택을 초기화한다.
    setSelectedSlotId(null);
  };

  const handleSubmit = () => {
    if (!canSubmit || selectedSlotId == null || mentorId == null) return;
    changeSlot(
      {
        feedbackId: reservation.feedbackId,
        feedbackSlotId: selectedSlotId,
        mentorId,
      },
      {
        onSuccess: () => {
          snackbar(SUCCESS_MESSAGE);
          onClose();
        },
        onError: () => {
          snackbar(ERROR_MESSAGE);
          // 슬롯 경합 가능성 — 후보를 다시 불러와 선택지를 갱신한다.
          refetch();
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 예약 정보 */}
      <section className="border-neutral-80 flex flex-col gap-2 rounded-xl border p-4">
        <p className="text-xxsmall12 text-neutral-40 font-medium">예약 정보</p>
        <InfoRow label="예약한 멘티" value={`${reservation.menteeName} 님`} />
        <InfoRow label="담당 멘토" value={`${reservation.mentorName} 님`} />
        <InfoRow label="프로그램" value={reservation.programTitle} />
      </section>

      {/* 변경할 예약 일시 */}
      <section className="flex flex-col gap-2">
        <p className="text-xsmall14 text-neutral-0 font-semibold">
          변경할 예약 일시
        </p>
        <div className="border-neutral-80 flex flex-col gap-3 rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <span className="text-xxsmall12 text-neutral-40 w-16 shrink-0">
              현재 예약
            </span>
            <span className="text-xsmall14 text-neutral-0">
              {formatReservationDateTime(
                reservation.startDate,
                reservation.endDate,
              )}
            </span>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
            <span className="text-xxsmall12 text-neutral-40 w-16 shrink-0">
              변경 후
            </span>

            {hasNoSlots ? (
              <span className="text-xsmall14 text-neutral-40">
                변경 가능한 시간대가 없습니다.
              </span>
            ) : (
              <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                <select
                  aria-label="날짜 선택"
                  value={selectedDateKey}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="border-neutral-80 text-xsmall14 flex-1 rounded-md border px-2 py-1.5"
                >
                  <option value="">날짜 선택</option>
                  {dateGroups.map((group) => (
                    <option key={group.dateKey} value={group.dateKey}>
                      {group.dateLabel}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="시간대 선택"
                  value={selectedSlotId ?? ''}
                  onChange={(e) =>
                    setSelectedSlotId(
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                  disabled={!selectedDateKey}
                  className="border-neutral-80 text-xsmall14 flex-1 rounded-md border px-2 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">시간대 선택</option>
                  {slotsForDate.map((slot) => (
                    <option
                      key={slot.feedbackSlotId}
                      value={slot.feedbackSlotId}
                    >
                      {formatSlotTimeRange(slot)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 고정 안내문구 */}
      <div className="flex flex-col gap-1.5">
        <NoticeRow>
          멘티와 사전 합의되지 않은 변경은 혼선을 줄 수 있으니, 반드시 조율 후
          진행해 주세요.
        </NoticeRow>
        <NoticeRow>
          변경 전 시간대는 자동으로 예약 가능 상태로 전환됩니다.
        </NoticeRow>
      </div>

      {/* 액션 */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="border-neutral-80 text-xsmall14 text-neutral-40 hover:text-neutral-0 rounded-lg border px-5 py-2.5 font-semibold transition-colors"
        >
          닫기
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="bg-primary hover:bg-primary-hover text-xsmall14 rounded-lg px-5 py-2.5 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? '변경 중…' : '변경하기'}
        </button>
      </div>
    </div>
  );
}

export default function ReservationChangeModal({
  reservation,
  onClose,
}: ReservationChangeModalProps) {
  if (reservation == null) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="예약 일시 변경"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={twMerge(
          'relative z-10 flex max-h-[85dvh] w-full max-w-lg flex-col',
          'overflow-hidden rounded-lg bg-white shadow-lg',
        )}
      >
        <div className="border-neutral-80 flex items-start justify-between border-b px-6 py-4">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-medium16 text-neutral-0 font-semibold">
              이미 멘티가 예약 완료한 일정입니다.
            </h3>
            <p className="text-xsmall14 text-neutral-40">
              예약 일시를 변경할까요?
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-neutral-40 hover:text-neutral-0 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <ChangeBody reservation={reservation} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
