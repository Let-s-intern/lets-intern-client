import { fireEvent, render, screen } from '@testing-library/react';

import { CHECKUP_QUESTIONS } from '../data/checkup';
import CheckupSection from './CheckupSection';

/** 현재 화면에 떠 있는 문항의 optionIndex 번째 선택지를 누른다. */
function choose(questionIndex: number, optionIndex: number) {
  fireEvent.click(
    screen.getByText(CHECKUP_QUESTIONS[questionIndex].options[optionIndex]),
  );
}

describe('CheckupSection (시안 2)', () => {
  it('처음에는 첫 문항만 보인다', () => {
    render(<CheckupSection />);

    expect(screen.getByText(CHECKUP_QUESTIONS[0].question)).toBeInTheDocument();
    expect(
      screen.queryByText(CHECKUP_QUESTIONS[1].question),
    ).not.toBeInTheDocument();
  });

  it('선택하면 다음 문항으로 넘어간다', () => {
    render(<CheckupSection />);

    choose(0, 1);

    expect(screen.getByText(CHECKUP_QUESTIONS[1].question)).toBeInTheDocument();
    expect(
      screen.queryByText(CHECKUP_QUESTIONS[0].question),
    ).not.toBeInTheDocument();
  });

  /*
   * 되돌아갔을 때 답이 비어 보이면 방문자는 이미 답한 문항을 다시 고른다.
   * 그러면 뒤 문항까지 지워진 것처럼 보여 진단을 중간에 그만둔다.
   */
  it('이전 질문으로 돌아가면 고른 답이 남아 있다', () => {
    render(<CheckupSection />);

    choose(0, 2);
    fireEvent.click(screen.getByText('← 이전 질문'));

    expect(screen.getByText(CHECKUP_QUESTIONS[0].question)).toBeInTheDocument();
    const chosen = screen
      .getByText(CHECKUP_QUESTIONS[0].options[2])
      .closest('button');
    expect(chosen).toHaveAttribute('aria-pressed', 'true');
  });

  it('5문항을 다 고르면 완료 상태가 된다', () => {
    render(<CheckupSection />);

    expect(screen.queryByTestId('checkup-result-slot')).not.toBeInTheDocument();

    CHECKUP_QUESTIONS.forEach((_, index) => choose(index, 0));

    expect(screen.getByTestId('checkup-result-slot')).toBeInTheDocument();
    // 마지막 문항에서는 더 넘어갈 곳이 없어 그 카드가 그대로 남는다.
    expect(
      screen.getByText(
        CHECKUP_QUESTIONS[CHECKUP_QUESTIONS.length - 1].question,
      ),
    ).toBeInTheDocument();
  });

  it('마지막 문항을 답하기 전에는 결과 자리가 열리지 않는다', () => {
    render(<CheckupSection />);

    CHECKUP_QUESTIONS.slice(0, -1).forEach((_, index) => choose(index, 0));

    expect(screen.queryByTestId('checkup-result-slot')).not.toBeInTheDocument();
  });
});
