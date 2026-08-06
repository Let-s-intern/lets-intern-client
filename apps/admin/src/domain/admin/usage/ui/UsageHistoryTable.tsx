import type { AccessLogRow } from '@/api/accessLog';
import { twMerge } from '@/lib/twMerge';
import { Fragment, useState } from 'react';

import { formatProgramType } from '../constants/programType';
import { formatDateTime } from '../utils/formatDateTime';
import {
  formatTargetSummary,
  isRecentUnused,
  RECENT_UNUSED_NOTICE,
  resolveUsageStatus,
  USAGE_STATUS_LABEL,
} from '../utils/usageDisplay';
import UsageDetailRow from './UsageDetailRow';

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

/** 상세 행이 표 전체 너비를 차지하도록 맞춘다. 컬럼을 늘리면 여기도 함께 늘린다. */
const COLUMN_COUNT = 8;

const UsageHistoryTable = ({ rows, trackedFrom, isLoading, now }: Props) => {
  /**
   * 펼침은 행 단위다. 하나만 열리게 하면 두 신청서를 나란히 비교할 수 없는데,
   * 같은 유저의 결제 두 건을 견줘 보는 것이 이 화면의 흔한 사용법이다.
   *
   * 갱신은 이전 값을 받아 처리한다. 바깥 변수를 읽으면 토글 핸들러가 렌더마다
   * 새 값을 붙들어 연달아 누를 때 앞선 변경이 묻힌다.
   */
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<number>>(
    () => new Set(),
  );

  const toggleRow = (applicationId: number) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (!next.delete(applicationId)) next.add(applicationId);
      return next;
    });

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
          {/* 아이콘 대신 글자로 여닫는다. 화살표는 방향의 의미가 사람마다 갈린다. */}
          <th className="px-3 py-2">상세</th>
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
            /*
              목록 API 가 신청서 기준 left join 이라 적재 대상이 아닌 LIVE·REPORT
              신청서도 행으로 내려온다. 이 값을 넘기지 않으면 그 행들이 전부
              `미이용` 으로 보여, 애초에 기록하지 않는 건이 환불 대상으로 읽힌다.
            */
            programType: row.programType,
          };
          const status = resolveUsageStatus(record);
          const recentUnused = isRecentUnused(record, baseTime);
          const expanded = expandedIds.has(row.applicationId);
          const detailRowId = `usage-detail-${row.applicationId}`;

          const programText = [
            formatProgramType(row.programType),
            row.programTitle,
          ]
            .filter(Boolean)
            .join(' · ');

          return (
            <Fragment key={row.applicationId}>
              <tr
                className={twMerge(
                  'border-b align-top',
                  recentUnused && 'bg-amber-50',
                )}
              >
                <td className="px-3 py-2">
                  {/*
                    div 에 onClick 을 걸지 않는다. 키보드로 닿지 않고 스크린 리더가
                    여닫이라는 사실을 읽어 주지 못한다.
                  */}
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={expanded ? detailRowId : undefined}
                    onClick={() => toggleRow(row.applicationId)}
                    className="whitespace-nowrap rounded border border-neutral-300 px-2 py-1 text-xs"
                  >
                    {expanded ? '접기' : '펼치기'}
                  </button>
                </td>
                <td className="px-3 py-2">
                  {/* 동명이인 구분을 위해 이메일을 함께 보여준다. */}
                  <div>{row.userName ?? '-'}</div>
                  <div className="text-xs text-neutral-500">
                    {row.userEmail ?? '-'}
                  </div>
                </td>
                <td className="px-3 py-2">{programText || '-'}</td>
                {/*
                  결제일에 시각까지 적는다. 날짜만 보이면 같은 날 여러 번 결제한 건이
                  전부 같은 줄로 보여 어느 결제인지 구분되지 않는다. 실제로 같은 날
                  20~60분 간격의 결제 다섯 건이 중복 행으로 오해된 적이 있다.
                  이용 시각과 같은 형식이라 눈으로 바로 비교된다.
                */}
                <td className="whitespace-nowrap px-3 py-2">
                  {formatDateTime(row.paidAt)}
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
                      기록 없음의 갈래를 구분해 적는다(PRD 7.4).
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

              {/*
                펼쳤을 때만 그린다. 감춰 두기만 하면 목록을 여는 순간 행 수만큼
                단건 조회가 함께 나간다.
              */}
              {expanded ? (
                <UsageDetailRow
                  id={detailRowId}
                  applicationId={row.applicationId}
                  colSpan={COLUMN_COUNT}
                  status={status}
                />
              ) : null}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default UsageHistoryTable;
