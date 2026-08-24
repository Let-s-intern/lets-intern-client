import { useState } from 'react';

import { useAdminLiveMentoringParticipantsQuery } from '@/api/live-mentoring/liveMentoring';
import type { AdminLiveMentoringParticipant } from '@/api/live-mentoring/liveMentoringSchema';
import MuiPagination from '@/domain/program/pagination/MuiPagination';
import {
  APPLICATION_STATUS_LABELS,
  formatDateTime,
  formatPrice,
} from './constants';

const PAGE_SIZE = 20;

const headerCellClass =
  'whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-neutral-40';
const bodyCellClass = 'px-4 py-3 text-sm text-neutral-10 align-top';

const COLUMN_COUNT = 8;

/** 예약 일시. 60분 플랜은 연속한 두 슬롯을 한 구간으로 합쳐 내려온다. */
const reservationLabel = (row: AdminLiveMentoringParticipant): string => {
  if (!row.reservationStartAt) return '예약 슬롯 없음';
  const start = formatDateTime(row.reservationStartAt);
  if (!row.reservationEndAt) return start;
  return `${start} ~ ${row.reservationEndAt.split('T')[1]?.slice(0, 5) ?? ''}`;
};

/** 쿠폰 할인 -1 은 금액이 아니라 "100% 할인" 센티널이다. 그대로 뿌리면 -1원으로 보인다. */
const couponLabel = (
  couponName: string | null,
  couponDiscount: number | null,
): string => {
  if (!couponName) return '사용 안 함';
  if (couponDiscount === -1) return `${couponName} (100% 할인)`;
  if (couponDiscount == null) return couponName;
  return `${couponName} (${formatPrice(couponDiscount)} 할인)`;
};

/**
 * 환불 상태.
 *
 * 라이브 멘토링 환불은 `payment.isRefunded` 를 세우지 않아 서버가 신청 취소 플래그로
 * 판단해 내려준다. 환불액도 `refunded` 가 true 일 때만 뜻이 있다.
 */
const refundLabel = (row: AdminLiveMentoringParticipant): string => {
  if (!row.refunded) return '환불 없음';
  if (row.refundAmount == null) return '환불함';
  return `환불 ${formatPrice(row.refundAmount)}`;
};

interface AdminLiveMentoringParticipantTableProps {
  /** 빈 목록일 때 보여 줄 문구. 멘토별 보기와 전체 보기가 다른 말을 쓴다. */
  emptyMessage?: string;
}

/**
 * 1대1 라이브 멘토링 결제자 목록.
 *
 * 조작은 환불뿐이다. 예약 취소·노쇼 처리는 이 화면의 범위가 아니다.
 */
const AdminLiveMentoringParticipantTable = ({
  emptyMessage = '결제한 참여자가 없습니다.',
}: AdminLiveMentoringParticipantTableProps = {}) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAdminLiveMentoringParticipantsQuery({
    page,
    size: PAGE_SIZE,
  });

  const rows = data?.participantList ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="border-neutral-80 overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[1080px] border-collapse">
          <thead className="border-neutral-80 bg-neutral-95 border-b">
            <tr>
              <th className={headerCellClass}>신청자</th>
              <th className={headerCellClass}>멘토</th>
              <th className={headerCellClass}>예약 일시</th>
              <th className={headerCellClass}>플랜</th>
              <th className={headerCellClass}>결제 금액</th>
              <th className={headerCellClass}>쿠폰</th>
              <th className={headerCellClass}>결제 상태</th>
              <th className={headerCellClass}>환불 상태</th>
            </tr>
          </thead>
          <tbody>
            {isError ? (
              <tr>
                <td
                  colSpan={COLUMN_COUNT}
                  className="text-xsmall14 text-neutral-40 py-16 text-center"
                >
                  참여자 목록을 불러오지 못했습니다.
                </td>
              </tr>
            ) : isLoading ? (
              <tr>
                <td
                  colSpan={COLUMN_COUNT}
                  className="text-xsmall14 text-neutral-40 py-16 text-center"
                >
                  불러오는 중...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMN_COUNT}
                  className="text-xsmall14 text-neutral-40 py-16 text-center"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.applicationId}
                  className="border-neutral-90 border-b last:border-b-0"
                >
                  <td className={bodyCellClass}>
                    <div className="flex flex-col gap-0.5">
                      <span className="whitespace-nowrap">
                        {row.menteeName ?? `멘티 #${row.menteeId}`}
                      </span>
                      <span className="text-neutral-40 text-xs">
                        {row.menteeEmail ?? '이메일 없음'}
                      </span>
                      <span className="text-neutral-40 text-xs">
                        {row.menteePhoneNum ?? '연락처 없음'}
                      </span>
                    </div>
                  </td>
                  <td className={`${bodyCellClass} whitespace-nowrap`}>
                    {row.mentorNickname ??
                      row.mentorName ??
                      `멘토 #${row.mentorId}`}
                  </td>
                  <td className={`${bodyCellClass} whitespace-nowrap`}>
                    {reservationLabel(row)}
                  </td>
                  <td className={`${bodyCellClass} whitespace-nowrap`}>
                    {row.durationMinutes != null
                      ? `${row.durationMinutes}분`
                      : '없음'}
                  </td>
                  <td className={`${bodyCellClass} whitespace-nowrap`}>
                    <div className="flex flex-col gap-0.5">
                      <span>
                        {row.paidAmount != null
                          ? formatPrice(row.paidAmount)
                          : '금액 없음'}
                      </span>
                      {row.originalPrice != null && (
                        <span className="text-neutral-40 text-xs">
                          정가 {formatPrice(row.originalPrice)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className={`${bodyCellClass} break-keep`}>
                    {couponLabel(row.couponName, row.couponDiscount)}
                  </td>
                  <td className={`${bodyCellClass} whitespace-nowrap`}>
                    {APPLICATION_STATUS_LABELS[row.status]}
                  </td>
                  <td className={`${bodyCellClass} whitespace-nowrap`}>
                    {refundLabel(row)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.pageInfo.totalPages > 1 && (
        <MuiPagination
          pageInfo={{ totalPages: data.pageInfo.totalPages }}
          page={page}
          onChange={(_, next) => setPage(next)}
        />
      )}
    </div>
  );
};

export default AdminLiveMentoringParticipantTable;
