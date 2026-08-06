import type { AccessLogRow } from '@/api/accessLog';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RECENT_UNUSED_NOTICE } from '../../utils/usageDisplay';
import UsageHistoryTable from '../UsageHistoryTable';

/**
 * 이 표에서 가장 사고가 나기 쉬운 지점은 "기록이 없다"의 세 갈래가 뭉개지는 것이다.
 * 집계 이전 결제가 `미이용` 으로 보이면 운영이 잘못된 전액 환불을 실행하고, 그 방향의
 * 오류는 되돌릴 수 없다. 그래서 세 표기와 강조 조건을 각각 못 박아 둔다.
 *
 * 기준 시각을 인자로 주입한다. 실제 시계를 쓰면 7일 경계가 시간이 지나며 조용히 뒤집힌다.
 */

const NOW = new Date('2026-08-06T12:00:00');
const TRACKED_FROM = '2026-06-01T00:00:00';

const row = (over: Partial<AccessLogRow> = {}): AccessLogRow => ({
  applicationId: 6001,
  userId: 13101,
  userName: '김렛츠',
  userEmail: 'lets@example.com',
  programType: 'CHALLENGE',
  programId: 319,
  programTitle: '기필코 경험정리 21기',
  paidAt: '2026-07-28T10:00:00',
  firstAccessedAt: '2026-07-30T14:22:00',
  lastAccessedAt: '2026-08-05T09:11:00',
  accessCount: 12,
  daysFromPaymentToFirstAccess: 2,
  targetSummary: [
    { targetType: 'CHALLENGE_DASHBOARD', count: 1 },
    { targetType: 'MISSION', count: 3 },
  ],
  ...over,
});

const renderTable = (
  rows: AccessLogRow[],
  trackedFrom: string | null = TRACKED_FROM,
) =>
  render(
    <UsageHistoryTable
      rows={rows}
      trackedFrom={trackedFrom}
      isLoading={false}
      now={NOW}
    />,
  );

const firstRow = () => screen.getAllByRole('row')[1];

describe('UsageHistoryTable 컬럼', () => {
  it('일곱 컬럼을 모두 보여준다', () => {
    renderTable([row()]);

    const headers = screen
      .getAllByRole('columnheader')
      .map((th) => th.textContent);

    expect(headers).toEqual([
      '유저',
      '프로그램',
      '결제일',
      '최초 이용',
      '최근 이용',
      '이용 항목',
      '이용 횟수',
    ]);
  });

  it('유저·프로그램·결제일·최초 이용·최근 이용·횟수를 채운다', () => {
    renderTable([row()]);

    const cells = within(firstRow()).getAllByRole('cell');

    expect(cells[0]).toHaveTextContent('김렛츠');
    expect(cells[0]).toHaveTextContent('lets@example.com');
    expect(cells[1]).toHaveTextContent('챌린지 · 기필코 경험정리 21기');
    expect(cells[2]).toHaveTextContent('2026-07-28');
    expect(cells[3]).toHaveTextContent('2026-07-30 14:22');
    expect(cells[4]).toHaveTextContent('2026-08-05 09:11');
    expect(cells[6]).toHaveTextContent('12회');
  });

  it('무엇을 이용했는지 항목으로 보여준다', () => {
    // "12회"만으로는 대시보드 새로고침인지 미션 열람인지 알 수 없다(PRD 4.6).
    renderTable([row()]);

    expect(within(firstRow()).getAllByRole('cell')[5]).toHaveTextContent(
      '대시보드, 미션 3건',
    );
  });

  it('결제 후 며칠 만에 이용했는지는 서버가 준 값을 쓴다', () => {
    renderTable([row({ daysFromPaymentToFirstAccess: 2 })]);

    expect(within(firstRow()).getByText('(결제 +2일)')).toBeInTheDocument();
  });
});

