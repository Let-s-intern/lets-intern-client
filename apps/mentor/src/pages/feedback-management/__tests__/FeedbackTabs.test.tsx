import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import FeedbackTabs from '../ui/FeedbackTabs';

describe('FeedbackTabs', () => {
  it('네 개 탭을 순서대로 그린다', () => {
    render(<FeedbackTabs activeTab="all" onChange={vi.fn()} />);

    const labels = screen
      .getAllByRole('button')
      .map((button) => button.textContent?.trim());

    expect(labels).toEqual([
      '전체 내역',
      '서면 피드백 내역',
      'LIVE 피드백 내역',
      '1대1 라이브 멘토링',
    ]);
  });

  /*
    화면의 필터는 `rows.filter((r) => r.type === activeTab)` 하나다. 그래서 탭 키가
    FeedbackRow['type'] 과 같은 문자열이어야 한다. 라벨만 추가하고 키를 다르게 두면
    탭은 보이는데 목록이 항상 비는 상태가 된다 — 눈으로는 잘 안 잡힌다.
  */
  it('1대1 탭이 넘기는 키는 행 타입과 같은 live-mentoring 이다', () => {
    const onChange = vi.fn();
    render(<FeedbackTabs activeTab="all" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: '1대1 라이브 멘토링' }));

    expect(onChange).toHaveBeenCalledWith('live-mentoring');
  });
});
