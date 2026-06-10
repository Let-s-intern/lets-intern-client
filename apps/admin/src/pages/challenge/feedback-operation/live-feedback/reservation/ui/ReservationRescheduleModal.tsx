import { useMemo, useState } from 'react';

import {
  useMentorFeedbackSlotsQuery,
  useRescheduleAdminFeedbackMutation,
} from '@/api/feedback/feedback';
import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';

interface ReservationRescheduleModalProps {
  /** 변경 대상 예약. null 이면 모달을 닫는다. */
  feedback: FeedbackAdminVo | null;
  onClose: () => void;
}

/** "YYYY.MM.DD (요일) HH:mm ~ HH:mm" */
function formatCurrentReservation(start: string, end: string): string {
  const s = dayjs(start);
  return `${s.format('YYYY.MM.DD (dd)')} ${s.format('HH:mm')} ~ ${dayjs(
    end,
  ).format('HH:mm')}`;
}

const PeopleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <circle cx="6" cy="5.5" r="2.3" stroke="currentColor" strokeWidth="1.2" />
    <path
      d="M2.5 13c0-2 1.6-3.3 3.5-3.3S9.5 11 9.5 13"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M10.5 4.2a2 2 0 010 3.6M11.5 13c0-1.4-.6-2.5-1.6-3.1"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const DocIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M4 2.5h5L12 5.5V13.5H4z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path
      d="M6 7.5h4M6 10h4"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden
    className={className}
  >
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
    <path
      d="M8 5v3l2 1.3"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
    <path
      d="M8 7.2v3.3"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <circle cx="8" cy="5.2" r="0.7" fill="currentColor" />
  </svg>
);

const fieldClassName =
  'border-neutral-80 text-xsmall14 text-neutral-0 rounded-md border bg-white px-3 py-2.5';

export default function ReservationRescheduleModal({
  feedback,
  onClose,
}: ReservationRescheduleModalProps) {
  // 선택한 날짜(YYYY-MM-DD)와 그 날짜의 슬롯(feedbackSlotId).
  const [date, setDate] = useState('');
  const [slotId, setSlotId] = useState<number | null>(null);

  const { mutate, isPending } = useRescheduleAdminFeedbackMutation();

  // 변경 가능한 시간대 = 멘토의 OPEN 슬롯.
  const { data: slots } = useMentorFeedbackSlotsQuery(feedback?.mentorId, {
    statusList: ['OPEN'],
  });

  // 과거 시간대로는 변경할 수 없다 — 현재 이후(미래)의 OPEN 슬롯만 노출한다.
  const futureSlots = useMemo(() => {
    const nowMs = Date.now();
    return (slots ?? []).filter((s) => dayjs(s.startDate).valueOf() > nowMs);
  }, [slots]);

  // 멘토가 열어둔(OPEN) 슬롯이 있는 날짜만 선택지로 노출한다.
  const availableDates = useMemo(() => {
    const set = new Set(
      futureSlots.map((s) => dayjs(s.startDate).format('YYYY-MM-DD')),
    );
    return [...set].sort();
  }, [futureSlots]);

  // 선택한 날짜의 OPEN 슬롯만 시간 옵션으로 노출한다.
  const timeOptions = useMemo(
    () =>
      futureSlots
        .filter((s) => dayjs(s.startDate).format('YYYY-MM-DD') === date)
        .sort((a, b) => a.startDate.localeCompare(b.startDate)),
    [futureSlots, date],
  );

  if (!feedback) return null;

  const handleSubmit = () => {
    if (slotId == null) return;
    mutate(
      { feedbackId: feedback.feedbackId, feedbackSlotId: slotId },
      { onSuccess: onClose },
    );
  };

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
      <div className="relative z-10 flex max-h-[85dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-lg">
        {/* 헤더 */}
        <div className="flex items-start justify-between gap-4 px-7 pb-2 pt-7">
          <h3 className="text-medium16 text-neutral-0 font-bold">
            이미 멘티가 예약완료한 일정입니다. 예약 일시를 변경할까요?
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
          {/* 예약 정보 카드 */}
          <div className="border-neutral-80 text-xsmall14 rounded-xl border">
            <div className="border-neutral-80 flex items-center gap-3 border-b px-4 py-3">
              <span className="text-neutral-40 flex w-24 shrink-0 items-center gap-1.5">
                <PeopleIcon />
                예약한 멘티
              </span>
              <span className="text-neutral-0 font-medium">
                {feedback.menteeName} 님
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-neutral-40 flex w-24 shrink-0 items-center gap-1.5">
                <DocIcon />
                프로그램
              </span>
              <span className="text-neutral-0 font-medium">
                {feedback.programTitle || '-'}
              </span>
            </div>
          </div>

          {/* 변경할 예약 일시 */}
          <div className="flex flex-col gap-2">
            <h4 className="text-medium16 text-neutral-0 font-bold">
              변경할 예약 일시
            </h4>
            <div className="border-neutral-80 text-xsmall14 flex flex-col gap-3 rounded-xl border px-4 py-4">
              {/* 현재 예약 */}
              <div className="flex items-center gap-3">
                <span className="text-neutral-40 flex w-20 shrink-0 items-center gap-1.5">
                  <ClockIcon />
                  현재 예약
                </span>
                <span className="text-neutral-0">
                  {formatCurrentReservation(
                    feedback.startDate,
                    feedback.endDate,
                  )}
                </span>
              </div>

              {/* 변경 후 */}
              <div className="flex items-center gap-3">
                <span className="text-primary flex w-20 shrink-0 items-center gap-1.5 font-medium">
                  <ClockIcon className="text-primary" />
                  변경 후
                </span>
                <div className="flex flex-1 flex-wrap items-center gap-2">
                  {/* 멘토가 열어둔 날짜만 노출 */}
                  <select
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setSlotId(null);
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
                    value={slotId ?? ''}
                    onChange={(e) =>
                      setSlotId(e.target.value ? Number(e.target.value) : null)
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
                    {timeOptions.map((s) => (
                      <option key={s.feedbackSlotId} value={s.feedbackSlotId}>
                        {dayjs(s.startDate).format('HH:mm')} ~{' '}
                        {dayjs(s.endDate).format('HH:mm')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 안내 배너 */}
          <div className="text-xsmall14 text-primary flex items-center justify-center gap-2 rounded-xl bg-[#EEF0FF] px-4 py-3 text-center">
            <InfoIcon />
            멘티와 사전 합의되지 않은 변경 및 취소는 혼선을 줄 수 있으니, 반드시
            조율 후 진행해 주세요.
          </div>

          {/* 변경 전 시간대는 항상 예약 가능으로 자동 전환된다(선택 불가). */}
          <p className="text-xxsmall12 text-neutral-40">
            변경 전 시간대는 다른 멘티가 예약할 수 있도록 자동으로 예약 가능
            시간으로 전환됩니다.
          </p>
        </div>

        {/* 푸터 — 예약 취소는 제외(취소 기능 없음) */}
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
            disabled={slotId == null || isPending}
            className="bg-primary hover:bg-primary-hover text-xsmall14 rounded-lg px-6 py-2.5 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? '변경 중…' : '변경하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
