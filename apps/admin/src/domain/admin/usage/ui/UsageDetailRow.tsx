import { type AccessLogDetail, useAccessLogDetailQuery } from '@/api/accessLog';

import { formatDateTime } from '../utils/formatDateTime';
import { USAGE_STATUS_LABEL, type UsageStatus } from '../utils/usageDisplay';

/**
 * 행을 펼쳤을 때 보이는 대상별 상세 (LC-3201, PRD 7.3).
 *
 * 목록은 `미션 3건` 까지만 말한다. 여기서 그것을 회차·제목으로 펴 준다.
 * "12회"가 대시보드 새로고침이었는지 미션 자료 열람이었는지는 이 자리에서만 갈린다.
 *
 * 이 컴포넌트가 마운트되는 순간 조회가 나간다. 그래서 호출부는 펼쳤을 때만 그린다 —
 * 목록을 그릴 때 전부 가져오면 한 페이지에 요청이 스무 개 더 붙는다.
 */

interface Props {
  applicationId: number;
  /** 상위 표의 컬럼 수. 상세가 표 전체 너비를 차지해야 한다. */
  colSpan: number;
  /**
   * 상위 행의 판정.
   *
   * `details` 가 비었을 때 그 이유를 적기 위해 받는다. 상세 응답만 보면
   * "내역이 없다"까지만 알 수 있는데, 그것을 그대로 쓰면 집계 대상이 아닌 건과
   * 미이용이 같은 문구로 보인다(PRD 7.4).
   *
   * 상세가 자체적으로 다시 판정하지 않는다. 목록과 상세가 서로 다른 답을 내면
   * 같은 신청서가 접었을 때와 펼쳤을 때 다르게 보인다.
   */
  status: UsageStatus;
  /** 펼침 버튼의 `aria-controls` 가 가리키는 대상. */
  id?: string;
}

/** 대상을 가리킬 다른 단서가 없을 때 남기는 식별자. */
const targetRef = (targetId: number | null | undefined) =>
  targetId != null ? `ID ${targetId}` : '대상 미상';

/**
 * 상세 한 줄의 항목 이름.
 *
 * 이 칸은 `대시보드`·`3회차 미션` 처럼 **무엇을 했는지**를 적는 자리다.
 * 그래서 `PROGRAM` 을 `프로그램` 이 아니라 `콘텐츠 수령` 으로 적는다. 상세 행은 상위 행에서
 * 프로그램 타입 문맥을 이미 물려받으므로 타입을 다시 쓰는 것은 중복이고, PRD 5.2 도
 * VOD·가이드북의 이용 시점을 `콘텐츠 수령`·다운로드로 정의한다.
 *
 * 대시보드·콘텐츠 수령에는 제목을 붙이지 않는다. 상위 행의 프로그램 컬럼에 이미 있어
 * 같은 문자열이 두 번 나온다. 미션만 회차·제목이 필요하다 — target_id 숫자만으로는
 * 운영이 무슨 미션인지 알 수 없다(PRD 7.3).
 *
 * 모르는 타입도 버리지 않는다. 서버가 대상을 추가했을 때 조용히 사라지면 실제로는
 * 이용한 행이 `내역 없음` 으로 읽혀 정반대의 결론이 나온다.
 */
const formatDetailTarget = (detail: AccessLogDetail): string => {
  const type = detail.targetType?.trim();
  const title = detail.targetTitle?.trim();

  if (type === 'CHALLENGE_DASHBOARD') return '대시보드';
  if (type === 'PROGRAM') return '콘텐츠 수령';

  if (type === 'MISSION') {
    const round =
      detail.missionTh != null ? `${detail.missionTh}회차 미션` : '';
    const label = [round, title].filter(Boolean).join(' · ');

    // 회차도 제목도 없으면 무슨 미션인지 말할 수 없다. 빈칸으로 두지 않고 식별자를 남긴다.
    return label || `미션 (${targetRef(detail.targetId)})`;
  }

  // 요약 컬럼(`formatTargetSummary`)과 같은 표기를 쓴다. 같은 대상이 두 자리에서
  // 다르게 보이면 운영이 별개의 것으로 읽는다.
  if (!type) return `기타 (${targetRef(detail.targetId)})`;

  return title ? `기타(${type}) · ${title}` : `기타(${type})`;
};

/**
 * 내역이 하나도 없을 때의 문구.
 *
 * `내역 없음` 하나로 뭉개지 않는다. 집계 대상이 아닌 건과 미이용이 같은 문구로 보이면
 * 운영이 잘못된 전액 환불을 실행한다. 라벨은 판정 유틸에서 가져와 목록 표기와 어긋나지 않게 한다.
 */
const emptyDetailText = (status: UsageStatus) =>
  status === 'USED'
    ? // 요약은 이용했다는데 낱개가 없다. 데이터가 어긋난 상태라 단정하지 않고 사실만 적는다.
      '이용 기록은 있으나 대상별 내역이 없습니다.'
    : `${USAGE_STATUS_LABEL[status]} · 대상별 내역이 없습니다.`;

const UsageDetailRow = ({ applicationId, colSpan, status, id }: Props) => {
  const { data, isLoading, isError } = useAccessLogDetailQuery(applicationId);

  const details = data?.details ?? [];

  /**
   * 로딩 · 조회 실패 · 내역 없음이 서로 배타적이어야 한다(PRD 7.4).
   * 특히 조회 실패가 `내역 없음` 으로 보이면 없는 것과 못 읽은 것이 같아진다.
   */
  const body = isLoading ? (
    <p className="text-neutral-500">상세 내역을 불러오는 중...</p>
  ) : isError ? (
    <p className="text-neutral-500">
      상세 내역을 불러오지 못했습니다 (확인 불가).
    </p>
  ) : details.length === 0 ? (
    <p className="text-neutral-500">{emptyDetailText(status)}</p>
  ) : (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b text-left text-neutral-500">
          <th className="px-3 py-1 font-normal">항목</th>
          <th className="px-3 py-1 font-normal">최초 이용</th>
          <th className="px-3 py-1 font-normal">최근 이용</th>
          <th className="px-3 py-1 text-right font-normal">횟수</th>
        </tr>
      </thead>
      <tbody>
        {details.map((detail, index) => (
          <tr
            // 대상 삭제 등으로 targetId 가 비어 올 수 있어 키를 단독으로 맡기지 못한다.
            key={`${detail.targetType ?? ''}-${detail.targetId ?? index}`}
            className="border-b last:border-b-0"
          >
            <td className="px-3 py-1">{formatDetailTarget(detail)}</td>
            <td className="whitespace-nowrap px-3 py-1">
              {formatDateTime(detail.firstAccessedAt)}
            </td>
            <td className="whitespace-nowrap px-3 py-1">
              {formatDateTime(detail.lastAccessedAt)}
            </td>
            <td className="whitespace-nowrap px-3 py-1 text-right">
              {detail.accessCount ?? 0}회
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <tr id={id} className="border-b bg-neutral-50">
      <td colSpan={colSpan} className="px-6 py-3 text-xs">
        {body}
      </td>
    </tr>
  );
};

export default UsageDetailRow;
