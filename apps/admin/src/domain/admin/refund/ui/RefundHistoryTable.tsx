import { AdminRefundLog } from '@/api/adminRefund';
import dayjs from '@/lib/dayjs';
import { Link } from 'react-router-dom';
import { resolveRefundScope } from '../utils/refundScope';

const programTypeLabel: Record<string, string> = {
  CHALLENGE: '챌린지',
  LIVE: '라이브',
  GUIDEBOOK: '가이드북',
  VOD: 'VOD',
  REPORT: '서류진단',
};

const statusLabel: Record<string, string> = {
  SUCCESS: '성공',
  FAILED: '실패',
  PENDING: '처리 중',
};

interface Props {
  logs: AdminRefundLog[];
  isLoading: boolean;
}

const RefundHistoryTable = ({ logs, isLoading }: Props) => {
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
        조건에 맞는 환불 이력이 없습니다.
      </p>
    );
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b bg-neutral-100 text-left">
          <th className="px-3 py-2">환불일자</th>
          <th className="px-3 py-2">프로그램</th>
          <th className="px-3 py-2">참여자</th>
          <th className="px-3 py-2">담당자</th>
          {/* 부분 환불은 비교 대상이 있어야 금액이 의미를 갖는다. */}
          <th className="px-3 py-2 text-right">원 결제액</th>
          <th className="px-3 py-2 text-right">환불 금액</th>
          <th className="px-3 py-2">사유</th>
          <th className="px-3 py-2">상태</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => {
          const scope = resolveRefundScope(log);

          return (
            <tr key={log.id} className="border-b align-top">
              <td className="whitespace-nowrap px-3 py-2">
                {log.refundedAt
                  ? dayjs(log.refundedAt).format('YYYY-MM-DD HH:mm')
                  : '-'}
              </td>
              <td className="px-3 py-2">
                <span className="mr-1 rounded bg-neutral-200 px-1.5 py-0.5 text-xs">
                  {programTypeLabel[log.programType ?? ''] ?? log.programType}
                </span>
                {log.programId ? (
                  <Link
                    className="underline"
                    to={`/programs/${log.programId}/users?programType=${log.programType}`}
                  >
                    {log.programTitle}
                  </Link>
                ) : (
                  log.programTitle
                )}
              </td>
              <td className="px-3 py-2">
                {/* 동명이인 구분을 위해 이메일을 함께 보여준다. */}
                <div>
                  {log.userName}
                  {log.isDeleted && (
                    // 참여자 행이 지워져 이 이력 말고는 남은 흔적이 없다.
                    <span className="ml-1 rounded bg-neutral-800 px-1.5 py-0.5 text-xs text-white">
                      삭제됨
                    </span>
                  )}
                </div>
                <div className="text-xs text-neutral-500">{log.userEmail}</div>
              </td>
              <td className="whitespace-nowrap px-3 py-2">{log.managerName}</td>
              <td className="whitespace-nowrap px-3 py-2 text-right">
                {log.originalAmount == null
                  ? '-'
                  : `${log.originalAmount.toLocaleString()}원`}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-right">
                {(log.refundedAmount ?? 0).toLocaleString()}원
                {scope && (
                  <span className="ml-1 rounded bg-neutral-200 px-1.5 py-0.5 text-xs">
                    {scope}
                  </span>
                )}
              </td>
              <td className="px-3 py-2">
                <span className="line-clamp-2" title={log.reason ?? ''}>
                  {log.reason}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-2">
                {log.status === 'FAILED' ? (
                  <span
                    className="font-bold text-red-600"
                    title={log.failureMessage ?? ''}
                  >
                    {statusLabel[log.status]}
                  </span>
                ) : (
                  <span>{statusLabel[log.status] ?? log.status}</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default RefundHistoryTable;
