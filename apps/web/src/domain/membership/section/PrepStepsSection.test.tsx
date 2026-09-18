import { render, screen } from '@testing-library/react';

import { PREP_STEP_CARDS, PREP_STEPS } from '../data/prepSteps';
import PrepStepsSection from './PrepStepsSection';

describe('PrepStepsSection (시안 4)', () => {
  it('카드 7장을 시안 순서대로 그린다', () => {
    const { container } = render(<PrepStepsSection caseId={null} />);

    const rendered = [...container.querySelectorAll('[data-kind]')].map((el) =>
      el.getAttribute('data-testid'),
    );

    expect(rendered).toEqual(
      PREP_STEP_CARDS.map((step) => `prep-step-${step.id}`),
    );
  });

  it('진단 전에는 배지가 없다', () => {
    render(<PrepStepsSection caseId={null} />);

    expect(screen.queryByText(PREP_STEPS.resultBadge)).not.toBeInTheDocument();
  });

  it('CASE 에 대응하는 카드 한 장에만 배지가 붙는다', () => {
    render(<PrepStepsSection caseId="C" />);

    const badges = screen.getAllByText(PREP_STEPS.resultBadge);
    expect(badges).toHaveLength(1);
    // 배지는 카드 안에 있다 — STEP 03 이 CASE C 를 든 카드다
    expect(
      screen.getByTestId('prep-step-step-03').parentElement,
    ).toContainElement(badges[0]);
  });

  /* PRD 4.7 표 — A·B·C 는 STEP 01·02·03, D1·D2 는 둘 다 STEP 05, E 는 없다. */
  it('CASE 마다 배지가 붙는 카드가 PRD 4.7 표와 같다', () => {
    const expected = {
      A: 'prep-step-step-01',
      B: 'prep-step-step-02',
      C: 'prep-step-step-03',
      D1: 'prep-step-step-05',
      D2: 'prep-step-step-05',
    } as const;

    for (const [caseId, testId] of Object.entries(expected)) {
      const { unmount } = render(
        <PrepStepsSection caseId={caseId as keyof typeof expected} />,
      );

      const badges = screen.getAllByText(PREP_STEPS.resultBadge);
      expect(badges).toHaveLength(1);
      expect(screen.getByTestId(testId).parentElement).toContainElement(
        badges[0],
      );

      unmount();
    }
  });

  it('CASE E 는 한 장에도 배지가 붙지 않는다', () => {
    render(<PrepStepsSection caseId="E" />);

    expect(screen.queryByText(PREP_STEPS.resultBadge)).not.toBeInTheDocument();
  });

  it('결과 카드가 내려오는 앵커를 단다', () => {
    const { container } = render(<PrepStepsSection caseId={null} />);

    expect(container.querySelector(`#${PREP_STEPS.anchorId}`)).not.toBeNull();
  });
});
