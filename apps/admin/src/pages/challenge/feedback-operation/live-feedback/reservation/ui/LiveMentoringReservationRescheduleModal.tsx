import { useMemo, useState } from 'react';

import { useMentorFeedbackSlotsQuery } from '@/api/feedback/feedback';
import type { FeedbackSlotVo } from '@/api/feedback/feedbackSchema';
import { useUpdateLiveMentoringReservationSlotsMutation } from '@/api/live-mentoring/liveMentoring';
import type { AdminLiveMentoringReservation } from '@/api/live-mentoring/liveMentoringSchema';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';

interface LiveMentoringReservationRescheduleModalProps {
  /** 변경 대상 예약. null 이면 모달을 닫는다. */
  reservation: AdminLiveMentoringReservation | null;
  onClose: () => void;
}

/** 30분 → 슬롯 1개, 60분 → 연속한 슬롯 2개. 다른 진행시간은 서버에 없다. */
export function requiredSlotCount(durationMinutes: number | null): number {
  return durationMinutes === 60 ? 2 : 1;
}

/** "YYYY.MM.DD (요일) HH:mm ~ HH:mm" */
function formatCurrentReservation(start: string, end: string): string {
  const s = dayjs(start);
  return `${s.format('YYYY.MM.DD (dd)')} ${s.format('HH:mm')} ~ ${dayjs(
    end,
  ).format('HH:mm')}`;
}

/**
 * 정렬된 슬롯에서 시작점으로 쓸 수 있는 것만 남긴다.
 *
 * count=1 이면 모든 슬롯이 시작점이다. count=2 면 바로 다음 슬롯이 있고, 그 슬롯의
 * 시작이 이 슬롯의 끝과 정확히 맞물려야 한다 — 서버의 연속성 검증
 * (`validateSlotsAreConsecutive`)과 같은 기준이다. 여기서 미리 걸러야 화면에서
 * 고를 수 없는 조합을 어드민이 시도해 서버 400 을 받는 일이 없다.
 */
export function findValidRuns(
  sortedSlots: FeedbackSlotVo[],
  count: number,
): { start: FeedbackSlotVo; run: FeedbackSlotVo[] }[] {
  const runs: { start: FeedbackSlotVo; run: FeedbackSlotVo[] }[] = [];
  for (let i = 0; i + count <= sortedSlots.length; i++) {
    const run = sortedSlots.slice(i, i + count);
    const isConsecutive = run.every(
      (slot, index) => index === 0 || slot.startDate === run[index - 1].endDate,
    );
    if (isConsecutive) {
      runs.push({ start: run[0], run });
    }
  }
  return runs;
}

const fieldClassName =
  'border-neutral-80 text-xsmall14 text-neutral-0 rounded-md border bg-white px-3 py-2.5';

