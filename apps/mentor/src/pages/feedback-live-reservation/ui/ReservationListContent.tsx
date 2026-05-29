import { useMemo, useState } from 'react';

import { useFeedbackMentorListQuery } from '@/api/feedback/feedback';
import { useUserQuery } from '@/api/user/user';
import { useLiveFeedbackData } from '@/pages/schedule/hooks/useLiveFeedbackData';
import LiveFeedbackReservationModal from '@/pages/schedule/modal/LiveFeedbackReservationModal';
import type { PeriodBarData } from '@/pages/schedule/types';

import { useReservationFilters } from '../hooks/useReservationFilters';
import { formatDateTimeRange } from '../utils/formatReservation';
import CompletedReservationTable from './CompletedReservationTable';
import ReservationFilterCard from './ReservationFilterCard';

const sectionTitleClass = 'text-small18 text-neutral-10 font-semibold';
const emptyBoxClass =
  'border-neutral-85 text-xsmall14 text-neutral-40 flex items-center justify-center rounded-lg border bg-white py-12';

/**
 * 예약 현황 본문 — 페이지(`FeedbackLiveReservationPage`)와 모달
 * (`ReservationListModal`) 양쪽에서 재사용하기 위해 추출됨.
 *
 * `GET /feedback/mentor` 단일 호출 결과를 클라이언트에서 필터/정렬해
 * 상단 필터 카드 / "예약 목록"(예정, RESERVED) / "예약 변경 내역"(COMPLETED) 테이블로 구성한다.
 * 자체적으로 query/필터/보기 모달을 포함하므로 어디서든 단독 마운트 가능하다.
 */
const ReservationListContent = () => {
  const { data, isLoading, isError } = useFeedbackMentorListQuery();
  const { data: user } = useUserQuery();
  const mentorName = user?.name ?? '';

  // 라이브 모달용 캘린더 바 — schedule 와 동일 query key 라 추가 fetch 없음.
  const { bars } = useLiveFeedbackData();

  const [detailFeedbackId, setDetailFeedbackId] = useState<number | null>(null);

  // "보기" 로 선택한 feedbackId 의 라이브 세션 바.
  const selectedBar = useMemo<PeriodBarData | null>(() => {
    if (detailFeedbackId === null) return null;
    return (
      bars.find(
        (b) =>
          b.barType === 'live-feedback' &&
          b.liveFeedback?.id === detailFeedbackId,
      ) ?? null
    );
  }, [bars, detailFeedbackId]);

  // 사이드바 멘티 리스트 — 선택 세션의 challengeId 로 스코프(프로그램 일정과 동일 규칙).
  const modalLiveFeedbackBars = useMemo<PeriodBarData[]>(() => {
    if (!selectedBar) return [];
    return bars.filter(
      (b) =>
        b.barType === 'live-feedback' &&
        b.challengeId === selectedBar.challengeId,
    );
  }, [bars, selectedBar]);

  const {
    filters,
    setFilter,
    resetFilters,
    programTitleOptions,
    menteeNameOptions,
    reservedList,
    completedList,
    sortKey,
    sortDirection,
    toggleSort,
  } = useReservationFilters(data);

  if (isLoading) {
    return (
      <div className="border-neutral-85 text-small18 text-neutral-30 flex items-center justify-center rounded-lg border bg-white py-16 font-medium">
        불러오는 중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-neutral-85 flex flex-col items-center justify-center gap-2 rounded-lg border bg-white py-16">
        <p className="text-small18 text-neutral-30 font-medium">
          예약 내역을 불러오지 못했습니다.
        </p>
        <p className="text-xsmall14 text-neutral-40">
          잠시 후 다시 시도해 주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ReservationFilterCard
        filters={filters}
        setFilter={setFilter}
        resetFilters={resetFilters}
        programTitleOptions={programTitleOptions}
        menteeNameOptions={menteeNameOptions}
      />

      <section className="flex flex-col gap-3">
        <h2 className={sectionTitleClass}>예약 목록</h2>
        {reservedList.length === 0 ? (
          <div className={emptyBoxClass}>예정된 예약이 없습니다.</div>
        ) : (
          <div className="border-neutral-85 overflow-x-auto rounded-lg border bg-white">
            <table className="w-full min-w-[720px] border-collapse">
              <thead className="bg-neutral-95 border-neutral-90 border-b">
                <tr>
                  <th className="text-xsmall14 text-neutral-30 px-4 py-3 text-left font-medium">
                    날짜 / 시간
                  </th>
                  <th className="text-xsmall14 text-neutral-30 px-4 py-3 text-left font-medium">
                    프로그램
                  </th>
                  <th className="text-xsmall14 text-neutral-30 px-4 py-3 text-left font-medium">
                    멘토
                  </th>
                  <th className="text-xsmall14 text-neutral-30 px-4 py-3 text-left font-medium">
                    멘티
                  </th>
                  <th className="text-xsmall14 text-neutral-30 px-4 py-3 text-left font-medium">
                    상세
                  </th>
                </tr>
              </thead>
              <tbody className="divide-neutral-90 divide-y">
                {reservedList.map((row) => (
                  <tr key={row.feedbackId}>
                    <td className="text-xsmall14 text-neutral-20 px-4 py-3 align-middle">
                      {formatDateTimeRange(row.startDate, row.endDate)}
                    </td>
                    <td className="text-xsmall14 text-neutral-20 px-4 py-3 align-middle">
                      {row.programTitle}
                    </td>
                    <td className="text-xsmall14 text-neutral-20 px-4 py-3 align-middle">
                      {mentorName}
                    </td>
                    <td className="text-xsmall14 text-neutral-20 px-4 py-3 align-middle">
                      {row.menteeName}
                    </td>
                    <td className="text-xsmall14 px-4 py-3 align-middle">
                      <button
                        type="button"
                        className="text-primary text-xsmall14 font-medium hover:underline"
                        onClick={() => setDetailFeedbackId(row.feedbackId)}
                      >
                        보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={sectionTitleClass}>예약 변경 내역</h2>
        {completedList.length === 0 ? (
          <div className={emptyBoxClass}>예약 변경 내역이 없습니다.</div>
        ) : (
          <CompletedReservationTable
            rows={completedList}
            mentorName={mentorName}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onToggleSort={toggleSort}
            onViewDetail={setDetailFeedbackId}
          />
        )}
      </section>

      <LiveFeedbackReservationModal
        isOpen={detailFeedbackId !== null}
        onClose={() => setDetailFeedbackId(null)}
        bar={selectedBar}
        liveFeedbackBars={modalLiveFeedbackBars}
        onSelectBar={(nextBar) =>
          setDetailFeedbackId(nextBar.liveFeedback?.id ?? null)
        }
        roundTh={selectedBar?.th}
      />
    </div>
  );
};

export default ReservationListContent;
