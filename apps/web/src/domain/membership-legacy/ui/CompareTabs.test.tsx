import { fireEvent, render, screen } from '@testing-library/react';
import type { CompareCombo } from '../data/compare';
import CompareTabs from './CompareTabs';

const combos: CompareCombo[] = [
  { id: 'a', label: '조합 A', items: [] },
  { id: 'b', label: '조합 B', items: [] },
  { id: 'c', label: '조합 C', items: [] },
];

describe('CompareTabs', () => {
  it('전달받은 조합 수만큼 탭을 그린다', () => {
    render(<CompareTabs combos={combos} activeId="a" onChange={jest.fn()} />);
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByText('조합 B')).toBeInTheDocument();
  });

  it('aria-selected 가 활성 탭 하나에만 true 다', () => {
    render(<CompareTabs combos={combos} activeId="b" onChange={jest.fn()} />);
    const selected = screen
      .getAllByRole('tab')
      .filter((tab) => tab.getAttribute('aria-selected') === 'true');
    expect(selected).toHaveLength(1);
    expect(selected[0]).toHaveTextContent('조합 B');
  });

  it('탭을 누르면 그 id 로 onChange 를 부른다', () => {
    const onChange = jest.fn();
    render(<CompareTabs combos={combos} activeId="a" onChange={onChange} />);
    fireEvent.click(screen.getByText('조합 C'));
    expect(onChange).toHaveBeenCalledWith('c');
  });

  it('오른쪽 화살표로 다음 탭, 마지막에서는 처음으로 돈다', () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <CompareTabs combos={combos} activeId="a" onChange={onChange} />,
    );
    fireEvent.keyDown(screen.getByText('조합 A').closest('button')!, {
      key: 'ArrowRight',
    });
    expect(onChange).toHaveBeenLastCalledWith('b');

    rerender(<CompareTabs combos={combos} activeId="c" onChange={onChange} />);
    fireEvent.keyDown(screen.getByText('조합 C').closest('button')!, {
      key: 'ArrowRight',
    });
    expect(onChange).toHaveBeenLastCalledWith('a');
  });

  it('왼쪽 화살표로 이전 탭, 처음에서는 마지막으로 돈다', () => {
    const onChange = jest.fn();
    render(<CompareTabs combos={combos} activeId="a" onChange={onChange} />);
    fireEvent.keyDown(screen.getByText('조합 A').closest('button')!, {
      key: 'ArrowLeft',
    });
    expect(onChange).toHaveBeenLastCalledWith('c');
  });

  it('활성 탭만 탭 순회(tabIndex 0) 대상이다', () => {
    render(<CompareTabs combos={combos} activeId="b" onChange={jest.fn()} />);
    const focusable = screen
      .getAllByRole('tab')
      .filter((tab) => tab.getAttribute('tabindex') === '0');
    expect(focusable).toHaveLength(1);
  });
});