export default function LiveMentoringReservationRescheduleModal({
  reservation,
  onClose,
}: LiveMentoringReservationRescheduleModalProps) {
  const [date, setDate] = useState('');
  // 선택한 구간의 시작 슬롯 id — run 전체는 여기서 다시 찾는다.
  const [startSlotId, setStartSlotId] = useState<number | null>(null);

  const { mutate, isPending } =
    useUpdateLiveMentoringReservationSlotsMutation();

  const requiredCount = requiredSlotCount(reservation?.durationMinutes ?? null);

  const { data: slots } = useMentorFeedbackSlotsQuery(reservation?.mentorId, {
    statusList: ['OPEN'],
  });

  const futureSortedSlots = useMemo(() => {
    const nowMs = Date.now();
    return (slots ?? [])
      .filter((s) => dayjs(s.startDate).valueOf() > nowMs)
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [slots]);

  const validRuns = useMemo(
    () => findValidRuns(futureSortedSlots, requiredCount),
    [futureSortedSlots, requiredCount],
  );

  const availableDates = useMemo(() => {
    const set = new Set(
      validRuns.map(({ start }) => dayjs(start.startDate).format('YYYY-MM-DD')),
    );
    return [...set].sort();
  }, [validRuns]);

  const timeOptions = useMemo(
    () =>
      validRuns.filter(
        ({ start }) => dayjs(start.startDate).format('YYYY-MM-DD') === date,
      ),
    [validRuns, date],
  );

  if (!reservation) return null;

  const selectedRun = validRuns.find(
    ({ start }) => start.feedbackSlotId === startSlotId,
  )?.run;

  const handleSubmit = () => {
    if (!selectedRun) return;
    mutate(
      {
        applicationId: reservation.applicationId,
        slotIds: selectedRun.map((slot) => slot.feedbackSlotId),
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="1대1 예약 일시 변경"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 flex max-h-[85dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="flex items-start justify-between gap-4 px-7 pb-2 pt-7">
          <h3 className="text-medium16 text-neutral-0 font-bold">
            이미 멘티가 예약완료한 1대1 일정입니다. 예약 일시를 변경할까요?
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-neutral-40 hover:text-neutral-0 shrink-0 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-5 overflow-y-auto px-7 py-5">
          <div className="border-neutral-80 text-xsmall14 rounded-xl border">
            <div className="border-neutral-80 flex items-center gap-3 border-b px-4 py-3">
              <span className="text-neutral-40 w-24 shrink-0">예약한 멘티</span>
              <span className="text-neutral-0 font-medium">
                {reservation.menteeName || `멘티 #${reservation.menteeId}`} 님
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-neutral-40 w-24 shrink-0">상품</span>
              <span className="text-neutral-0 font-medium">
                {reservation.productName || '-'}
                {reservation.durationMinutes != null &&
                  ` · ${reservation.durationMinutes}분`}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-medium16 text-neutral-0 font-bold">
              변경할 예약 일시
            </h4>
            <div className="border-neutral-80 text-xsmall14 flex flex-col gap-3 rounded-xl border px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="text-neutral-40 w-20 shrink-0">현재 예약</span>
                <span className="text-neutral-0">
                  {reservation.reservationStartAt &&
                  reservation.reservationEndAt
                    ? formatCurrentReservation(
                        reservation.reservationStartAt,
                        reservation.reservationEndAt,
                      )
                    : '예약 슬롯 없음'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-primary w-20 shrink-0 font-medium">
                  변경 후
                </span>
                <div className="flex flex-1 flex-wrap items-center gap-2">
                  <select
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setStartSlotId(null);
                    }}
                    className={twMerge(fieldClassName, 'flex-1')}
                  >
                    <option value="">
                      {availableDates.length === 0
                        ? '열린 날짜 없음'
                        : '날짜 선택'}
                    </option>
                    {availableDates.map((d) => (
                      <option key={d} value={d}>
                        {dayjs(d).format('YYYY.MM.DD (dd)')}
                      </option>
                    ))}
                  </select>
                  <select
                    value={startSlotId ?? ''}
                    onChange={(e) =>
                      setStartSlotId(
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    disabled={!date}
                    className={twMerge(
                      fieldClassName,
                      'flex-1 disabled:opacity-50',
                    )}
                  >
                    <option value="">
                      {!date
                        ? '날짜를 먼저 선택'
                        : timeOptions.length === 0
                          ? '예약 가능 시간 없음'
                          : '시간 선택'}
                    </option>
                    {timeOptions.map(({ start, run }) => (
                      <option
                        key={start.feedbackSlotId}
                        value={start.feedbackSlotId}
                      >
                        {dayjs(start.startDate).format('HH:mm')} ~{' '}
                        {dayjs(run[run.length - 1].endDate).format('HH:mm')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xsmall14 text-primary flex items-center justify-center gap-2 rounded-xl bg-[#EEF0FF] px-4 py-3 text-center">
            멘티와 사전 합의되지 않은 변경 및 취소는 혼선을 줄 수 있으니, 반드시
            조율 후 진행해 주세요.
          </div>

          <p className="text-xxsmall12 text-neutral-40">
            변경 전 시간대는 다른 멘티가 예약할 수 있도록 자동으로 예약 가능
            시간으로 전환됩니다.
          </p>
        </div>

        <div className="border-neutral-80 flex items-center justify-end gap-2 border-t px-7 py-4">
          <button
            type="button"
            onClick={onClose}
            className="border-neutral-80 text-xsmall14 text-neutral-0 hover:bg-neutral-95 rounded-lg border px-6 py-2.5 font-semibold transition-colors"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedRun || isPending}
            className="bg-primary hover:bg-primary-hover text-xsmall14 rounded-lg px-6 py-2.5 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? '변경 중…' : '변경하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
