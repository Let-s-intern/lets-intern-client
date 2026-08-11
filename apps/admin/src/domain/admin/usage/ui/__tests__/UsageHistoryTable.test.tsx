import type { AccessLogRow } from '@/api/accessLog';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RECENT_UNUSED_NOTICE } from '../../utils/usageDisplay';
import UsageHistoryTable from '../UsageHistoryTable';

/**
 * 상세 조회는 목으로 둔다. 여기서 확인할 것은 응답 모양이 아니라
 * **언제 조회가 나가는가**다. 상세 표기는 UsageDetailRow 테스트가 덮는다.
 */
const detailQuery = vi.fn();

vi.mock('@/api/accessLog', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useAccessLogDetailQuery: (...args: unknown[]) => detailQuery(...args),
}));

/**
 * 이 표에서 가장 사고가 나기 쉬운 지점은 "기록이 없다"의 갈래가 뭉개지는 것이다.
 * 집계 이전 결제나 적재 대상이 아닌 타입이 `미이용` 으로 보이면 운영이 잘못된 전액
 * 환불을 실행하고, 그 방향의 오류는 되돌릴 수 없다. 그래서 표기와 강조 조건을 각각 못 박아 둔다.
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

beforeEach(() => {
  detailQuery.mockReset();
  detailQuery.mockReturnValue({
    data: { details: [] },
    isLoading: false,
    isError: false,
  });
});

describe('UsageHistoryTable 컬럼', () => {
  it('여덟 컬럼을 모두 보여준다', () => {
    renderTable([row()]);

    const headers = screen
      .getAllByRole('columnheader')
      .map((th) => th.textContent);

    expect(headers).toEqual([
      '상세',
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

    expect(cells[1]).toHaveTextContent('김렛츠');
    expect(cells[1]).toHaveTextContent('lets@example.com');
    expect(cells[2]).toHaveTextContent('챌린지 · 기필코 경험정리 21기');
    expect(cells[3]).toHaveTextContent('2026-07-28');
    expect(cells[4]).toHaveTextContent('2026-07-30 14:22');
    expect(cells[5]).toHaveTextContent('2026-08-05 09:11');
    expect(cells[7]).toHaveTextContent('12회');
  });

  it('무엇을 이용했는지 항목으로 보여준다', () => {
    // "12회"만으로는 대시보드 새로고침인지 미션 열람인지 알 수 없다(PRD 4.6).
    renderTable([row()]);

    expect(within(firstRow()).getAllByRole('cell')[6]).toHaveTextContent(
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

  it('적재 대상이 아닌 타입을 미이용으로 보여주지 않는다', () => {
    // 목록이 신청서 기준 left join 이라 LIVE 도 행으로 내려온다. 애초에 기록하지
    // 않는 타입이라 이용 여부를 말할 수 없다(PRD 5.2).
    renderTable([
      row({
        programType: 'LIVE',
        paidAt: '2026-08-04T10:00:00',
        firstAccessedAt: null,
        lastAccessedAt: null,
        accessCount: 0,
        daysFromPaymentToFirstAccess: null,
        targetSummary: [],
      }),
    ]);

    expect(within(firstRow()).getByText('집계 대상 아님')).toBeInTheDocument();
    expect(within(firstRow()).queryByText('미이용')).not.toBeInTheDocument();
  });

  it('이용 항목이 하나도 없으면 없음으로 적는다', () => {
    renderTable([row({ targetSummary: [] })]);

    expect(within(firstRow()).getAllByRole('cell')[6]).toHaveTextContent(
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

  it('적재 대상이 아닌 타입은 7일 이내여도 붙이지 않는다', () => {
    // 기록하지 않는 타입을 강조하면 그 강조가 곧 잘못된 환불 근거가 된다.
    renderTable([{ ...unused('2026-08-04T10:00:00'), programType: 'LIVE' }]);

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

describe('UsageHistoryTable 행 펼침', () => {
  const twoRows = () => [
    row({ applicationId: 6001 }),
    row({ applicationId: 6005, userName: '오새로' }),
  ];

  it('펼치기 전에는 상세를 조회하지 않는다', () => {
    // 목록을 그릴 때 전부 가져오면 한 페이지에 요청이 행 수만큼 더 붙는다.
    renderTable(twoRows());

    expect(detailQuery).not.toHaveBeenCalled();
  });

  it('펼치면 그 행의 신청서만 조회한다', async () => {
    const user = userEvent.setup();
    renderTable(twoRows());

    await user.click(screen.getAllByRole('button', { name: '펼치기' })[0]);

    expect(detailQuery).toHaveBeenCalledWith(6001);
    expect(detailQuery).not.toHaveBeenCalledWith(6005);
  });

  it('여러 행을 동시에 펼칠 수 있다', async () => {
    // 같은 유저의 결제 두 건을 나란히 견주는 것이 이 화면의 흔한 사용법이다.
    const user = userEvent.setup();
    renderTable(twoRows());

    await user.click(screen.getAllByRole('button', { name: '펼치기' })[0]);
    await user.click(screen.getAllByRole('button', { name: '펼치기' })[0]);

    expect(screen.getAllByRole('button', { name: '접기' })).toHaveLength(2);
    expect(detailQuery).toHaveBeenCalledWith(6001);
    expect(detailQuery).toHaveBeenCalledWith(6005);
  });

  it('다시 누르면 접히고 그 행만 닫힌다', async () => {
    const user = userEvent.setup();
    renderTable(twoRows());

    await user.click(screen.getAllByRole('button', { name: '펼치기' })[0]);
    await user.click(screen.getAllByRole('button', { name: '펼치기' })[0]);
    await user.click(screen.getAllByRole('button', { name: '접기' })[0]);

    expect(screen.getAllByRole('button', { name: '접기' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: '펼치기' })).toHaveLength(1);
  });

  it('펼침 상태를 aria-expanded 로 알린다', async () => {
    // div 에 onClick 만 걸면 키보드로 닿지 않고 여닫이라는 사실이 읽히지 않는다.
    const user = userEvent.setup();
    renderTable([row()]);

    const toggle = screen.getByRole('button', { name: '펼치기' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);

    expect(screen.getByRole('button', { name: '접기' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('상세를 불러오는 중임을 내역 없음과 구분해 알린다', async () => {
    const user = userEvent.setup();
    detailQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    renderTable([row()]);

    await user.click(screen.getByRole('button', { name: '펼치기' }));

    expect(screen.getByText('상세 내역을 불러오는 중...')).toBeInTheDocument();
    expect(
      screen.queryByText(/대상별 내역이 없습니다/),
    ).not.toBeInTheDocument();
  });

  it('상세 조회 실패를 내역 없음으로 보여주지 않는다', async () => {
    // 못 읽은 것과 없는 것은 다르다(PRD 7.4).
    const user = userEvent.setup();
    detailQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    renderTable([row()]);

    await user.click(screen.getByRole('button', { name: '펼치기' }));

    expect(
      screen.getByText(/상세 내역을 불러오지 못했습니다/),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/대상별 내역이 없습니다/),
    ).not.toBeInTheDocument();
  });

  it.each([
    ['LIVE', '2026-08-04T10:00:00', '집계 대상 아님'],
    ['CHALLENGE', '2026-05-01T10:00:00', '기록 없음 (집계 이전)'],
    ['CHALLENGE', '2026-08-04T10:00:00', '미이용'],
  ])(
    '상세가 비었을 때 %s / %s 는 %s 로 구분해 적는다',
    async (programType, paidAt, label) => {
      // `내역 없음` 하나로 뭉개면 기록하지 않는 건과 이용하지 않은 건이 같아진다.
      const user = userEvent.setup();
      renderTable([
        row({
          programType,
          paidAt,
          firstAccessedAt: null,
          lastAccessedAt: null,
          accessCount: 0,
          daysFromPaymentToFirstAccess: null,
          targetSummary: [],
        }),
      ]);

      await user.click(screen.getByRole('button', { name: '펼치기' }));

      expect(
        screen.getByText(`${label} · 대상별 내역이 없습니다.`),
      ).toBeInTheDocument();
    },
  );

  it('판정 근거가 없으면 상세에서도 확인 불가로 적는다', async () => {
    const user = userEvent.setup();
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

    await user.click(screen.getByRole('button', { name: '펼치기' }));

    expect(
      screen.getByText('확인 불가 · 대상별 내역이 없습니다.'),
    ).toBeInTheDocument();
  });

  it('여닫는 표시에 아이콘을 쓰지 않는다', () => {
    // 화살표는 방향의 의미가 사람마다 갈리고 폰트·플랫폼마다 다르게 렌더된다.
    renderTable([row()]);

    expect(screen.getByRole('button', { name: '펼치기' }).textContent).toBe(
      '펼치기',
    );
  });
});

describe('UsageHistoryTable 참여자 목록 링크', () => {
  const link = () => screen.queryByRole('link', { name: /참여자 목록/ });

  it('프로그램과 신청서를 정확히 지목하는 주소로 건너간다', () => {
    // 환불은 참여자 목록에서 실행한다. 이 화면은 거기로 보내기만 한다.
    renderTable([
      row({ applicationId: 6001, programId: 319, programType: 'CHALLENGE' }),
    ]);

    expect(link()).toHaveAttribute(
      'href',
      '/programs/319/users?programType=CHALLENGE#application-6001',
    );
  });

  it('programType 이 없으면 링크를 아예 만들지 않는다', () => {
    /*
      받는 화면이 `searchParams.get('programType') ?? CHALLENGE` 로 읽는다.
      파라미터를 빼고 보내면 VOD 신청서인데도 챌린지 참여자 목록이 뜨고,
      운영이 그 잘못된 화면에서 환불을 누른다. 이 테스트가 그 경로를 막는다.
    */
    renderTable([row({ programId: 319, programType: null })]);

    expect(link()).not.toBeInTheDocument();
  });

  it('programId 가 없으면 링크를 만들지 않는다', () => {
    renderTable([row({ programId: null, programType: 'VOD' })]);

    expect(link()).not.toBeInTheDocument();
  });

  it('링크를 못 만든 자리를 빈칸으로 두지 않는다', () => {
    // 빈칸은 "링크가 없다"가 아니라 "화면이 깨졌다"로 읽힌다.
    renderTable([row({ programId: null, programType: null })]);

    expect(within(firstRow()).getAllByText('-').length).toBeGreaterThan(0);
  });

  it('챌린지가 아닌 타입도 자기 타입 그대로 넘긴다', () => {
    renderTable([
      row({ applicationId: 7002, programId: 42, programType: 'GUIDEBOOK' }),
    ]);

    expect(link()).toHaveAttribute(
      'href',
      '/programs/42/users?programType=GUIDEBOOK#application-7002',
    );
  });

  it('새 탭으로 열어 보던 목록을 잃지 않는다', () => {
    // 같은 탭에서 넘어가면 걸어 둔 필터와 펼쳐 둔 상세가 사라진다.
    renderTable([row()]);

    expect(link()).toHaveAttribute('target', '_blank');
    expect(link()).toHaveAttribute('rel', 'noreferrer');
  });

  it('링크를 넣어도 컬럼 수는 그대로다', async () => {
    /*
      링크를 프로그램 칸 안에 두고 열을 늘리지 않았다. 열을 늘렸다면 COLUMN_COUNT 와
      상세 행 colSpan 을 함께 올려야 하고, 빠뜨리면 펼침 영역 너비가 어긋난다.
    */
    const user = userEvent.setup();
    renderTable([row()]);

    expect(screen.getAllByRole('columnheader')).toHaveLength(8);

    await user.click(screen.getByRole('button', { name: '펼치기' }));

    const detailCell = screen
      .getAllByRole('cell')
      .find((cell) => cell.hasAttribute('colspan'));

    expect(detailCell).toHaveAttribute('colspan', '8');
  });

  it('링크 문구로 환불 가부를 말하지 않는다', () => {
    // 규정 판단은 운영의 몫이다. 링크는 이동 수단이지 결론이 아니다.
    renderTable([row()]);

    expect(link()).toHaveTextContent('참여자 목록');
    expect(screen.queryByText(/환불/)).not.toBeInTheDocument();
  });
});

