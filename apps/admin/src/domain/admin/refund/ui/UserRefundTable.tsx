import { UserRefundItem } from '@/api/adminRefund';
import dayjs from '@/lib/dayjs';
import { Link } from 'react-router-dom';

const programTypeLabel: Record<string, string> = {
  CHALLENGE: '챌린지',
  LIVE: '라이브',
  GUIDEBOOK: '가이드북',
  VOD: 'VOD',
  REPORT: '서류진단',
};

const scopeLabel: Record<string, string> = {
  FULL: '전액',
  PARTIAL: '부분',
};

const sourceLabel: Record<string, string> = {
  USER: '유저 환불',
  SQL: 'SQL 환불',
};

interface Props {
  refunds: UserRefundItem[];
  isLoading: boolean;
}

/**
 * 유저 환불 이력.
 *
 * 어드민 탭과 컬럼이 다르다. 담당자·사유·상태는 유저 환불에 존재하지 않는 값이라
 * 빈칸으로 두지 않고 아예 뺀다.
 *
 * 환불 시각이 저장되지 않아 payment.lastModifiedDate 가 근사치다. SQL 로 직접 처리한
 * 건은 그 값이 결제 시각과 사실상 같아 환불 시각으로 읽으면 안 된다. 시각 칸은 `-` 로
 * 두고 SQL 이라는 사실은 처리경로 칸에서 말한다.
 */
const UserRefundTable = ({ refunds, isLoading }: Props) => {
  if (isLoading) {
    return (
      <p className="py-10 text-center text-sm text-neutral-500">
        불러오는 중...
      </p>
    );
  }

  if (refunds.length === 0) {
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
          <th className="px-3 py-2">환불일시</th>
          <th className="px-3 py-2">참여자</th>
          <th className="px-3 py-2">프로그램</th>
          <th className="px-3 py-2 text-right">환불액</th>
          <th className="px-3 py-2 text-right">원 결제액</th>
          <th className="px-3 py-2">처리경로</th>
        </tr>
      </thead>
      <tbody>
        {refunds.map((refund) => {
          const isSql = refund.refundSource === 'SQL';

          return (
            <tr
              key={refund.paymentId ?? refund.applicationId}
              className="border-b align-top"
            >
              <td className="whitespace-nowrap px-3 py-2">
                {isSql || !refund.refundedAt
                  ? '-'
                  : dayjs(refund.refundedAt).format('YYYY-MM-DD HH:mm')}
              </td>
              <td className="px-3 py-2">
                {/* 동명이인 구분을 위해 이메일을 함께 보여준다. */}
                <div>{refund.userName}</div>
                <div className="text-xs text-neutral-500">
                  {refund.userEmail}
                </div>
              </td>
              <td className="px-3 py-2">
                <span className="mr-1 rounded bg-neutral-200 px-1.5 py-0.5 text-xs">
                  {programTypeLabel[refund.programType ?? ''] ??
                    refund.programType}
                </span>
                {refund.programId ? (
                  <Link
                    className="underline"
                    to={`/programs/${refund.programId}/users?programType=${refund.programType}`}
                  >
                    {refund.programTitle}
                  </Link>
                ) : (
                  refund.programTitle
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-right">
                {(refund.refundedAmount ?? 0).toLocaleString()}원
                <span className="ml-1 rounded bg-neutral-200 px-1.5 py-0.5 text-xs">
                  {scopeLabel[refund.refundScope]}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-right">
                {refund.originalAmount == null
                  ? '-'
                  : `${refund.originalAmount.toLocaleString()}원`}
              </td>
              <td className="whitespace-nowrap px-3 py-2">
                {sourceLabel[refund.refundSource]}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UserRefundTable;
