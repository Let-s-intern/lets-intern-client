import type { AccessLogApplicationDetail } from '@/api/accessLog';
import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { UsageStatus } from '../../utils/usageDisplay';
import UsageDetailRow from '../UsageDetailRow';

/**
 * 상세 행이 답해야 하는 질문은 두 가지다.
 *
 *   1. 무엇을 이용했는가 — 미션이면 몇 회차 무슨 미션인가
 *   2. 내역이 없다면 왜 없는가 — 집계 대상 아님 / 집계 이전 / 미이용 / 확인 불가
 *
 * 2번이 뭉개지면 기록하지 않는 건과 이용하지 않은 건이 같은 화면으로 보이고,
 * 운영이 그것을 근거로 잘못된 전액 환불을 실행한다(PRD 7.4).
 */

const detailQuery = vi.fn();

vi.mock('@/api/accessLog', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useAccessLogDetailQuery: (...args: unknown[]) => detailQuery(...args),
}));

const response = (
  over: Partial<AccessLogApplicationDetail> = {},
): AccessLogApplicationDetail => ({
  firstAccessedAt: '2026-07-30T14:22:00',
  lastAccessedAt: '2026-08-05T09:11:00',
  accessCount: 12,
  paidAt: '2026-07-28T10:00:00',
  daysFromPaymentToFirstAccess: 2,
  trackedFrom: '2026-06-01T00:00:00',
  details: [],
  ...over,
});

/** 상세 행은 `tr` 이라 표 안에서만 유효하다. */
const renderDetail = (status: UsageStatus = 'USED') =>
  render(
    <table>
      <tbody>
        <UsageDetailRow applicationId={6001} colSpan={8} status={status} />
      </tbody>
    </table>,
  );

/**
 * 내부 표의 데이터 행만 고른다.
 * [0] 은 상세를 감싼 바깥 `tr`, [1] 은 내부 표의 헤더 행이다.
 */
const detailRows = () => screen.getAllByRole('row').slice(2);

const succeed = (details: AccessLogApplicationDetail['details']) =>
  detailQuery.mockReturnValue({
    data: response({ details }),
    isLoading: false,
    isError: false,
  });

beforeEach(() => {
  detailQuery.mockReset();
  succeed([]);
});

describe('UsageDetailRow 컬럼', () => {
  it('항목·최초 이용·최근 이용·횟수를 보여준다', () => {
    succeed([
      {
        targetType: 'CHALLENGE_DASHBOARD',
        targetId: 319,
        targetTitle: '면접 준비 7일 끝장 챌린지 7기',
        missionTh: null,
        firstAccessedAt: '2026-07-30T14:22:00',
        lastAccessedAt: '2026-08-05T09:11:00',
        accessCount: 8,
      },
    ]);
    renderDetail();

    expect(
      screen.getAllByRole('columnheader').map((th) => th.textContent),
    ).toEqual(['항목', '최초 이용', '최근 이용', '횟수']);

    const cells = within(detailRows()[0]).getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('대시보드');
    expect(cells[1]).toHaveTextContent('2026-07-30 14:22');
    expect(cells[2]).toHaveTextContent('2026-08-05 09:11');
    expect(cells[3]).toHaveTextContent('8회');
  });

  it('펼친 행의 신청서로 조회한다', () => {
    renderDetail();

    expect(detailQuery).toHaveBeenCalledWith(6001);
  });
});

