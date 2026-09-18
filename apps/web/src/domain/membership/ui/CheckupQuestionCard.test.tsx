import { fireEvent, render, screen } from '@testing-library/react';

import { CHECKUP_QUESTIONS } from '../data/checkup';
import CheckupQuestionCard from './CheckupQuestionCard';

const TOTAL = CHECKUP_QUESTIONS.length;

function renderCard(index: number, selected: number | null = null) {
  const onSelect = jest.fn();
  const onPrev = jest.fn();
  render(
    <CheckupQuestionCard
      index={index}
      onPrev={index === 0 ? undefined : onPrev}
      onSelect={onSelect}
      question={CHECKUP_QUESTIONS[index]}
      selected={selected}
      total={TOTAL}
    />,
  );
  return { onSelect, onPrev };
}

describe('CheckupQuestionCard (시안 2)', () => {
  it('진행 표시가 문항 번호를 따른다', () => {
    renderCard(2);

    expect(screen.getByText('QUESTION 03 / 05')).toBeInTheDocument();
    // "N문항 남음" 의 N 은 현재 문항을 포함한다 — Q3 이면 3문항 남음이다.
    expect(screen.getByText('3문항 남음')).toBeInTheDocument();
  });

  it('마지막 문항에서는 안내 문구가 결과 안내로 바뀐다', () => {
    renderCard(TOTAL - 1);

    expect(
      screen.getByText('답변을 선택하면 아래에 결과가 나옵니다'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('답변을 선택하면 다음 질문으로 넘어갑니다'),
    ).not.toBeInTheDocument();
  });

  it('첫 문항에는 이전 질문 버튼이 없다', () => {
    renderCard(0);
    expect(screen.queryByText('← 이전 질문')).not.toBeInTheDocument();
  });

  it('두 번째 문항부터는 이전 질문으로 돌아갈 수 있다', () => {
    const { onPrev } = renderCard(1);

    fireEvent.click(screen.getByText('← 이전 질문'));
    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  it('선택지를 누르면 그 순번을 올려보낸다', () => {
    const { onSelect } = renderCard(0);

    fireEvent.click(screen.getByText(CHECKUP_QUESTIONS[0].options[2]));
    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it('고른 선택지만 눌린 상태로 표시된다', () => {
    renderCard(0, 1);

    const options = CHECKUP_QUESTIONS[0].options.map((option) =>
      screen.getByText(option).closest('button'),
    );
    expect(options.map((el) => el?.getAttribute('aria-pressed'))).toEqual([
      'false',
      'true',
      'false',
      'false',
    ]);
  });

  it('안내 박스가 있는 문항이면 예시를 함께 그린다', () => {
    const hintIndex = CHECKUP_QUESTIONS.findIndex((q) => q.hint);
    renderCard(hintIndex);

    const hint = CHECKUP_QUESTIONS[hintIndex].hint;
    expect(screen.getByText(hint!.title)).toBeInTheDocument();
    for (const item of hint!.items) {
      expect(screen.getByText(`· ${item}`)).toBeInTheDocument();
    }
  });
});
