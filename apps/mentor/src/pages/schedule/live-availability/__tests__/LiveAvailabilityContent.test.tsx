import { render, screen } from '@testing-library/react';
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
    const timeCells = container.querySelectorAll(
      '.grid .border-b.border-r.bg-white.px-2.py-2.text-center',
    );
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
    render(<LiveAvailabilityContent {...baseProps} challengeTitles={["테스트 챌린지"]} />);
    expect(screen.queryByText('다른 챌린지로 이동')).not.toBeInTheDocument();
  });

  it('헤더 날짜 셀에 sticky 클래스가 있다', () => {
    const { container } = render(<LiveAvailabilityContent {...baseProps} />);
    const stickyHeaders = container.querySelectorAll('.sticky.top-0');
    expect(stickyHeaders.length).toBeGreaterThan(0);
  });
});
