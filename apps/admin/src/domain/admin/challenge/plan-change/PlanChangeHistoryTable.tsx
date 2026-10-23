import {
  PlanChangeLog,
  useManualRefundCompleteMutation,
} from '@/api/planChange';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';
import { useState } from 'react';

interface Props {
  logs: PlanChangeLog[];
  isLoading: boolean;
}

/**
 * 따로 받은 차액의 환불 완료 기록 (설계안 D12, 운영안 "따로 받은 차액").
 *
 * 요청 상태를 행마다 둔다. 성공하면 그 행의 입력만 닫아, 목록이 다시 오기 전에
 * 같은 건을 한 번 더 보내지 않게 한다.
 */
const ManualRefundCompleteCell = ({ log }: { log: PlanChangeLog }) => {
  const { snackbar } = useAdminSnackbar();
  const [isEditing, setIsEditing] = useState(false);
  const [managerName, setManagerName] = useState('');

  const mutation = useManualRefundCompleteMutation({
    onSuccess: () => {
      setIsEditing(false);
      snackbar('환불 완료를 기록했습니다.');
    },
    // 서버 문구를 그대로 보여준다. 이미 기록된 건인지 같은 다음 행동이 문구에 있다.
    onError: (message) => snackbar(message),
  });

  if (!isEditing) {
    return (
      <button
        type="button"
        className="whitespace-nowrap rounded border border-red-500 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
        onClick={() => setIsEditing(true)}
      >
        환불 완료
      </button>
    );
  }

  const trimmedName = managerName.trim();

  return (
    <div className="flex items-center gap-1">
      <input
        className="w-24 rounded border border-neutral-300 px-2 py-1 text-xs"
        aria-label="환불 담당자"
        placeholder="담당자 이름"
        value={managerName}
        onChange={(e) => setManagerName(e.target.value)}
      />
      <button
        type="button"
        className="whitespace-nowrap rounded bg-red-600 px-2 py-1 text-xs text-white disabled:bg-neutral-300"
        disabled={!trimmedName || mutation.isPending}
        onClick={() =>
          mutation.mutate({
            planChangeLogId: log.planChangeLogId,
            challengeId: log.programId,
            body: { managerName: trimmedName },
          })
        }
      >
        확정
      </button>
      <button
        type="button"
        className="whitespace-nowrap rounded border border-neutral-300 px-2 py-1 text-xs"
        disabled={mutation.isPending}
        onClick={() => setIsEditing(false)}
      >
        취소
      </button>
    </div>
  );
};

const ManualRefundStatus = ({ log }: { log: PlanChangeLog }) => {
  // 토스로 받은 차액은 환불할 때 시스템이 함께 취소한다. 기록할 일이 없다.
  if (log.hasPaymentKey) return <span className="text-neutral-400">-</span>;

  if (log.manualRefundedAt) {
    return (
      <span className="whitespace-nowrap">
        {`완료 ${dayjs(log.manualRefundedAt).format('M/D')} ${log.manualRefundedBy ?? ''}`.trim()}
      </span>
    );
  }

  return <ManualRefundCompleteCell log={log} />;
};

const PlanChangeHistoryTable = ({ logs, isLoading }: Props) => {
  if (isLoading) {
    return (
      <p className="py-10 text-center text-sm text-neutral-500">
        불러오는 중...
      </p>
    );
  }

  if (logs.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-neutral-500">
        조건에 맞는 플랜 변경 이력이 없습니다.
      </p>
    );
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b bg-neutral-100 text-left">
          <th className="px-3 py-2">일시</th>
          <th className="px-3 py-2">참여자</th>
          <th className="px-3 py-2">챌린지</th>
          <th className="px-3 py-2">변경</th>
          {/* 운영이 수납액을 고칠 수 있어 계산값과 나란히 둔다 (설계안 D10). */}
          <th className="px-3 py-2 text-right">계산값</th>
          <th className="px-3 py-2 text-right">수납액</th>
          <th className="px-3 py-2">수납 방식</th>
          <th className="px-3 py-2">담당자</th>
          <th className="px-3 py-2">사유</th>
          <th className="px-3 py-2">별도 환불</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log.planChangeLogId} className="border-b align-top">
            <td className="whitespace-nowrap px-3 py-2">
              {log.createDate
                ? dayjs(log.createDate).format('YYYY-MM-DD HH:mm')
                : '-'}
            </td>
            <td className="px-3 py-2">
              {/* 동명이인 구분을 위해 이메일을 함께 보여준다. */}
              <div>{log.userName}</div>
              <div className="text-xs text-neutral-500">{log.userEmail}</div>
            </td>
            <td className="px-3 py-2">{log.programTitle}</td>
            <td className="whitespace-nowrap px-3 py-2">
              {`${log.fromPlan} → ${log.toPlan}`}
            </td>
            <td className="whitespace-nowrap px-3 py-2 text-right">
              {log.calculatedAmount.toLocaleString()}원
            </td>
            <td className="whitespace-nowrap px-3 py-2 text-right">
              {log.additionalAmount.toLocaleString()}원
            </td>
            <td className="whitespace-nowrap px-3 py-2">
              {log.hasPaymentKey ? '토스' : '별도 수납'}
            </td>
            <td className="whitespace-nowrap px-3 py-2">{log.changedBy}</td>
            <td className="px-3 py-2">
              <span className="line-clamp-2" title={log.reason ?? ''}>
                {log.reason}
              </span>
            </td>
            <td className="px-3 py-2">
              <ManualRefundStatus log={log} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PlanChangeHistoryTable;
