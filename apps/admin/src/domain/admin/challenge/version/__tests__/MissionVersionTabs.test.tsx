import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import MissionVersionTabs from '../MissionVersionTabs';

const versions = [
  { challengeVersionId: 1, title: '대학생' },
  { challengeVersionId: 2, title: '직장인' },
];

describe('MissionVersionTabs', () => {
  it('버전이 없으면 그리지 않는다', () => {
    const { container } = render(
      <MissionVersionTabs versions={[]} value={null} onChange={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('전체와 버전마다 탭을 두고, 처음에는 전체를 고른다', () => {
    render(
      <MissionVersionTabs
        versions={versions}
        value={null}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual([
      '전체',
      '대학생',
      '직장인',
    ]);
    expect(screen.getByRole('tab', { name: '전체' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('버전 탭을 누르면 그 버전 id, 전체를 누르면 null 을 넘긴다', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <MissionVersionTabs
        versions={versions}
        value={null}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('tab', { name: '직장인' }));
    expect(onChange).toHaveBeenLastCalledWith(2);

    rerender(
      <MissionVersionTabs versions={versions} value={2} onChange={onChange} />,
    );
    expect(
      screen.getByText(
        '직장인 참여자가 받는 미션입니다. 공통 미션과 직장인 전용 미션을 함께 보여줍니다.',
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: '전체' }));
    expect(onChange).toHaveBeenLastCalledWith(null);
  });
});