describe('결제일 표기', () => {
  it('결제일에 시각까지 적는다', () => {
    renderTable([row({ paidAt: '2026-08-05T16:08:07' })]);

    expect(screen.getByText('2026-08-05 16:08')).toBeInTheDocument();
  });

  it('같은 날 여러 번 결제한 건이 서로 구분된다', () => {
    // 날짜만 보이면 다섯 줄이 똑같아 보여 중복 행으로 오해된다.
    // 실제로 같은 날 20~60분 간격의 결제 다섯 건이 버그로 신고된 적이 있다.
    renderTable([
      row({ applicationId: 750, paidAt: '2026-08-05T16:08:07' }),
      row({ applicationId: 749, paidAt: '2026-08-05T15:34:38' }),
      row({ applicationId: 748, paidAt: '2026-08-05T14:59:34' }),
    ]);

    expect(screen.getByText('2026-08-05 16:08')).toBeInTheDocument();
    expect(screen.getByText('2026-08-05 15:34')).toBeInTheDocument();
    expect(screen.getByText('2026-08-05 14:59')).toBeInTheDocument();
  });

  it('결제일과 이용 시각이 같은 형식이라 눈으로 비교된다', () => {
    renderTable([
      row({
        paidAt: '2026-07-28T10:00:00',
        firstAccessedAt: '2026-07-30T14:22:00',
      }),
    ]);

    expect(screen.getByText('2026-07-28 10:00')).toBeInTheDocument();
    expect(screen.getByText('2026-07-30 14:22')).toBeInTheDocument();
  });

  it('결제일이 없으면 빈칸이 아니라 표시를 남긴다', () => {
    renderTable([row({ paidAt: null })]);

    expect(screen.getAllByText('-').length).toBeGreaterThan(0);
  });
});

