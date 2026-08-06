import type { AccessLogRow } from '@/api/accessLog';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';

import { formatProgramType } from '../constants/programType';
import {
  formatTargetSummary,
  isRecentUnused,
  RECENT_UNUSED_NOTICE,
  resolveUsageStatus,
  USAGE_STATUS_LABEL,
} from '../utils/usageDisplay';

/**
 * 이용 히스토리 목록 표 (LC-3201, PRD 7.3).
 *
 * 이 표는 사실만 적는다. `환불 가능`·`환불 불가` 같은 결론을 쓰지 않는다.
 * 규정 판단은 운영의 몫이고, 화면이 결론을 내리면 예외 상황에서 잘못된 근거가 된다.
 *
 * 판정 로직은 전부 `usageDisplay` 에 있다. 여기서 날짜를 다시 비교하거나 7일을 세지 않는다.
 * 화면마다 기준을 새로 만들면 같은 건이 화면에 따라 다르게 보인다.
 */

interface Props {
  rows: AccessLogRow[];
  /** 집계 시작 시각. 응답 최상위 값이라 행마다 얹어 판정에 넘긴다. */
  trackedFrom?: string | null;
  isLoading: boolean;
  /**
   * 강조 판정의 기준 시각.
   *
   * 인자로 받는다. 내부에서 시계를 읽으면 테스트가 실제 시각에 의존해
   * 7일 경계를 검증할 수 없다.
   */
  now?: Date | number;
}

const formatDate = (value: string | null | undefined) =>
  value ? dayjs(value).format('YYYY-MM-DD') : '-';

const formatDateTime = (value: string | null | undefined) =>
  value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '-';

const UsageHistoryTable = ({ rows, trackedFrom, isLoading, now }: Props) => {
  // 로딩과 결과 없음을 구분한다. 빈 표만 두면 아직 못 받은 것인지 없는 것인지 알 수 없다.
  if (isLoading) {
    return (
      <p className="py-10 text-center text-sm text-neutral-500">
        불러오는 중...
      </p>
    );
  }

  if (rows.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-neutral-500">
        조건에 맞는 이용 이력이 없습니다.
      </p>
    );
  }

  const baseTime = now ?? Date.now();

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b bg-neutral-100 text-left">
          <th className="px-3 py-2">유저</th>
          <th className="px-3 py-2">프로그램</th>
          <th className="px-3 py-2">결제일</th>
          <th className="px-3 py-2">최초 이용</th>
          <th className="px-3 py-2">최근 이용</th>
          {/* "12회"만으로는 대시보드 새로고침인지 미션 열람인지 알 수 없다(PRD 4.6). */}
          <th className="px-3 py-2">이용 항목</th>
          <th className="px-3 py-2 text-right">이용 횟수</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const record = {
            firstAccessedAt: row.firstAccessedAt,
            paidAt: row.paidAt,
            trackedFrom,
          };
          const status = resolveUsageStatus(record);
          const recentUnused = isRecentUnused(record, baseTime);

          const programText = [
            formatProgramType(row.programType),
            row.programTitle,
          ]
            .filter(Boolean)
            .join(' · ');

          return (
            <tr
              key={row.applicationId}
              className={twMerge(
                'border-b align-top',
                recentUnused && 'bg-amber-50',
              )}
            >
              <td className="px-3 py-2">
                {/* 동명이인 구분을 위해 이메일을 함께 보여준다. */}
                <div>{row.userName ?? '-'}</div>
                <div className="text-xs text-neutral-500">
                  {row.userEmail ?? '-'}
                </div>
              </td>
              <td className="px-3 py-2">{programText || '-'}</td>
              <td className="whitespace-nowrap px-3 py-2">
                {formatDate(row.paidAt)}
              </td>
              <td className="px-3 py-2">
                {status === 'USED' ? (
                  <>
                    <div className="whitespace-nowrap">
                      {formatDateTime(row.firstAccessedAt)}
                    </div>
                    {/*
                      경과 일수는 서버가 계산해 내려준 값을 그대로 쓴다(PRD 5.5).
                      화면에서 다시 세면 시각 포함 여부·타임존 기준이 어긋난다.
                    */}
                    {row.daysFromPaymentToFirstAccess != null && (
                      <div className="text-xs text-neutral-500">
                        (결제 +{row.daysFromPaymentToFirstAccess}일)
                      </div>
                    )}
                  </>
                ) : (
                  /*
                    기록 없음 3종을 구분해 적는다(PRD 7.4).
                    집계 이전을 `미이용` 으로 보이게 하면 잘못된 전액 환불이 나간다.
                  */
                  <span className="text-neutral-500">
                    {USAGE_STATUS_LABEL[status]}
                  </span>
                )}
                {recentUnused && (
                  <div className="text-xs font-bold text-amber-700">
                    {RECENT_UNUSED_NOTICE}
                  </div>
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-2">
                {formatDateTime(row.lastAccessedAt)}
              </td>
              <td className="px-3 py-2">
                {formatTargetSummary(row.targetSummary)}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-right">
                {row.accessCount ?? 0}회
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UsageHistoryTable;
