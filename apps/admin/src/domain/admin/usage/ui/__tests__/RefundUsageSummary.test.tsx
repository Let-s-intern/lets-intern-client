import type { AccessLogApplicationDetail } from '@/api/accessLog';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import RefundUsageSummary from '../RefundUsageSummary';

/**
 * 환불 모달의 이용 이력 블록이 답해야 하는 질문 (PRD 7.1·7.4).
 *
 *   1. 무엇을 언제 얼마나 이용했는가
 *   2. 기록이 없다면 왜 없는가 — 집계 대상 아님 / 집계 이전 / 미이용 / 확인 불가
 *
 * 2번이 뭉개지면 목록보다 위험하다. 이 화면은 훑는 자리가 아니라 곧바로 환불을 실행하는
 * 자리라, `집계 이전` 이 `미이용` 으로 보이는 순간 잘못된 전액 환불이 나간다.
 *
 * 그래서 존재 단언만 하지 않고 **부재 단언을 함께** 한다. 라벨이 하나 더 섞여 나오는
 * 회귀는 존재 단언만으로는 잡히지 않는다.
 */

const detailQuery = vi.fn();

vi.mock('@/api/accessLog', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useAccessLogDetailQuery: (...args: unknown[]) => detailQuery(...args),
}));

/** 기준 시각을 고정한다. 실제 시계에 기대면 7일 경계 테스트가 언젠가 저절로 깨진다. */
const NOW = new Date('2026-08-06T10:00:00');

const response = (
  over: Partial<AccessLogApplicationDetail> = {},
): AccessLogApplicationDetail => ({
  programType: 'CHALLENGE',
  firstAccessedAt: '2026-07-30T14:22:00',
  lastAccessedAt: '2026-08-05T09:11:00',
  accessCount: 12,
  paidAt: '2026-08-03T10:00:00',
  daysFromPaymentToFirstAccess: 2,
  trackedFrom: '2026-06-01T00:00:00',
  details: [],
  ...over,
});

const succeed = (over: Partial<AccessLogApplicationDetail> = {}) =>
  detailQuery.mockReturnValue({
    data: response(over),
    isLoading: false,
    isError: false,
  });

const renderSummary = () => render(<RefundUsageSummary applicationId={5001} />);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
  detailQuery.mockReset();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('RefundUsageSummary 이용한 건', () => {
  beforeEach(() => {
    succeed({
      paidAt: '2026-07-28T10:00:00',
      details: [
        { targetType: 'CHALLENGE_DASHBOARD', targetId: 1, accessCount: 8 },
        { targetType: 'MISSION', targetId: 9001, accessCount: 2 },
        { targetType: 'MISSION', targetId: 9002, accessCount: 1 },
        { targetType: 'MISSION', targetId: 9003, accessCount: 1 },
      ],
    });
  });

  it('결제일·최초 이용·최근 이용·이용 항목·횟수를 보여준다', () => {
    renderSummary();

    expect(screen.getByText('2026-07-28 10:00')).toBeInTheDocument();
    expect(screen.getByText('2026-08-05 09:11')).toBeInTheDocument();
    expect(screen.getByText('대시보드, 미션 3건')).toBeInTheDocument();
    expect(screen.getByText('12회')).toBeInTheDocument();
  });

  it('경과 일수는 서버가 준 값을 그대로 붙인다', () => {
    // 화면에서 다시 세면 시각 포함 여부·타임존 기준이 어긋난다. 그 경계가 곧 전액 환불이다.
    renderSummary();

    expect(
      screen.getByText('2026-07-30 14:22 (결제 +2일)'),
    ).toBeInTheDocument();
  });

  it('같은 미션을 여러 번 이용해도 1건으로 센다', () => {
    // `미션 3건` 이 접근 횟수로 읽히면 이용 정도를 과대평가한다.
    succeed({
      details: [
        { targetType: 'MISSION', targetId: 9001, accessCount: 10 },
        { targetType: 'MISSION', targetId: 9001, accessCount: 2 },
      ],
    });
    renderSummary();

    expect(screen.getByText('미션')).toBeInTheDocument();
  });

  it('환불 가부를 판정하지 않는다', () => {
    renderSummary();

    expect(screen.queryByText(/환불 가능/)).not.toBeInTheDocument();
    expect(screen.queryByText(/환불 불가/)).not.toBeInTheDocument();
  });
});

