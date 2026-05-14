import { useMemo, useState } from 'react';

import { LIVE_FEEDBACK_MOCK_DATA } from '@/pages/schedule/challenge-content/liveFeedbackMock';
import type { PeriodBarData } from '@/pages/schedule/types';

type StatusFilter = 'all' | 'waiting' | 'completed';

const STATUS_OPTIONS: Array<{ key: StatusFilter; label: string }> = [
  { key: 'all', label: '전체' },
  { key: 'waiting', label: '예정' },
  { key: 'completed', label: '완료' },
];

function isCompleted(bar: PeriodBarData): boolean {
  return bar.liveFeedback?.status === 'completed';
}

function formatDate(date: string): string {
  const [, month, day] = date.split('-');
  return `${Number(month)}월 ${Number(day)}일`;
}

/**
 * 좌측 메뉴 "라이브설정 > 예약 현황" 페이지.
 *
 * BE 미연동 — 기존 라이브 피드백 mock 에서 개별 세션(barType: 'live-feedback')
 * 만 추출해 리스트로 노출하는 1차 골격.
 *
 * TODO(BE):
 *  - 예약 리스트 API 확정 후 mock 자리 교체
 *  - 정렬/페이지네이션/검색 (디자이너 명세 확정 후)
 *  - 상세 모달 진입 (LiveFeedbackReservationModal 재사용 검토)
 */
const FeedbackLiveReservationPage = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const reservations = useMemo(() => {
    return LIVE_FEEDBACK_MOCK_DATA.filter(
      (bar) => bar.barType === 'live-feedback' && bar.liveFeedback,
    ).sort((a, b) => {
      if (a.startDate !== b.startDate) {
        return a.startDate.localeCompare(b.startDate);
      }
      const aTime = a.liveFeedback?.startTime ?? '';
      const bTime = b.liveFeedback?.startTime ?? '';
      return aTime.localeCompare(bTime);
    });
  }, []);

  const filteredReservations = useMemo(() => {
    if (statusFilter === 'all') return reservations;
    if (statusFilter === 'completed') return reservations.filter(isCompleted);
    return reservations.filter((bar) => !isCompleted(bar));
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

      {filteredReservations.length === 0 ? (
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
          {filteredReservations.map((bar) => {
            const completed = isCompleted(bar);
            return (
              <li
                key={`${bar.challengeId}-${bar.startDate}-${bar.liveFeedback?.startTime}`}
                className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div className="flex flex-col gap-0.5">
                  <p className="text-small16 text-neutral-10 font-semibold">
                    {bar.liveFeedback?.menteeName ?? '익명'} 멘티
                  </p>
                  <p className="text-xsmall14 text-neutral-40">
                    {bar.challengeTitle}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xsmall14 text-neutral-30">
                    {formatDate(bar.startDate)} · {bar.liveFeedback?.startTime}
                    ~{bar.liveFeedback?.endTime}
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

      <div className="bg-neutral-95 text-xxsmall12 text-neutral-40 rounded-md px-3 py-2">
        ⚠ 예약 리스트는 mock 데이터입니다. 실제 데이터 연동은 BE API 확정 후
        진행됩니다.
      </div>
    </div>
  );
};

export default FeedbackLiveReservationPage;
