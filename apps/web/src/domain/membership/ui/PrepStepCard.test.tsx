import { fireEvent, render, screen } from '@testing-library/react';

import type { PrepStep } from '../data/prepSteps';
import { PREP_STEP_CARDS, PREP_STEPS } from '../data/prepSteps';
import PrepStepCard from './PrepStepCard';

function findStep(id: string): PrepStep {
  const step = PREP_STEP_CARDS.find((it) => it.id === id);
  if (!step) throw new Error(`없는 카드: ${id}`);
  return step;
}

const STEP_01 = findStep('step-01');
const STEP_03 = findStep('step-03');
const CHECKPOINT = findStep('checkpoint');
const GOAL = findStep('goal');

describe('PrepStepCard (시안 4-0 · 4-1)', () => {
  it('접힘이 기본이고 펼침 내용이 렌더되지 않는다', () => {
    render(<PrepStepCard step={STEP_01} />);

    const toggle = screen
      .getByText(STEP_01.expand!.toggleLabel)
      .closest('button');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.queryByText(STEP_01.expand!.ctaLabel),
    ).not.toBeInTheDocument();
  });

  it('토글을 누르면 펼쳐지고 aria-expanded 가 따라온다', () => {
    render(<PrepStepCard step={STEP_01} />);
    const toggle = screen
      .getByText(STEP_01.expand!.toggleLabel)
      .closest('button')!;

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(STEP_01.expand!.ctaLabel)).toBeInTheDocument();
    expect(
      screen.getByText(STEP_01.expand!.ctaLabel).closest('a'),
    ).toHaveAttribute('href', STEP_01.expand!.programs[0].url);

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  /*
   * 단일 아코디언이 아니다. 한 장을 펼쳤다고 다른 장이 닫히면 방문자가 두 단계를
   * 비교할 수 없다.
   */
  it('두 장을 동시에 펼칠 수 있다', () => {
    render(
      <>
        <PrepStepCard step={STEP_01} />
        <PrepStepCard step={CHECKPOINT} />
      </>,
    );

    fireEvent.click(screen.getByText(STEP_01.expand!.toggleLabel));
    fireEvent.click(screen.getByText(CHECKPOINT.expand!.toggleLabel));

    expect(screen.getByText(STEP_01.expand!.ctaLabel)).toBeInTheDocument();
    expect(screen.getByText(CHECKPOINT.expand!.ctaLabel)).toBeInTheDocument();
  });

  it('STEP 03 은 탭으로 챌린지를 바꾼다', () => {
    render(<PrepStepCard step={STEP_03} />);
    fireEvent.click(screen.getByText(STEP_03.expand!.toggleLabel));

    const [resume, , portfolio] = STEP_03.expand!.programs;
    expect(
      screen.getByText(STEP_03.expand!.ctaLabel).closest('a'),
    ).toHaveAttribute('href', resume.url);

    fireEvent.click(screen.getByText(portfolio.tabLabel));

    expect(
      screen.getByText(STEP_03.expand!.ctaLabel).closest('a'),
    ).toHaveAttribute('href', portfolio.url);
    expect(screen.getByText(portfolio.tabLabel)).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('CHECKPOINT 는 토글 문구가 다르고 펼치면 ONLY PASS 배지가 보인다', () => {
    render(<PrepStepCard step={CHECKPOINT} />);

    expect(screen.getByTestId('prep-step-checkpoint')).toHaveAttribute(
      'data-kind',
      'checkpoint',
    );
    expect(screen.queryByText('혼자하기 어렵다면?')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(CHECKPOINT.expand!.toggleLabel));

    expect(screen.getByText('ONLY PASS')).toBeInTheDocument();
  });

  it('GOAL 에는 펼침 토글이 없다', () => {
    render(<PrepStepCard step={GOAL} />);

    expect(screen.getByTestId('prep-step-goal')).toHaveAttribute(
      'data-kind',
      'goal',
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('강조된 카드에만 진단 결과 배지가 붙는다', () => {
    const { rerender } = render(<PrepStepCard step={STEP_01} />);
    expect(screen.queryByText(PREP_STEPS.resultBadge)).not.toBeInTheDocument();

    rerender(<PrepStepCard highlighted step={STEP_01} />);
    expect(screen.getByText(PREP_STEPS.resultBadge)).toBeInTheDocument();
  });
});
