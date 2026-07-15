import { render, screen } from '@testing-library/react';
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
