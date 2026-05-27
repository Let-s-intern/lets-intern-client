import { useMemo, useState } from 'react';

import { useFeedbackMentorListQuery } from '@/api/feedback/feedback';
import type { FeedbackMentor } from '@/api/feedback/feedbackSchema';

type StatusFilter = 'all' | 'waiting' | 'completed';

const STATUS_OPTIONS: Array<{ key: StatusFilter; label: string }> = [
  { key: 'all', label: '전체' },
  { key: 'waiting', label: '예정' },
  { key: 'completed', label: '완료' },
];

function isCompleted(item: FeedbackMentor): boolean {
  return item.status === 'COMPLETED';
}

/** ISO 문자열에서 "M월 D일" 추출 */
function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

/** ISO 문자열에서 "HH:mm" 추출 */
function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * 좌측 메뉴 "라이브설정 > 예약 현황" 페이지.
 *
 * `GET /feedback/mentor` 목록을 노출한다.
 * 상태(`status`) 기준 필터/카운트: COMPLETED → '완료', 그 외(RESERVED/CANCELED) → '예정'.
 */
const FeedbackLiveReservationPage = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const { data, isLoading, isError } = useFeedbackMentorListQuery();

  const reservations = useMemo(() => {
    if (!data) return [];
    return data.slice().sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [data]);

  const filteredReservations = useMemo(() => {
    if (statusFilter === 'all') return reservations;
    if (statusFilter === 'completed') return reservations.filter(isCompleted);
    return reservations.filter((item) => !isCompleted(item));
  }, [reservations, statusFilter]);

  const counts = useMemo(() => {
    const completed = reservations.filter(isCompleted).length;
    return {
      all: reservations.length,
      waiting: reservations.length - completed,
      completed,
    };
  }, [reservations]);

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
          예약 현황
        </h1>
        <p className="text-xsmall14 text-neutral-40">
          멘티가 신청한 라이브 피드백 예약 내역을 확인하세요.
        </p>
      </div>

      <div className="flex items-center gap-2" role="tablist">
        {STATUS_OPTIONS.map((opt) => {
          const isActive = statusFilter === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setStatusFilter(opt.key)}
              className={`text-xsmall14 rounded-full border px-3 py-1.5 font-medium transition-colors ${
                isActive
                  ? 'border-primary bg-primary-5 text-primary'
                  : 'border-neutral-80 text-neutral-40 hover:bg-neutral-95 bg-white'
              }`}
            >
              {opt.label} {counts[opt.key]}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="border-neutral-85 flex flex-col items-center justify-center gap-2 rounded-md border bg-white py-16">
          <p className="text-small16 text-neutral-30 font-medium">
            불러오는 중...
          </p>
        </div>
      ) : isError ? (
        <div className="border-neutral-85 flex flex-col items-center justify-center gap-2 rounded-md border bg-white py-16">
          <p className="text-small16 text-neutral-30 font-medium">
            예약 내역을 불러오지 못했습니다.
          </p>
          <p className="text-xsmall14 text-neutral-40">
            잠시 후 다시 시도해 주세요.
          </p>
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className="border-neutral-85 flex flex-col items-center justify-center gap-2 rounded-md border bg-white py-16">
          <p className="text-small16 text-neutral-30 font-medium">
            아직 예약이 없습니다.
          </p>
          <p className="text-xsmall14 text-neutral-40">
            가능한 시간을 추가하면 멘티가 예약을 신청할 수 있습니다.
          </p>
        </div>
      ) : (
        <ul className="border-neutral-85 divide-neutral-90 divide-y overflow-hidden rounded-md border bg-white">
          {filteredReservations.map((item) => {
            const completed = isCompleted(item);
            return (
              <li
                key={item.feedbackId}
                className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div className="flex flex-col gap-0.5">
                  <p className="text-small16 text-neutral-10 font-semibold">
                    {item.menteeName} 멘티
                  </p>
                  <p className="text-xsmall14 text-neutral-40">
                    {item.programTitle}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xsmall14 text-neutral-30">
                    {formatDate(item.startDate)} · {formatTime(item.startDate)}~
                    {formatTime(item.endDate)}
                  </span>
                  <span
                    className={`text-xxsmall12 rounded-full px-2 py-0.5 font-medium ${
                      completed
                        ? 'bg-neutral-90 text-neutral-30'
                        : 'bg-primary-5 text-primary'
                    }`}
                  >
                    {completed ? '완료' : '예정'}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FeedbackLiveReservationPage;