describe('UsageDetailRow 항목 이름', () => {
  const target = (over: Record<string, unknown>) =>
    succeed([
      {
        targetType: 'MISSION',
        targetId: 9001,
        targetTitle: '경험 정리하기',
        missionTh: 3,
        firstAccessedAt: '2026-07-31T20:05:00',
        lastAccessedAt: '2026-07-31T20:07:00',
        accessCount: 2,
        ...over,
      },
    ]);

  it('자료는 미션 회차 아래에 이름만 들여쓴다', () => {
    // 회차를 자료 줄에도 적으면 부모 줄과 두 번 읽힌다. 소속은 들여쓰기가 말한다.
    target({});
    renderDetail();

    const rows = detailRows();
    expect(within(rows[0]).getAllByRole('cell')[0]).toHaveTextContent(
      '3회차 미션',
    );
    expect(within(rows[1]).getAllByRole('cell')[0]).toHaveTextContent(
      '경험 정리하기',
    );
  });

  it('같은 자료라도 미션이 다르면 각 회차 아래에 따로 붙는다', () => {
    // 자료는 공용 라이브러리라 여러 미션에 붙는다. 한 줄로 합쳐지면 어느 미션 자료를
    // 봤는지 말할 수 없어, 이 화면이 존재하는 이유가 사라진다(LC-3201).
    succeed([
      {
        targetType: 'MISSION',
        targetId: 9001,
        targetTitle: 'Resume, CV, Cover Letter',
        missionTh: 3,
        firstAccessedAt: '2026-07-31T20:05:00',
        lastAccessedAt: '2026-07-31T20:05:00',
        accessCount: 1,
      },
      {
        targetType: 'MISSION',
        targetId: 9002,
        targetTitle: 'Resume, CV, Cover Letter',
        missionTh: 7,
        firstAccessedAt: '2026-08-02T11:40:00',
        lastAccessedAt: '2026-08-02T11:42:00',
        accessCount: 2,
      },
    ]);
    renderDetail();

    const labels = detailRows().map(
      (row) => within(row).getAllByRole('cell')[0].textContent,
    );
    expect(labels).toEqual([
      '3회차 미션',
      'Resume, CV, Cover Letter',
      '7회차 미션',
      'Resume, CV, Cover Letter',
    ]);
  });

  it('미션 열람 기록이 없으면 부모 줄의 시각·횟수를 비운다', () => {
    // 자료만 열고 미션을 연 기록이 없을 수 있다. 0회로 적으면 "미션을 0번 봤다" 로
    // 읽히는데, 실제로는 그 미션을 연 기록 자체가 없는 것이다.
    target({});
    renderDetail();

    const parentCells = within(detailRows()[0]).getAllByRole('cell');
    expect(parentCells[1]).toHaveTextContent('-');
    expect(parentCells[3]).toHaveTextContent('-');
  });

  it('회차를 모르면 제목만 보여준다', () => {
    target({ missionTh: null });
    renderDetail();

    expect(screen.getByText('경험 정리하기')).toBeInTheDocument();
  });

  it('제목 조인이 실패하면 회차만 보여준다', () => {
    target({ targetTitle: null });
    renderDetail();

    expect(screen.getByText('3회차 미션')).toBeInTheDocument();
  });

  it('회차도 제목도 없으면 빈칸으로 두지 않고 식별자를 남긴다', () => {
    // 빈칸은 대상이 없다는 뜻으로 읽힌다. 사실은 무엇인지 모를 뿐이다.
    target({ missionTh: null, targetTitle: null });
    renderDetail();

    expect(screen.getByText('미션 (ID 9001)')).toBeInTheDocument();
  });

  it('대상 번호마저 없어도 빈칸으로 두지 않는다', () => {
    target({ missionTh: null, targetTitle: null, targetId: null });
    renderDetail();

    expect(screen.getByText('미션 (대상 미상)')).toBeInTheDocument();
  });

  it('대시보드는 대시보드로 적는다', () => {
    target({ targetType: 'CHALLENGE_DASHBOARD', missionTh: null });
    renderDetail();

    expect(screen.getByText('대시보드')).toBeInTheDocument();
  });

  it('VOD·가이드북 수령은 콘텐츠 수령으로 적는다', () => {
    // 이 칸은 무엇을 했는지를 적는 자리다. 프로그램 타입은 상위 행이 이미 보여준다.
    target({
      targetType: 'PROGRAM',
      missionTh: null,
      targetTitle: '자소서 VOD',
    });
    renderDetail();

    expect(screen.getByText('콘텐츠 수령')).toBeInTheDocument();
  });

  it('모르는 대상도 버리지 않는다', () => {
    // 조용히 사라지면 실제로는 이용한 행이 `내역 없음` 으로 읽힌다.
    target({ targetType: 'LIVE_SESSION', missionTh: null, targetTitle: null });
    renderDetail();

    expect(screen.getByText('기타(LIVE_SESSION)')).toBeInTheDocument();
    expect(detailRows()).toHaveLength(1);
  });

  it('대상 종류를 알 수 없어도 한 줄로 남는다', () => {
    target({ targetType: null, missionTh: null, targetTitle: null });
    renderDetail();

    expect(screen.getByText('기타 (ID 9001)')).toBeInTheDocument();
  });
});

