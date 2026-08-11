import { useAccessLogDetailQuery } from '@/api/accessLog';

import { formatDateTime } from '../utils/formatDateTime';
import { summarizeDetailTargets } from '../utils/summarizeDetails';
import {
  formatTargetSummary,
  isRecentUnused,
  RECENT_UNUSED_NOTICE,
  resolveUsageStatus,
  USAGE_STATUS_LABEL,
  type UsageRecord,
} from '../utils/usageDisplay';

/**
 * 환불 모달 안의 이용 이력 블록 (LC-3201, PRD 7.1).
 *
 * 운영이 **금액을 정하기 전에** 볼 수 있도록 대상 정보와 금액 입력 사이에 놓인다.
 * 금액 입력 아래에 있으면 이미 정한 뒤에 보게 되어 의미가 없다.
 *
 * 여기서 환불 가부를 말하지 않는다. `환불 가능`·`환불 불가` 같은 결론을 화면이 내면
 * 예외 상황에서 잘못된 근거가 된다. 사실만 적고, 눈에 띄게 할 한 가지(결제 7일 이내
 * 미이용)도 문구는 사실 그대로다.
 *
 * **조회 실패가 환불을 막지 않는다.** 이 블록은 판단을 돕는 정보지 환불의 전제 조건이
 * 아니다. 그래서 조회 상태를 상위로 올리지 않고 이 컴포넌트 안에서 닫는다 — 상위가
 * 모르면 실수로 버튼을 잠글 수도 없다.
 */

interface Props {
  applicationId: number;
}

const RefundUsageSummary = ({ applicationId }: Props) => {
  const { data, isLoading, isError } = useAccessLogDetailQuery(applicationId);

  /**
   * 판정 근거를 한곳에 모은다. `programType` 이 빠지면 LIVE·REPORT 신청서가 `미이용` 으로
   * 보이고, 이 자리는 목록과 달리 곧바로 환불을 실행하는 화면이라 그 오표시가 그대로
   * 잘못된 전액 환불이 된다.
   */
  const record: UsageRecord | null = data
    ? {
        firstAccessedAt: data.firstAccessedAt,
        paidAt: data.paidAt,
        trackedFrom: data.trackedFrom,
        programType: data.programType,
      }
    : null;

  const status = resolveUsageStatus(record);

  /**
   * 로딩 · 조회 실패 · 기록 없음이 서로 배타적이어야 한다(PRD 7.4).
   * 못 읽은 것을 `미이용` 이나 `내역 없음` 으로 보이게 하면 없는 것과 같아진다.
   */
  const body = isLoading ? (
    <p className="text-neutral-35">이용 내역을 불러오는 중...</p>
  ) : isError || !data ? (
    <p className="text-neutral-35">
      이용 내역을 불러오지 못했습니다 ({USAGE_STATUS_LABEL.UNKNOWN}). 환불
      실행은 그대로 진행할 수 있습니다.
    </p>
  ) : (
    <dl className="grid grid-cols-[6rem_1fr] gap-y-1">
      <dt className="text-neutral-35">결제일</dt>
      <dd>{formatDateTime(data.paidAt)}</dd>

      {status === 'USED' ? (
        <>
          <dt className="text-neutral-35">최초 이용</dt>
          <dd>
            {formatDateTime(data.firstAccessedAt)}
            {/*
              경과 일수는 서버가 계산해 내려준 값을 그대로 쓴다(PRD 5.5).
              화면에서 다시 세면 시각 포함 여부·타임존 기준이 어긋나는데,
              6일과 7일의 경계가 곧 법정 전액 환불 여부다.
            */}
            {data.daysFromPaymentToFirstAccess != null &&
              ` (결제 +${data.daysFromPaymentToFirstAccess}일)`}
          </dd>

          <dt className="text-neutral-35">최근 이용</dt>
          <dd>{formatDateTime(data.lastAccessedAt)}</dd>

          {/*
            무엇을 이용했는지가 금액 판단에 직접 걸린다. 대시보드만 잠깐 들어간 것과
            미션 자료를 열람한 것은 "서비스를 이용했다"의 정도가 다르다(PRD 7.3).
          */}
          <dt className="text-neutral-35">이용 항목</dt>
          <dd>{formatTargetSummary(summarizeDetailTargets(data.details))}</dd>

          <dt className="text-neutral-35">이용 횟수</dt>
          <dd>{data.accessCount ?? 0}회</dd>
        </>
      ) : (
        <>
          {/*
            기록 없음의 네 갈래를 뭉개지 않는다. 라벨은 판정 유틸에서 가져와
            목록 표기와 어긋나지 않게 한다(PRD 7.4).
          */}
          <dt className="text-neutral-35">이용 기록</dt>
          <dd>{USAGE_STATUS_LABEL[status]}</dd>
        </>
      )}
    </dl>
  );

  return (
    /*
      이 프로젝트의 neutral 스케일은 뒤집혀 있다 — `neutral-0` 이 가장 어둡고(#27272D)
      `neutral-100` 이 가장 밝다(#FAFAFA). `bg-neutral-50` 은 거의 흰색이 아니라
      중간 회색(#ACAFB6)이라 글자가 묻힌다.
    */
    <section className="border-neutral-80 bg-neutral-95 mb-3 rounded border p-3 text-sm">
      <h3 className="mb-2 font-medium">이용 내역</h3>
      {body}
      {/*
        강조는 한 가지뿐이다. 판정 근거가 없는 건(`집계 이전`·`집계 대상 아님`·`확인 불가`)에는
        붙지 않는다 — 근거 없는 강조가 곧 잘못된 환불 근거가 된다. 기준 시각을 넘겨
        판정이 실제 시계에 숨어들지 않게 한다.
      */}
      {isRecentUnused(record, Date.now()) && (
        <p className="mt-2 font-bold text-amber-700">{RECENT_UNUSED_NOTICE}</p>
      )}
    </section>
  );
};

export default RefundUsageSummary;
