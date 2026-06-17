import { useAdminFeedbackHistoryQuery } from '@/api/feedback/feedback';
import {
  formatApplyDateTime,
  formatReservationDateTime,
} from '../../utils/format';

interface ReservationHistoryPanelProps {
  feedbackId: number;
}

/**
 * 예약 변경 내역 펼침 패널 — 행 아래(콜스팬) 인라인으로 렌더된다.
 * 펼쳐질 때만 마운트되므로 해당 예약의 변경 내역을 그때 조회한다.
 */
export default function ReservationHistoryPanel({
  feedbackId,
}: ReservationHistoryPanelProps) {
  const {
    data: history,
    isLoading,
    isError,
  } = useAdminFeedbackHistoryQuery(feedbackId);

  if (isLoading) {
    return (
      <div className="text-xxsmall12 text-neutral-40 py-4 text-center">
        변경 내역 불러오는 중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-xxsmall12 py-4 text-center text-red-500">
        변경 내역을 불러오지 못했습니다.
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-xxsmall12 text-neutral-40 py-4 text-center">
        예약을 옮긴 내역이 없습니다.
      </div>
    );
  }

  return (
    <ol className="flex flex-col gap-2 py-2">
      {history.map((item) => (
        <li key={item.id} className="flex items-center gap-3">
          <span className="text-xxsmall12 text-neutral-40 w-20 shrink-0">
            이전 예약일
          </span>
          <span className="text-xsmall14 text-neutral-0">
            {formatReservationDateTime(
              item.beforeStartDate,
              item.beforeEndDate,
            )}
          </span>
          <span className="text-xxsmall12 text-neutral-40">
            (변경 {formatApplyDateTime(item.changedAt)})
          </span>
        </li>
      ))}
    </ol>
  );
}
