import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { describe, expect, it, vi } from 'vitest';

import LiveAvailabilityContent from '../LiveAvailabilityContent';

const baseProps = {
  initialSlots: [],
  onSave: vi.fn(),
};

describe('LiveAvailabilityContent', () => {
  it('슬롯이 09:00부터 시작된다', () => {
    render(<LiveAvailabilityContent {...baseProps} />);
    expect(screen.getByText('09:00')).toBeInTheDocument();
  });

  it('슬롯이 22:00까지 존재한다 (마지막 슬롯)', () => {
    render(<LiveAvailabilityContent {...baseProps} />);
    expect(screen.getByText('22:00')).toBeInTheDocument();
  });

  it('슬롯 개수가 27개다 (09:00~22:00, 30분 간격)', () => {
    const { container } = render(<LiveAvailabilityContent {...baseProps} />);
    // 시간 레이블 셀 — grid 첫 번째 열의 시간 표시
    const timeCells = container.querySelectorAll('[data-time-label]');
    // 27 슬롯: 09:00, 09:30, ..., 21:30, 22:00
    expect(timeCells.length).toBe(27);
  });

  it('시간표 영역이 부모 높이를 가득 채우는 flex-1 + overflow-y-auto 스크롤 컨테이너로 감싸진다', () => {
    const { container } = render(<LiveAvailabilityContent {...baseProps} />);
    const scrollEl = container.querySelector(
      '.flex-1.overflow-y-auto.rounded-md.border',
    );
    expect(scrollEl).not.toBeNull();
    expect(scrollEl?.className).toMatch(/min-h-0/);
  });

  it('"다른 챌린지로 이동" 버튼이 없다', () => {
    render(
      <LiveAvailabilityContent
        {...baseProps}
        challengeTitles={['테스트 챌린지']}
      />,
    );
    expect(screen.queryByText('다른 챌린지로 이동')).not.toBeInTheDocument();
  });

  it('헤더 날짜 셀에 sticky 클래스가 있다', () => {
    const { container } = render(<LiveAvailabilityContent {...baseProps} />);
    const stickyHeaders = container.querySelectorAll('.sticky.top-0');
    expect(stickyHeaders.length).toBeGreaterThan(0);
  });

  it('기간 바에 라이브 미션 시작일 ~ 마감일이 표시된다', () => {
    // focusDate 로 보이는 주(6/29~7/5)를 고정하고 그 안에 걸치는 기간을 넘긴다.
    const period = {
      challengeTitle: '자소서 챌린지',
      th: 1,
      startDate: '2026-06-30',
      endDate: '2026-07-03',
      reservedCount: 0,
      capacity: 3,
    };
    render(
      <LiveAvailabilityContent
        {...baseProps}
        focusDate="2026-07-01"
        livePeriods={[period]}
      />,
    );
    // 컴포넌트와 동일 방식으로 기대값 계산(TZ 무관).
    const expected = `${format(new Date(period.startDate), 'M.d', {
      locale: ko,
    })} ~ ${format(new Date(period.endDate), 'M.d', { locale: ko })}`;
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it('onOpenReservation 이 없으면 "예약현황 보기" 버튼을 노출하지 않는다', () => {
    render(<LiveAvailabilityContent {...baseProps} />);
    expect(
      screen.queryByRole('button', { name: '예약 현황 보기' }),
    ).not.toBeInTheDocument();
  });

  it('onOpenReservation 이 있으면 "예약현황 보기" 버튼 클릭 시 콜백을 호출한다', async () => {
    const user = userEvent.setup();
    const onOpenReservation = vi.fn();
    render(
      <LiveAvailabilityContent
        {...baseProps}
        onOpenReservation={onOpenReservation}
      />,
    );
    await user.click(screen.getByRole('button', { name: '예약 현황 보기' }));
    expect(onOpenReservation).toHaveBeenCalledTimes(1);
  });

  it('showHeader=false 면 onOpenReservation 이 있어도 버튼을 노출하지 않는다', () => {
    render(
      <LiveAvailabilityContent
        {...baseProps}
        showHeader={false}
        onOpenReservation={vi.fn()}
      />,
    );
    expect(
      screen.queryByRole('button', { name: '예약 현황 보기' }),
    ).not.toBeInTheDocument();
  });
});

describe('LiveAvailabilityContent — 챌린지 기간 음영', () => {
  // focusDate 로 보이는 주(6/29~7/5)를 고정한다.
  const challengePeriods = [
    {
      challengeId: 1,
      title: '자소서 챌린지',
      startDate: '2026-06-30T00:00:00',
      endDate: '2026-07-01T23:59:59',
    },
  ];

  const renderGrid = (periods = challengePeriods) =>
    render(
      <LiveAvailabilityContent
        {...baseProps}
        focusDate="2026-07-01"
        challengePeriods={periods}
      />,
    );

  it('기간에 걸린 셀에만 음영 표시가 붙는다', () => {
    const { container } = renderGrid();
    const shaded = container.querySelectorAll('[data-challenge-period="true"]');

    // 27개 시간 행 × 기간에 걸친 2일
    expect(shaded.length).toBe(27 * 2);
  });

  it('음영 셀에 1대1 신청을 받지 않는다는 안내가 붙는다', () => {
    const { container } = renderGrid();
    const shaded = container.querySelector('[data-challenge-period="true"]');

    expect(shaded).toHaveAttribute(
      'title',
      '이 기간은 챌린지 참여자 우선이라 1대1 신청은 받지 않아요.',
    );
    expect(
      screen.getByText(/챌린지 참여자 우선이라 1대1 신청은 받지 않아요/),
    ).toBeInTheDocument();
  });

  it('음영 셀도 클릭하면 선택이 토글된다', async () => {
    // 막지 않는다 — 챌린지 기간의 슬롯이야말로 챌린지 피드백에 쓰이는 슬롯이다.
    const { container } = renderGrid();
    const shaded = container.querySelector(
      '[data-challenge-period="true"]',
    ) as HTMLElement;

    fireEvent.mouseDown(shaded);
    expect(screen.getByText(/선택된 가능 시간: 1개/)).toBeInTheDocument();

    fireEvent.mouseDown(shaded);
    expect(screen.getByText(/선택된 가능 시간: 0개/)).toBeInTheDocument();
  });

  it('기간이 없으면 음영도 안내도 없다', () => {
    const { container } = renderGrid([]);

    expect(
      container.querySelectorAll('[data-challenge-period="true"]').length,
    ).toBe(0);
    expect(
      screen.queryByText(/챌린지 참여자 우선이라/),
    ).not.toBeInTheDocument();
  });
});
