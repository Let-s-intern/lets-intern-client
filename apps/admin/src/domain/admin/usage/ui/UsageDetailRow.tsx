import clsx from 'clsx';
import { Fragment } from 'react';

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
 * 자료 줄의 이름. 회차는 부모 줄이 이미 말하므로 자료 이름만 남긴다.
 *
 * `3회차 · Resume` 를 `3회차 미션` 아래에 그대로 넣으면 회차가 두 번 읽힌다.
 */
const formatContentLabel = (detail: AccessLogDetail): string =>
  detail.contentTitle?.trim() || `자료 (${targetRef(detail.targetId)})`;

/**
 * 미션 회차로 묶은 상세 줄.
 *
 * 자료가 어느 미션 소속인지는 들여쓰기로만 드러난다. 평평한 목록에서는 `3회차 · Resume` 와
 * `7회차 · Resume` 가 이름으로만 갈려, 자료가 많아지면 소속을 눈으로 따라가야 한다.
 *
 * 미션 회차를 모르는 줄(대시보드·콘텐츠 수령·회차 미상)은 묶지 않고 위에 그대로 둔다.
 * 억지로 묶으면 소속이 없는 것을 있는 것처럼 보이게 만든다.
 */
interface DetailGroup {
  /** 부모 줄. 미션 열람 기록이 없으면 null 이고 자료만 들여쓰기로 나온다. */
  mission: AccessLogDetail | null;
  missionTh: number;
  contents: AccessLogDetail[];
}

const isMission = (detail: AccessLogDetail) =>
  detail.targetType?.trim() === 'MISSION';

/**
 * 미션 줄과 자료 줄을 가른다.
 *
 * `contentTitle` 로 가른다. `targetTitle` 은 미션 열람 행에도 미션 제목이 채워져 오므로
 * 그것으로 판단하면 <b>미션 열람이 전부 자료로 분류되어 부모 줄이 늘 비어 보인다.</b>
 * 실제로 그렇게 만들었다가 화면에서 잡았다.
 *
 * 템플릿은 미션 열람과 한 행이라 부모 줄에 남는다 - 유니크 키에 이름이 들어가면 그때
 * 자료 줄로 갈린다.
 */
const groupDetails = (details: AccessLogDetail[]) => {
  const ungrouped: AccessLogDetail[] = [];
  const groups = new Map<number, DetailGroup>();

  const groupOf = (missionTh: number) => {
    const found = groups.get(missionTh);
    if (found) return found;
    const created: DetailGroup = { mission: null, missionTh, contents: [] };
    groups.set(missionTh, created);
    return created;
  };

  for (const detail of details) {
    if (!isMission(detail) || detail.missionTh == null) {
      ungrouped.push(detail);
      continue;
    }

    const group = groupOf(detail.missionTh);
    if (detail.contentTitle?.trim()) group.contents.push(detail);
    else group.mission = detail;
  }

  return {
    ungrouped,
    groups: [...groups.values()].sort((a, b) => a.missionTh - b.missionTh),
  };
};

/**
 * 트리 연결선.
 *
 * 문자(└)가 아니라 보더로 그린다. 문자는 폰트마다 너비·높이가 달라 줄마다 어긋나는데
 * 보더는 셀 높이를 따라간다.
 *
 * `last` 면 세로선을 절반만 그린다. 끝까지 내리면 다음 형제로 이어지는 것처럼 보여
 * 소속을 잘못 읽는다.
 *
 * `throughLeft` 는 조상의 세로선이다. 자료 줄에서 미션의 선이 끊기면 자료가 어느 미션에
 * 매달렸는지 도중에 사라진다.
 */
