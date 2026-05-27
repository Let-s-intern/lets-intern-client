import { useState } from 'react';

import { useFeedbackMentorListQuery } from '@/api/feedback/feedback';
import { useUserQuery } from '@/api/user/user';

import { useReservationFilters } from './hooks/useReservationFilters';
import CompletedReservationTable from './ui/CompletedReservationTable';
import ReservationDetailModal from './ui/ReservationDetailModal';
import ReservationFilterCard from './ui/ReservationFilterCard';
import {
  formatCreateDate,
  formatDateTimeRange,
} from './utils/formatReservation';

const sectionTitleClass = 'text-small18 text-neutral-10 font-semibold';
const emptyBoxClass =
  'border-neutral-85 text-xsmall14 text-neutral-40 flex items-center justify-center rounded-lg border bg-white py-12';

/**
 * 좌측 메뉴 "라이브설정 > 예약 현황" 페이지.
 *
 * `GET /feedback/mentor` 단일 호출 결과를 클라이언트에서 필터/정렬해
 * 상단 필터 카드 / "예약 목록"(예정, RESERVED) / "완료된 예약"(COMPLETED) 테이블로 구성한다.
 * 멘토명은 로그인 멘토 본인(`useUserQuery().name`)으로 모든 행이 동일.
 */
const FeedbackLiveReservationPage = () => {
  const { data, isLoading, isError } = useFeedbackMentorListQuery();
  const { data: user } = useUserQuery();
  const mentorName = user?.name ?? '';

  const [detailFeedbackId, setDetailFeedbackId] = useState<number | null>(null);

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
      <div className="flex flex-col gap-6 pb-20">
        <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
          예약 현황
        </h1>
        <div className="border-neutral-85 text-small18 text-neutral-30 flex items-center justify-center rounded-lg border bg-white py-16 font-medium">
          불러오는 중...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-6 pb-20">
        <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
          예약 현황
        </h1>
        <div className="border-neutral-85 flex flex-col items-center justify-center gap-2 rounded-lg border bg-white py-16">
          <p className="text-small18 text-neutral-30 font-medium">
            예약 내역을 불러오지 못했습니다.
          </p>
          <p className="text-xsmall14 text-neutral-40">
            잠시 후 다시 시도해 주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-20">
      <header className="flex flex-col gap-2">
        <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
          예약 현황
        </h1>
        <p className="text-xsmall14 text-neutral-40">
          멘티가 신청한 라이브 피드백 예약 내역을 확인하세요.
        </p>
      </header>

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
                    신청 시간
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
                    <td className="text-xsmall14 text-neutral-20 px-4 py-3 align-middle">
                      {formatCreateDate(row.createDate)}
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
        <h2 className={sectionTitleClass}>완료된 예약</h2>
        {completedList.length === 0 ? (
          <div className={emptyBoxClass}>완료된 예약이 없습니다.</div>
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

      <ReservationDetailModal
        feedbackId={detailFeedbackId}
        mentorName={mentorName}
        onClose={() => setDetailFeedbackId(null)}
      />
    </div>
  );
};

export default FeedbackLiveReservationPage;