describe('참여자 화면이 없는 타입', () => {
  const link = () => screen.queryByRole('link', { name: /참여자 목록/ });

  it('REPORT 는 링크를 만들지 않는다', () => {
    // 참여자 화면이 없어 넘어가면 빈 목록이 뜨고, 환불 분쟁 중에 그것을
    // "이용 내역이 없다"로 읽는다. 화면이 없어서 빈 것과 미이용이 같아 보인다.
    renderTable([row({ programType: 'REPORT', programId: 45 })]);

    expect(link()).not.toBeInTheDocument();
  });

  it('LIVE 는 링크를 만든다', () => {
    // 적재 대상이 아닌 것과 참여자 화면이 없는 것은 다른 이야기다.
    // ProgramUsers 가 LIVE 조회를 켜므로 막으면 멀쩡한 링크를 죽인다.
    renderTable([row({ programType: 'LIVE', programId: 77 })]);

    expect(link()).toHaveAttribute(
      'href',
      '/programs/77/users?programType=LIVE#application-6001',
    );
  });

  it('모르는 새 타입도 링크를 만든다', () => {
    // 차단 목록이라 새 타입에는 링크가 자동으로 붙는다. 허용 목록이었다면
    // 서버가 타입을 늘릴 때마다 멀쩡한 링크가 조용히 사라졌을 것이다.
    renderTable([row({ programType: 'MENTORING', programId: 88 })]);

    expect(link()).toHaveAttribute(
      'href',
      '/programs/88/users?programType=MENTORING#application-6001',
    );
  });
});
