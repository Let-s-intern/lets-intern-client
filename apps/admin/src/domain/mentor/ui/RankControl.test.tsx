import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import RankControl from './RankControl';

const renderControl = (rank: number, total = 5) => {
  const handlers = {
    onRankChange: vi.fn(),
    onMoveUp: vi.fn(),
    onMoveDown: vi.fn(),
  };
  const utils = render(<RankControl rank={rank} total={total} {...handlers} />);
  const input = screen.getByLabelText('노출 순위') as HTMLInputElement;
  return { ...handlers, ...utils, input };
};

describe('RankControl', () => {
  it('입력 중에는 onRankChange 를 부르지 않는다', () => {
    const { input, onRankChange } = renderControl(3);
    fireEvent.change(input, { target: { value: '1' } });
    expect(onRankChange).not.toHaveBeenCalled();
  });

  it('Enter 에 onRankChange 를 부른다', () => {
    const { input, onRankChange } = renderControl(3);
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onRankChange).toHaveBeenCalledWith(1);
  });

  it('포커스 해제에 onRankChange 를 부른다', () => {
    const { input, onRankChange } = renderControl(3);
    fireEvent.change(input, { target: { value: '4' } });
    fireEvent.blur(input);
    expect(onRankChange).toHaveBeenCalledWith(4);
  });

  it('0 은 1, 개수 초과는 마지막으로 맞춘다', () => {
    const { input, onRankChange } = renderControl(3);
    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.blur(input);
    expect(onRankChange).toHaveBeenLastCalledWith(1);
    fireEvent.change(input, { target: { value: '99' } });
    fireEvent.blur(input);
    expect(onRankChange).toHaveBeenLastCalledWith(5);
  });

  it('숫자가 아니면 원래 값으로 되돌리고 부르지 않는다', () => {
    const { input, onRankChange } = renderControl(3);
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.blur(input);
    expect(onRankChange).not.toHaveBeenCalled();
    expect(input.value).toBe('3');
  });

  it('rank 가 바뀌면 입력값도 따라간다', () => {
    const { input, rerender, ...handlers } = renderControl(3);
    rerender(<RankControl rank={1} total={5} {...handlers} />);
    expect(input.value).toBe('1');
  });

  it('첫 행은 위 버튼, 마지막 행은 아래 버튼이 비활성이다', () => {
    const first = renderControl(1);
    expect(screen.getByLabelText('위로 이동')).toBeDisabled();
    expect(screen.getByLabelText('아래로 이동')).toBeEnabled();
    first.unmount();

    renderControl(5);
    expect(screen.getByLabelText('위로 이동')).toBeEnabled();
    expect(screen.getByLabelText('아래로 이동')).toBeDisabled();
  });

  it('버튼은 onMoveUp·onMoveDown 을 부른다', () => {
    const { onMoveUp, onMoveDown } = renderControl(3);
    fireEvent.click(screen.getByLabelText('위로 이동'));
    fireEvent.click(screen.getByLabelText('아래로 이동'));
    expect(onMoveUp).toHaveBeenCalledTimes(1);
    expect(onMoveDown).toHaveBeenCalledTimes(1);
  });
});
