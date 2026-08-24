import { useState } from 'react';
import { Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { useAdminRefundMutation } from '@/api/adminRefund';
import {
  ADMIN_LIVE_MENTORING_PARTICIPANT_QUERY_KEY,
  useAdminLiveMentoringParticipantsQuery,
} from '@/api/live-mentoring/liveMentoring';
import type { AdminLiveMentoringParticipant } from '@/api/live-mentoring/liveMentoringSchema';
import RefundModal, {
  type RefundMode,
  type RefundTarget,
} from '@/domain/admin/program/program-user/ui/RefundModal';
import MuiPagination from '@/domain/program/pagination/MuiPagination';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import {
  APPLICATION_STATUS_LABELS,
  formatDateTime,
  formatPrice,
} from './constants';

const PAGE_SIZE = 20;

const headerCellClass =
  'whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-neutral-40';
const bodyCellClass = 'px-4 py-3 text-sm text-neutral-10 align-top';

const COLUMN_COUNT = 9;

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

/**
 * 환불할 수 있는 건인가.
 *
 * 결제가 끝난 건만 환불한다. 결제 대기·선점 만료·신청 취소는 받은 돈이 없거나 이미
 * 되돌린 건이라 실행하면 서버가 거절한다.
 */
const canRefund = (row: AdminLiveMentoringParticipant): boolean =>
  row.status === 'CONFIRMED' && !row.refunded;

/** 환불 버튼을 내걸지 않는 이유. 빈 칸으로 두면 왜 못 누르는지 알 수 없다. */
const refundBlockedReason = (row: AdminLiveMentoringParticipant): string =>
  row.refunded ? '환불 완료' : '결제 완료 건만 환불';

/**
 * 환불 모달이 쓰는 대상 정보로 옮긴다.
 *
 * 주문번호는 참여자 응답에 없어 비운다(모달이 `없음` 으로 적는다). 결제 플랜 자리에는
 * 챌린지 플랜 대신 진행 시간을 넣는다 — 1대1에서 금액을 가르는 값이 그것이다.
 */
const toRefundTarget = (row: AdminLiveMentoringParticipant): RefundTarget => ({
  applicationId: row.applicationId,
  name: row.menteeName ?? `멘티 #${row.menteeId}`,
  email: row.menteeEmail ?? '이메일 없음',
  phoneNum: row.menteePhoneNum ?? '연락처 없음',
  programTitle: row.productName ?? '1대1 라이브 멘토링',
  orderId: '',
  pricePlanType:
    row.durationMinutes != null ? `${row.durationMinutes}분` : null,
  couponName: row.couponName,
  couponDiscount: row.couponDiscount,
  finalPrice: row.paidAmount ?? 0,
});

interface AdminLiveMentoringParticipantTableProps {
  /** 주면 그 멘토의 참여자만 조회한다. 생략하면 전체. */
  mentorId?: number;
  /** 멘토별 보기를 풀고 전체로 돌아간다. 주지 않으면 해제 버튼을 내걸지 않는다. */
  onClearMentor?: () => void;
}

/**
 * 1대1 라이브 멘토링 결제자 목록.
 *
 * 조작은 환불뿐이다. 예약 취소·노쇼 처리는 이 화면의 범위가 아니다.
 */
const AdminLiveMentoringParticipantTable = ({
  mentorId,
  onClearMentor,
}: AdminLiveMentoringParticipantTableProps = {}) => {
  const [page, setPage] = useState(1);
  // 대상과 모드를 함께 담는다. 따로 두면 모달이 닫힐 때 초기화 시점이 갈려 직전 모드로 깜빡인다.
  const [refundRequest, setRefundRequest] = useState<{
    target: RefundTarget;
    mode: RefundMode;
  } | null>(null);

  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();

  const refundMutation = useAdminRefundMutation({
    onSuccess: (refundedAmount) => {
      setRefundRequest(null);
      // 환불 훅은 이 도메인의 키를 모른다. 갱신하지 않으면 환불 상태가 그대로 보인다.
      queryClient.invalidateQueries({
        queryKey: ADMIN_LIVE_MENTORING_PARTICIPANT_QUERY_KEY,
      });
      snackbar(`${refundedAmount.toLocaleString()}원이 환불되었습니다.`);
    },
    // 서버 메시지를 그대로 보여준다. 뭉개면 운영이 다음 행동을 정할 수 없다.
    onError: (message) => snackbar(message),
  });

  const { data, isLoading, isError } = useAdminLiveMentoringParticipantsQuery({
    mentorId,
    page,
    size: PAGE_SIZE,
  });

  const rows = data?.participantList ?? [];

  // 멘토 이름은 목록이 들고 있다. 결과가 비면 알 길이 없어 번호로 적는다.
  const mentorLabel =
    rows[0]?.mentorNickname ?? rows[0]?.mentorName ?? `멘토 #${mentorId}`;

  const emptyMessage =
    mentorId != null
      ? '이 멘토의 참여자가 없습니다.'
      : '결제한 참여자가 없습니다.';

  return (
    <div className="flex flex-col gap-4">
      {mentorId != null && (
        <div
          role="group"
          aria-label="멘토 필터"
          className="border-neutral-80 bg-neutral-95 text-xsmall14 flex flex-wrap items-center gap-3 rounded-lg border px-4 py-3"
        >
          <span className="text-neutral-10">
            {mentorLabel} 의 참여자만 보고 있습니다.
          </span>
          {onClearMentor && (
            <button
              type="button"
              onClick={onClearMentor}
              className="border-neutral-80 text-neutral-40 rounded-md border bg-white px-3 py-1"
            >
              전체 보기
            </button>
          )}
        </div>
      )}

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
              <th className={headerCellClass}>관리</th>
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
                  <td className={bodyCellClass}>
                    {canRefund(row) ? (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          disabled={refundMutation.isPending}
                          onClick={() =>
                            setRefundRequest({
                              target: toRefundTarget(row),
                              mode: 'full',
                            })
                          }
                        >
                          전체 환불
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          // 0원 결제는 전체 환불 경로로만 취소된다.
                          disabled={
                            refundMutation.isPending ||
                            (row.paidAmount ?? 0) === 0
                          }
                          onClick={() =>
                            setRefundRequest({
                              target: toRefundTarget(row),
                              mode: 'partial',
                            })
                          }
                        >
                          부분 환불
                        </Button>
                      </div>
                    ) : (
                      <span className="text-neutral-40">
                        {refundBlockedReason(row)}
                      </span>
                    )}
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

      {/* 되돌릴 수 없는 조작이라 확인 문장을 그대로 입력해야 실행된다. */}
      {refundRequest && (
        <RefundModal
          target={refundRequest.target}
          mode={refundRequest.mode}
          isSubmitting={refundMutation.isPending}
          onSubmit={(body) =>
            refundMutation.mutate({
              applicationId: refundRequest.target.applicationId,
              body,
            })
          }
          onClose={() => setRefundRequest(null)}
        />
      )}
    </div>
  );
};

export default AdminLiveMentoringParticipantTable;
