import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

import type { CheckupAnswers } from '../data/checkup';
import { CHECKUP_QUESTIONS, EMPTY_CHECKUP_ANSWERS } from '../data/checkup';
import CheckupSection, { NEXT_QUESTION_DELAY_MS } from './CheckupSection';

/**
 * 답은 랜딩이 들고 있다. 섹션만 떼어 보려면 그 자리를 대신할 것이 필요하다.
 * 마지막 답을 화면에 찍어 두고 "무엇이 위로 올라갔는지" 도 함께 확인한다.
 */
function Harness() {
  const [answers, setAnswers] = useState<CheckupAnswers>(EMPTY_CHECKUP_ANSWERS);

  return (
    <>
      <CheckupSection answers={answers} onAnswersChange={setAnswers} />
      <p data-testid="answers">{JSON.stringify(answers)}</p>
    </>
  );
}

/** 현재 화면에 떠 있는 문항의 optionIndex 번째 선택지를 누른다. */
function choose(questionIndex: number, optionIndex: number) {
  fireEvent.click(
    screen.getByText(CHECKUP_QUESTIONS[questionIndex].options[optionIndex]),
  );
}

/** 선택 후 다음 문항이 올라올 때까지 기다린다. */
function waitForNextQuestion() {
  act(() => {
    jest.advanceTimersByTime(NEXT_QUESTION_DELAY_MS);
  });
}

/** 고르고 다음 문항까지 넘어간다. */
function answer(questionIndex: number, optionIndex: number) {
  choose(questionIndex, optionIndex);
  waitForNextQuestion();
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('CheckupSection (시안 2)', () => {
  it('처음에는 첫 문항만 보인다', () => {
    render(<Harness />);

    expect(screen.getByText(CHECKUP_QUESTIONS[0].question)).toBeInTheDocument();
    expect(
      screen.queryByText(CHECKUP_QUESTIONS[1].question),
    ).not.toBeInTheDocument();
  });

  /* 고른 답이 칠해지는 것을 보고 넘어가라는 시간이다 (PRD 4.6) */
  it('선택하고 240ms 가 지나야 다음 문항으로 넘어간다', () => {
    render(<Harness />);

    choose(0, 1);

    // 아직 같은 문항이다
    expect(screen.getByText(CHECKUP_QUESTIONS[0].question)).toBeInTheDocument();
    expect(
      screen.queryByText(CHECKUP_QUESTIONS[1].question),
    ).not.toBeInTheDocument();

    waitForNextQuestion();

    expect(screen.getByText(CHECKUP_QUESTIONS[1].question)).toBeInTheDocument();
    expect(
      screen.queryByText(CHECKUP_QUESTIONS[0].question),
    ).not.toBeInTheDocument();
  });

  /* 지연 동안 답을 바꿔도 두 칸 넘어가면 문항 하나를 건너뛴 채로 끝난다 */
  it('지연 동안 다시 눌러도 한 칸만 넘어간다', () => {
    render(<Harness />);

    choose(0, 1);
    choose(0, 2);
    waitForNextQuestion();

    expect(screen.getByText(CHECKUP_QUESTIONS[1].question)).toBeInTheDocument();
    // 나중에 고른 답이 남는다
    expect(screen.getByTestId('answers')).toHaveTextContent(
      '[2,null,null,null,null]',
    );
  });

  /*
   * 정리하지 않으면 "다시 진단하기" 로 다시 마운트된 섹션을 이전 타이머가 두 번째
   * 문항으로 밀어버린다.
   */
  it('사라질 때 넘기던 타이머를 정리한다', () => {
    const { unmount } = render(<Harness />);

    choose(0, 1);
    expect(jest.getTimerCount()).toBe(1);

    unmount();

    expect(jest.getTimerCount()).toBe(0);
  });

  /*
   * 되돌아갔을 때 답이 비어 보이면 방문자는 이미 답한 문항을 다시 고른다.
   * 그러면 뒤 문항까지 지워진 것처럼 보여 진단을 중간에 그만둔다.
   */
  it('이전 질문으로 돌아가면 고른 답이 남아 있다', () => {
    render(<Harness />);

    answer(0, 2);
    fireEvent.click(screen.getByText('← 이전 질문'));

    expect(screen.getByText(CHECKUP_QUESTIONS[0].question)).toBeInTheDocument();
    const chosen = screen
      .getByText(CHECKUP_QUESTIONS[0].options[2])
      .closest('button');
    expect(chosen).toHaveAttribute('aria-pressed', 'true');
  });

  it('고른 답을 위로 올려보낸다', () => {
    render(<Harness />);

    answer(0, 3);
    answer(1, 2);

    expect(screen.getByTestId('answers')).toHaveTextContent(
      '[3,2,null,null,null]',
    );
  });

  it('5문항을 다 고르면 답이 모두 채워진다', () => {
    render(<Harness />);

    CHECKUP_QUESTIONS.forEach((_, index) => answer(index, 0));

    expect(screen.getByTestId('answers')).toHaveTextContent('[0,0,0,0,0]');
    // 마지막 문항에서는 더 넘어갈 곳이 없어 그 카드가 그대로 남는다.
    expect(
      screen.getByText(
        CHECKUP_QUESTIONS[CHECKUP_QUESTIONS.length - 1].question,
      ),
    ).toBeInTheDocument();
  });
});