describe('UsageHistoryTable 기록 없음 표기', () => {
  it('집계 이전 결제를 미이용으로 보여주지 않는다', () => {
    // 이 구분이 없으면 과거 결제가 전부 미이용으로 보여 잘못된 전액 환불이 나간다.
    renderTable([
      row({
        paidAt: '2026-05-01T10:00:00',
        firstAccessedAt: null,
        lastAccessedAt: null,
        accessCount: 0,
        daysFromPaymentToFirstAccess: null,
        targetSummary: [],
      }),
    ]);

    expect(
      within(firstRow()).getByText('기록 없음 (집계 이전)'),
    ).toBeInTheDocument();
    expect(within(firstRow()).queryByText('미이용')).not.toBeInTheDocument();
  });

  it('집계 시작 이후 결제인데 기록이 없으면 미이용으로 보여준다', () => {
    renderTable([
      row({
        paidAt: '2026-07-01T10:00:00',
        firstAccessedAt: null,
        lastAccessedAt: null,
        accessCount: 0,
        daysFromPaymentToFirstAccess: null,
        targetSummary: [],
      }),
    ]);

    expect(within(firstRow()).getByText('미이용')).toBeInTheDocument();
  });

  it('집계 시작 시각을 모르면 확인 불가로 보여준다', () => {
    // 판정 근거가 없는 건을 미이용으로 떨어뜨리면 잘못된 환불로 이어진다(PRD 7.4).
    renderTable(
      [
        row({
          firstAccessedAt: null,
          lastAccessedAt: null,
          accessCount: 0,
          daysFromPaymentToFirstAccess: null,
          targetSummary: [],
        }),
      ],
      null,
    );

    expect(within(firstRow()).getByText('확인 불가')).toBeInTheDocument();
    expect(within(firstRow()).queryByText('미이용')).not.toBeInTheDocument();
  });

  it('이용 항목이 하나도 없으면 없음으로 적는다', () => {
    renderTable([row({ targetSummary: [] })]);

    expect(within(firstRow()).getAllByRole('cell')[5]).toHaveTextContent(
      '없음',
    );
  });
});

describe('UsageHistoryTable 강조', () => {
  const unused = (paidAt: string) =>
    row({
      paidAt,
      firstAccessedAt: null,
      lastAccessedAt: null,
      accessCount: 0,
      daysFromPaymentToFirstAccess: null,
      targetSummary: [],
    });

  it('결제 후 7일 이내이면서 이용 기록이 없는 행에 사실 문구를 붙인다', () => {
    renderTable([unused('2026-08-04T10:00:00')]);

    expect(
      within(firstRow()).getByText(RECENT_UNUSED_NOTICE),
    ).toBeInTheDocument();
  });

  it('결제 후 7일이 지난 미이용 행에는 붙이지 않는다', () => {
    renderTable([unused('2026-07-01T10:00:00')]);

    expect(
      within(firstRow()).queryByText(RECENT_UNUSED_NOTICE),
    ).not.toBeInTheDocument();
  });

  it('집계 이전 행에는 7일 이내여도 붙이지 않는다', () => {
    // 판정 근거가 없는 행을 강조하면 그 강조가 곧 잘못된 환불 근거가 된다.
    renderTable([unused('2026-08-04T10:00:00')], '2026-08-05T00:00:00');

    expect(
      within(firstRow()).getByText('기록 없음 (집계 이전)'),
    ).toBeInTheDocument();
    expect(
      within(firstRow()).queryByText(RECENT_UNUSED_NOTICE),
    ).not.toBeInTheDocument();
  });

  it('환불 가부를 판정하는 문구를 쓰지 않는다', () => {
    // 규정 판단은 운영의 몫이다. 화면이 결론을 내리면 예외 상황에서 잘못된 근거가 된다.
    renderTable([row(), unused('2026-08-04T10:00:00')]);

    expect(screen.queryByText(/환불 가능/)).not.toBeInTheDocument();
    expect(screen.queryByText(/환불 불가/)).not.toBeInTheDocument();
  });
});

describe('UsageHistoryTable 조회 상태', () => {
  it('불러오는 중과 결과 없음을 구분한다', () => {
    const { rerender } = render(
      <UsageHistoryTable rows={[]} trackedFrom={TRACKED_FROM} isLoading />,
    );

    expect(screen.getByText('불러오는 중...')).toBeInTheDocument();
    expect(
      screen.queryByText('조건에 맞는 이용 이력이 없습니다.'),
    ).not.toBeInTheDocument();

    rerender(
      <UsageHistoryTable
        rows={[]}
        trackedFrom={TRACKED_FROM}
        isLoading={false}
      />,
    );

    expect(
      screen.getByText('조건에 맞는 이용 이력이 없습니다.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('불러오는 중...')).not.toBeInTheDocument();
  });
});
