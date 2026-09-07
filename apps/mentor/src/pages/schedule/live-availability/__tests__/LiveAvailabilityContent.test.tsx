import { SLOT_START_TIMES } from '@letscareer/utils';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

  it('슬롯이 22:30까지 존재한다 (마지막 슬롯)', () => {
    // 예전에는 22:00 이 마지막이었다. 멘티는 22:30 까지 고를 수 있었고 어드민은
    // 21:30 에서 끊겨, 같은 정책이 세 화면에 다른 숫자로 적혀 있었다.
    // 이제 셋 다 @letscareer/utils 의 SLOT_START_TIMES 를 쓴다.
    render(<LiveAvailabilityContent {...baseProps} />);
    expect(screen.getByText('22:30')).toBeInTheDocument();
  });

  it('슬롯 개수가 공유 정책과 같다 (09:00~22:30, 30분 간격)', () => {
    const { container } = render(<LiveAvailabilityContent {...baseProps} />);
    // 시간 레이블 셀 — grid 첫 번째 열의 시간 표시
    const timeCells = container.querySelectorAll('[data-time-label]');
    // 숫자를 다시 적지 않는다. 정책이 바뀌면 이 테스트도 따라간다.
    expect(timeCells.length).toBe(SLOT_START_TIMES.length);
    expect(SLOT_START_TIMES.at(-1)).toBe('22:30');
  });

  it('시간표 영역이 부모 높이를 가득 채우는 flex-1 + overflow-y-auto 스크롤 컨테이너로 감싸진다', () => {
    const { container } = render(<LiveAvailabilityContent {...baseProps} />);
    const scrollEl = container.querySelector(
      '.flex-1.overflow-y-auto.rounded-md.border',
    );
    expect(scrollEl).not.toBeNull();
    expect(scrollEl?.className).toMatch(/min-h-0/);
  });

  /*
    그리드는 주 단위로 앞뒤를 오갈 수 있어 지난 날짜·오늘 지난 시간이 그대로 보인다.
    막지 않으면 멘토가 과거 슬롯을 열 수 있고 서버도 거르지 않아 그대로 저장된다(LC-3246).
  */
  describe('지난 시간대', () => {
    // 수요일 14:00 로 고정한다 — 같은 주 안에 과거와 미래가 모두 있어야 한다.
    const NOW = new Date('2026-09-09T14:00:00');

    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(NOW);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    const pastCells = () => screen.getAllByTitle('이미 지난 시간입니다');

    /*
      지난 칸은 이미 열려 있어도 회색 하나로 통일한다. 예전에는 열려 있던 것만 파란
      "예약 가능" 으로 남겨 해제할 수 있게 뒀는데, 지난 시간에 예약을 받는 것처럼
      읽혔다. 지금보다 과거에 예약이 잡힐 일이 없으니 고칠 이유도 없다(LC-3259).
    */
    it('지난 칸은 글자 없이 예약 불가능 회색으로 그린다', () => {
      render(<LiveAvailabilityContent {...baseProps} />);
      expect(pastCells().length).toBeGreaterThan(0);
      expect(pastCells()[0]).toHaveTextContent('');
      expect(pastCells()[0].className).toContain('bg-neutral-90');
    });

    it('화면 어디에도 "지난 시간" 이라는 글자를 쓰지 않는다', () => {
      render(<LiveAvailabilityContent {...baseProps} />);
      expect(screen.queryAllByText('지난 시간')).toHaveLength(0);
    });

    it('지난 칸은 눌러도 선택되지 않는다', () => {
      render(<LiveAvailabilityContent {...baseProps} />);

      const before = screen.queryAllByText('예약 가능').length;
      const pastCell = pastCells()[0];
      fireEvent.mouseDown(pastCell);

      expect(screen.queryAllByText('예약 가능').length).toBe(before);
      // 비활성 칸은 button 이 아니라 div 다 — 폼 제출·포커스 대상이 되지 않는다.
      expect(pastCell.tagName).toBe('DIV');
      expect(pastCell).toHaveAttribute('aria-disabled', 'true');
    });

    /*
      이미 열려 있던 지난 슬롯도 예외가 아니다. 파란 셀로 남겨 두면 "지난 시간인데
      예약을 받는다" 로 읽힌다.
    */
    it('이미 열어 둔 지난 슬롯도 회색으로 통일하고 손대지 못하게 한다', () => {
      render(
        <LiveAvailabilityContent
          {...baseProps}
          initialSlots={[{ date: '2026-09-09', time: '09:00' }]}
        />,
      );

      // 범례에도 "예약 가능" 이 있으므로 셀만 센다 — 셀은 grid 안에 있다.
      const openLabelsInGrid = screen
        .queryAllByText('예약 가능')
        .filter((el) => el.closest('button') !== null);
      expect(openLabelsInGrid).toHaveLength(0);
      expect(pastCells().every((cell) => cell.tagName === 'DIV')).toBe(true);
    });
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
  /*
    보이는 주(6/29~7/5)보다 앞선 시각으로 고정한다. 지난 칸은 비활성으로 그려져
    data-challenge-period 도 클릭도 없다(LC-3246). 고정하지 않으면 이 테스트는
    실행한 날짜에 따라 통과 여부가 갈린다.
  */
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-01T09:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

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

    // 시간 행 전체 × 기간에 걸친 2일.
    // 행 개수를 숫자로 박지 않는다 — 슬롯 정의가 @letscareer/utils 로 옮겨진 뒤
    // 27 에서 28 로 바뀌었고, 그때 이 단언만 남아 조용히 깨졌다.
    expect(shaded.length).toBe(SLOT_START_TIMES.length * 2);
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
