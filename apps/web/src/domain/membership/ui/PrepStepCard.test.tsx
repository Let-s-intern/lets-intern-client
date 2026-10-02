import { fireEvent, render, screen } from '@testing-library/react';

// 이벤트 이름·속성은 `analytics.test.ts` 가 덮는다. 여기서는 "언제 부르는가" 만 본다.
jest.mock('../analytics');

import { capturePrepStepExpanded } from '../analytics';
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

describe('PrepStepCard 펼치기 이벤트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* 접는 것은 "이 단계를 더 보겠다" 가 아니다. 접을 때 함께 세면 수치가 두 배가 된다. */
  it('펼칠 때만 보내고 접을 때는 보내지 않는다', () => {
    render(<PrepStepCard step={STEP_01} />);
    const toggle = screen.getByText(STEP_01.expand!.toggleLabel);

    fireEvent.click(toggle);
    expect(capturePrepStepExpanded).toHaveBeenCalledTimes(1);
    expect(capturePrepStepExpanded).toHaveBeenCalledWith({
      stepId: STEP_01.id,
    });

    fireEvent.click(toggle);
    expect(capturePrepStepExpanded).toHaveBeenCalledTimes(1);

    fireEvent.click(toggle);
    expect(capturePrepStepExpanded).toHaveBeenCalledTimes(2);
  });

  it('카드마다 자기 STEP 을 보낸다', () => {
    render(
      <>
        <PrepStepCard step={STEP_01} />
        <PrepStepCard step={CHECKPOINT} />
      </>,
    );

    fireEvent.click(screen.getByText(CHECKPOINT.expand!.toggleLabel));

    expect(capturePrepStepExpanded).toHaveBeenCalledWith({
      stepId: CHECKPOINT.id,
    });
  });

  /* 탭은 펼침이 아니라 안쪽 전환이다. 여기서 또 보내면 한 번 펼친 것이 여러 번이 된다. */
  it('펼친 뒤 탭을 바꿔도 더 보내지 않는다', () => {
    render(<PrepStepCard step={STEP_03} />);
    fireEvent.click(screen.getByText(STEP_03.expand!.toggleLabel));

    fireEvent.click(screen.getByText(STEP_03.expand!.programs[2].tabLabel));

    expect(capturePrepStepExpanded).toHaveBeenCalledTimes(1);
  });

  it('GOAL 은 펼침 토글이 없어 이벤트도 없다', () => {
    render(<PrepStepCard step={GOAL} />);

    expect(capturePrepStepExpanded).not.toHaveBeenCalled();
  });
});
