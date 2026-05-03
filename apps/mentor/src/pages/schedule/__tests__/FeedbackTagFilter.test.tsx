import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import FeedbackTagFilter from '../ui/FeedbackTagFilter';
import type { FeedbackTagType } from '../constants/feedbackTag';

describe('FeedbackTagFilter (PRD-0503 #4)', () => {
  const noop = () => {};

  it('전체 + 3개 피드백 태그 버튼을 렌더한다', () => {
    render(
      <FeedbackTagFilter
        selectedTags={new Set<FeedbackTagType>()}
        onToggle={noop}
        onClearAll={noop}
      />,
    );

    expect(screen.getByRole('button', { name: '전체' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /서면 피드백/ })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^LIVE 피드백$/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /LIVE 피드백 일정 오픈/ }),
    ).toBeInTheDocument();
  });

  it('빈 selectedTags 상태에서 "전체" 버튼이 활성 색상을 가진다', () => {
    render(
      <FeedbackTagFilter
        selectedTags={new Set<FeedbackTagType>()}
        onToggle={noop}
        onClearAll={noop}
      />,
    );

    const allBtn = screen.getByRole('button', { name: '전체' });
    expect(allBtn.className).toMatch(/bg-primary/);
  });

  it('written 태그가 선택된 상태에서 해당 버튼이 aria-pressed=true 다', () => {
    render(
      <FeedbackTagFilter
        selectedTags={new Set<FeedbackTagType>(['written'])}
        onToggle={noop}
        onClearAll={noop}
      />,
    );

    const writtenBtn = screen.getByRole('button', { name: /서면 피드백/ });
    expect(writtenBtn.getAttribute('aria-pressed')).toBe('true');

    const liveBtn = screen.getByRole('button', { name: /^LIVE 피드백$/ });
    expect(liveBtn.getAttribute('aria-pressed')).toBe('false');
  });

  it('태그 클릭 시 onToggle(type)이 호출된다', () => {
    const onToggle = vi.fn();
    render(
      <FeedbackTagFilter
        selectedTags={new Set<FeedbackTagType>()}
        onToggle={onToggle}
        onClearAll={noop}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /서면 피드백/ }));
    expect(onToggle).toHaveBeenCalledWith('written');

    fireEvent.click(screen.getByRole('button', { name: /^LIVE 피드백$/ }));
    expect(onToggle).toHaveBeenCalledWith('live');

    fireEvent.click(
      screen.getByRole('button', { name: /LIVE 피드백 일정 오픈/ }),
    );
    expect(onToggle).toHaveBeenCalledWith('live-open');
  });

  it('"전체" 클릭 시 onClearAll 이 호출된다', () => {
    const onClearAll = vi.fn();
    render(
      <FeedbackTagFilter
        selectedTags={new Set<FeedbackTagType>(['written'])}
        onToggle={noop}
        onClearAll={onClearAll}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '전체' }));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it('태그 버튼에 rounded-md 클래스가 적용된다 (rounded-full 없음)', () => {
    const { container } = render(
      <FeedbackTagFilter
        selectedTags={new Set<FeedbackTagType>()}
        onToggle={noop}
        onClearAll={noop}
      />,
    );
    const buttons = container.querySelectorAll('button');
    buttons.forEach((btn) => {
      expect(btn.className).not.toContain('rounded-full');
    });
  });

  it('비활성 태그 버튼에 bg-white 클래스가 적용된다', () => {
    render(
      <FeedbackTagFilter
        selectedTags={new Set<FeedbackTagType>()}
        onToggle={noop}
        onClearAll={noop}
      />,
    );
    const writtenBtn = screen
      .getByRole('button', { name: /서면 피드백/ });
    expect(writtenBtn.className).toContain('bg-white');
  });
});