const TreeBranch = ({
  left,
  last,
  throughLeft,
}: {
  left: string;
  last: boolean;
  throughLeft?: string;
}) => (
  <>
    {throughLeft && (
      <span
        aria-hidden
        className={`border-neutral-70 absolute top-0 h-full border-l ${throughLeft}`}
      />
    )}
    <span
      aria-hidden
      className={clsx(
        'border-neutral-70 absolute top-0 border-l',
        left,
        last ? 'h-1/2' : 'h-full',
      )}
    />
    <span
      aria-hidden
      className={`border-neutral-70 absolute top-1/2 w-2 border-t ${left}`}
    />
  </>
);

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
  const { ungrouped, groups } = groupDetails(details);

  /**
   * 로딩 · 조회 실패 · 내역 없음이 서로 배타적이어야 한다(PRD 7.4).
   * 특히 조회 실패가 `내역 없음` 으로 보이면 없는 것과 못 읽은 것이 같아진다.
   */
  const body = isLoading ? (
    <p className="text-neutral-35">상세 내역을 불러오는 중...</p>
  ) : isError ? (
    <p className="text-neutral-35">
      상세 내역을 불러오지 못했습니다 (확인 불가).
    </p>
  ) : details.length === 0 ? (
    <p className="text-neutral-35">{emptyDetailText(status)}</p>
  ) : (
    <table className="w-full border-collapse">
      <thead>
        {/* 목록 표 헤더와 같은 위계로 읽히게 한다. 흐리게 두면 상세가 부록처럼 보인다. */}
        <tr className="border-neutral-75 text-neutral-20 border-b text-left">
          <th className="px-3 py-1.5 font-medium">항목</th>
          <th className="px-3 py-1.5 font-medium">최초 이용</th>
          <th className="px-3 py-1.5 font-medium">최근 이용</th>
          <th className="px-3 py-1.5 text-right font-medium">횟수</th>
        </tr>
      </thead>
      {/*
        데이터 행에는 구분선을 두지 않는다. 트리 선이 이미 세로로 흐르고 있어 가로선을
        더하면 격자가 되어 계층이 묻힌다. 어느 줄을 보는지는 호버가 알려준다.
        헤더 아래 선만 남긴다 - 그건 계층이 아니라 표의 시작을 긋는 선이다.
      */}
      <tbody>
        {ungrouped.map((detail, index) => (
          <tr
            // 대상 삭제 등으로 targetId 가 비어 올 수 있어 키를 단독으로 맡기지 못한다.
            key={`${detail.targetType ?? ''}-${detail.targetId ?? index}`}
            className="hover:bg-neutral-90"
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

        {groups.map((group, groupIndex) => (
          <Fragment key={`mission-${group.missionTh}`}>
            <tr className="hover:bg-neutral-90">
              {/*
                미션은 대시보드를 거쳐야 닿는 자리라 한 단계 안으로 들인다.
                대시보드 · 미션 · 자료가 0.75rem 씩 계단을 이룬다.

                대시보드 열람 기록이 없어도 들여쓰기는 유지한다. 기록의 유무와 무관하게
                미션이 대시보드 안에 있다는 사실은 변하지 않고, 조건부로 바꾸면 같은 화면이
                신청서마다 다른 모양으로 보인다.
              */}
              <td className="relative py-1 pl-6 pr-3">
                <TreeBranch
                  left="left-4"
                  last={
                    groupIndex === groups.length - 1 &&
                    group.contents.length === 0
                  }
                />
                {group.mission
                  ? formatDetailTarget(group.mission)
                  : `${group.missionTh}회차 미션`}
              </td>
              {/*
                미션 열람 기록 없이 자료만 열린 경우가 있다. 그때 시각·횟수 칸을 0 이나 빈칸으로
                두면 "미션을 0회 봤다" 로 읽히는데, 실제로는 그 미션을 연 기록이 없는 것이다.
                값이 없다는 뜻의 `-` 를 그대로 쓴다.
              */}
              <td className="whitespace-nowrap px-3 py-1">
                {group.mission
                  ? formatDateTime(group.mission.firstAccessedAt)
                  : '-'}
              </td>
              <td className="whitespace-nowrap px-3 py-1">
                {group.mission
                  ? formatDateTime(group.mission.lastAccessedAt)
                  : '-'}
              </td>
              <td className="whitespace-nowrap px-3 py-1 text-right">
                {group.mission ? `${group.mission.accessCount ?? 0}회` : '-'}
              </td>
            </tr>

            {group.contents.map((content, index) => (
              <tr
                key={`content-${content.targetId ?? index}`}
                className="hover:bg-neutral-90"
              >
                {/*
                  종속을 선으로 잇는다. 문자(└)가 아니라 보더로 그리는 이유는, 문자는 폰트마다
                  너비와 높이가 달라 줄마다 어긋나기 때문이다. 보더는 셀 높이를 따라간다.

                  마지막 자료는 세로선을 절반만 그린다. 끝까지 내리면 다음 미션으로 이어지는
                  것처럼 보여 소속을 잘못 읽는다.
                */}
                <td className="text-neutral-20 relative py-1 pl-9 pr-3">
                  <TreeBranch
                    left="left-7"
                    last={index === group.contents.length - 1}
                    throughLeft={
                      groupIndex === groups.length - 1 ? undefined : 'left-4'
                    }
                  />
                  {formatContentLabel(content)}
                </td>
                <td className="whitespace-nowrap px-3 py-1">
                  {formatDateTime(content.firstAccessedAt)}
                </td>
                <td className="whitespace-nowrap px-3 py-1">
                  {formatDateTime(content.lastAccessedAt)}
                </td>
                <td className="whitespace-nowrap px-3 py-1 text-right">
                  {content.accessCount ?? 0}회
                </td>
              </tr>
            ))}
          </Fragment>
        ))}
      </tbody>
    </table>
  );

  return (
    /*
      배경을 어둡게 해서 계층을 만들지 않는다. 펼침 영역은 본문의 일부지 별개 블록이 아니다.
      종속 관계는 왼쪽 보더와 들여쓰기로 나타낸다.

      이 프로젝트의 neutral 스케일은 뒤집혀 있다 — `neutral-0` 이 가장 어둡고(#27272D)
      `neutral-100` 이 가장 밝다(#FAFAFA). 여느 Tailwind 감각으로 `bg-neutral-50` 을 쓰면
      거의 흰색이 아니라 중간 회색(#ACAFB6)이 깔려 글자가 묻힌다.
    */
    <tr id={id} className="bg-neutral-95 border-b">
      <td colSpan={colSpan} className="px-6 py-3 text-sm">
        <div className="border-neutral-75 border-l-2 pl-4">{body}</div>
      </td>
    </tr>
  );
};

export default UsageDetailRow;