describe('RefundUsageSummary 기록 없음 4종', () => {
  it('적재 대상이 아닌 타입은 집계 대상 아님이다', () => {
    // LIVE 신청서도 목록·단건에 행이 있고 기록만 없다. 미이용으로 보이면 전액 환불이 나간다.
    succeed({
      programType: 'LIVE',
      firstAccessedAt: null,
      lastAccessedAt: null,
      accessCount: 0,
      daysFromPaymentToFirstAccess: null,
    });
    renderSummary();

    expect(screen.getByText('집계 대상 아님')).toBeInTheDocument();
    expect(screen.queryByText('미이용')).not.toBeInTheDocument();
  });

  it('집계 시작 이전 결제는 집계 이전이다', () => {
    succeed({
      firstAccessedAt: null,
      lastAccessedAt: null,
      accessCount: 0,
      paidAt: '2026-05-01T10:00:00',
      trackedFrom: '2026-06-01T00:00:00',
      daysFromPaymentToFirstAccess: null,
    });
    renderSummary();

    expect(screen.getByText('기록 없음 (집계 이전)')).toBeInTheDocument();
    expect(screen.queryByText('미이용')).not.toBeInTheDocument();
  });

  it('집계 이후 결제인데 기록이 없으면 미이용이다', () => {
    succeed({
      firstAccessedAt: null,
      lastAccessedAt: null,
      accessCount: 0,
      daysFromPaymentToFirstAccess: null,
    });
    renderSummary();

    expect(screen.getByText('미이용')).toBeInTheDocument();
    expect(screen.queryByText('집계 대상 아님')).not.toBeInTheDocument();
    expect(screen.queryByText('기록 없음 (집계 이전)')).not.toBeInTheDocument();
  });

  it('판정 근거가 없으면 확인 불가다', () => {
    succeed({
      firstAccessedAt: null,
      lastAccessedAt: null,
      accessCount: 0,
      trackedFrom: null,
      daysFromPaymentToFirstAccess: null,
    });
    renderSummary();

    expect(screen.getByText('확인 불가')).toBeInTheDocument();
    expect(screen.queryByText('미이용')).not.toBeInTheDocument();
  });

  it('결제일은 기록이 없어도 그대로 보여준다', () => {
    // 7일 경과 여부를 운영이 직접 볼 수 있어야 한다.
    succeed({
      firstAccessedAt: null,
      lastAccessedAt: null,
      accessCount: 0,
      paidAt: '2026-08-03T10:00:00',
      daysFromPaymentToFirstAccess: null,
    });
    renderSummary();

    expect(screen.getByText('2026-08-03 10:00')).toBeInTheDocument();
  });
});

describe('RefundUsageSummary 결제 7일 이내 미이용', () => {
  const unused = (over: Partial<AccessLogApplicationDetail> = {}) =>
    succeed({
      firstAccessedAt: null,
      lastAccessedAt: null,
      accessCount: 0,
      daysFromPaymentToFirstAccess: null,
      ...over,
    });

  const notice = () => screen.queryByText('결제 후 7일 이내 · 이용 기록 없음');

  it('7일 이내 미이용이면 사실을 눈에 띄게 적는다', () => {
    unused({ paidAt: '2026-08-03T10:00:00' });
    renderSummary();

    expect(notice()).toBeInTheDocument();
  });

  it('7일이 지났으면 붙이지 않는다', () => {
    unused({ paidAt: '2026-07-20T10:00:00' });
    renderSummary();

    expect(notice()).not.toBeInTheDocument();
  });

  it('집계 이전에는 붙이지 않는다', () => {
    // 판정 근거가 없는 건을 강조하면 그 강조가 곧 잘못된 환불 근거가 된다.
    unused({
      paidAt: '2026-08-03T10:00:00',
      trackedFrom: '2026-08-05T00:00:00',
    });
    renderSummary();

    expect(notice()).not.toBeInTheDocument();
  });

  it('집계 대상이 아닌 타입에는 붙이지 않는다', () => {
    unused({ paidAt: '2026-08-03T10:00:00', programType: 'REPORT' });
    renderSummary();

    expect(notice()).not.toBeInTheDocument();
  });

  it('이용한 건에는 붙이지 않는다', () => {
    succeed({ paidAt: '2026-08-03T10:00:00' });
    renderSummary();

    expect(notice()).not.toBeInTheDocument();
  });
});

describe('RefundUsageSummary 조회 상태', () => {
  it('로딩·조회 실패·기록 없음이 서로 배타적이다', () => {
    detailQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    const { unmount } = renderSummary();

    expect(screen.getByText('이용 내역을 불러오는 중...')).toBeInTheDocument();
    expect(screen.queryByText('미이용')).not.toBeInTheDocument();
    expect(screen.queryByText(/불러오지 못했습니다/)).not.toBeInTheDocument();
    unmount();

    detailQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    renderSummary();

    expect(screen.getByText(/불러오지 못했습니다/)).toBeInTheDocument();
    expect(screen.queryByText('미이용')).not.toBeInTheDocument();
    expect(
      screen.queryByText('이용 내역을 불러오는 중...'),
    ).not.toBeInTheDocument();
  });

  it('조회에 실패하면 확인 불가로 적고 미이용으로 떨어뜨리지 않는다', () => {
    detailQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    renderSummary();

    expect(screen.getByText(/확인 불가/)).toBeInTheDocument();
    expect(screen.queryByText('미이용')).not.toBeInTheDocument();
  });
});