describe('UsageDetailRow 조회 상태', () => {
  const LOADING = '상세 내역을 불러오는 중...';
  const FAILED = /상세 내역을 불러오지 못했습니다/;

  it('불러오는 중에는 내역 없음이라고 말하지 않는다', () => {
    detailQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    renderDetail('USED');

    expect(screen.getByText(LOADING)).toBeInTheDocument();
    expect(
      screen.queryByText(/대상별 내역이 없습니다/),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(FAILED)).not.toBeInTheDocument();
  });

  it('조회 실패를 내역 없음과 구분해 알린다', () => {
    // 못 읽은 것과 없는 것은 다르다(PRD 7.4). 실패가 내역 없음으로 보이면
    // 이용한 사람에게 전액 환불이 나간다.
    detailQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    renderDetail('USED');

    expect(screen.getByText(FAILED)).toBeInTheDocument();
    expect(
      screen.queryByText(/대상별 내역이 없습니다/),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(LOADING)).not.toBeInTheDocument();
  });

  it('내역이 있으면 상태 문구를 띄우지 않는다', () => {
    succeed([
      {
        targetType: 'CHALLENGE_DASHBOARD',
        targetId: 319,
        targetTitle: null,
        missionTh: null,
        firstAccessedAt: '2026-07-30T14:22:00',
        lastAccessedAt: '2026-08-05T09:11:00',
        accessCount: 8,
      },
    ]);
    renderDetail();

    expect(screen.queryByText(LOADING)).not.toBeInTheDocument();
    expect(screen.queryByText(FAILED)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/대상별 내역이 없습니다/),
    ).not.toBeInTheDocument();
  });
});

describe('UsageDetailRow 내역 없음의 이유', () => {
  it.each([
    ['NOT_TRACKED', '집계 대상 아님'],
    ['BEFORE_TRACKING', '기록 없음 (집계 이전)'],
    ['NOT_USED', '미이용'],
    ['UNKNOWN', '확인 불가'],
  ] as const)('%s 는 %s 로 구분해 적는다', (status, label) => {
    renderDetail(status);

    expect(
      screen.getByText(`${label} · 대상별 내역이 없습니다.`),
    ).toBeInTheDocument();
  });

  it('집계 대상이 아닌 건을 미이용으로 보여주지 않는다', () => {
    // 애초에 기록하지 않는 타입이라 이용 여부를 말할 수 없다(PRD 5.2).
    renderDetail('NOT_TRACKED');

    expect(screen.queryByText(/미이용/)).not.toBeInTheDocument();
  });

  it('집계 이전 건을 미이용으로 보여주지 않는다', () => {
    renderDetail('BEFORE_TRACKING');

    expect(screen.queryByText(/미이용/)).not.toBeInTheDocument();
  });

  it('요약과 낱개가 어긋나면 단정하지 않고 사실만 적는다', () => {
    renderDetail('USED');

    expect(
      screen.getByText('이용 기록은 있으나 대상별 내역이 없습니다.'),
    ).toBeInTheDocument();
  });

  it('환불 가부를 판정하는 문구를 쓰지 않는다', () => {
    renderDetail('NOT_USED');

    expect(screen.queryByText(/환불 가능/)).not.toBeInTheDocument();
    expect(screen.queryByText(/환불 불가/)).not.toBeInTheDocument();
  });
});
