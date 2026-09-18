import { render, screen } from '@testing-library/react';

import { PREP_STEP_CARDS, PREP_STEPS } from '../data/prepSteps';
import PrepStepsSection from './PrepStepsSection';

describe('PrepStepsSection (시안 4)', () => {
  it('카드 7장을 시안 순서대로 그린다', () => {
    const { container } = render(<PrepStepsSection weakestAreaId={null} />);

    const rendered = [...container.querySelectorAll('[data-kind]')].map((el) =>
      el.getAttribute('data-testid'),
    );

    expect(rendered).toEqual(
      PREP_STEP_CARDS.map((step) => `prep-step-${step.id}`),
    );
  });

  it('진단 전에는 배지가 없다', () => {
    render(<PrepStepsSection weakestAreaId={null} />);

    expect(screen.queryByText(PREP_STEPS.resultBadge)).not.toBeInTheDocument();
  });

  it('결과 영역에 대응하는 카드 한 장에만 배지가 붙는다', () => {
    render(<PrepStepsSection weakestAreaId="document" />);

    const badges = screen.getAllByText(PREP_STEPS.resultBadge);
    expect(badges).toHaveLength(1);
    // 배지는 카드 안에 있다 — STEP 03 이 서류 영역을 든 카드다
    expect(
      screen.getByTestId('prep-step-step-03').parentElement,
    ).toContainElement(badges[0]);
  });

  it('영역마다 배지가 붙는 카드가 다르다', () => {
    const { rerender } = render(<PrepStepsSection weakestAreaId="direction" />);
    expect(
      screen.getByTestId('prep-step-step-01').parentElement,
    ).toHaveTextContent(PREP_STEPS.resultBadge);

    rerender(<PrepStepsSection weakestAreaId="apply" />);
    expect(
      screen.getByTestId('prep-step-step-05').parentElement,
    ).toHaveTextContent(PREP_STEPS.resultBadge);
    expect(
      screen.getByTestId('prep-step-step-01').parentElement,
    ).not.toHaveTextContent(PREP_STEPS.resultBadge);
  });

  it('결과 카드가 내려오는 앵커를 단다', () => {
    const { container } = render(<PrepStepsSection weakestAreaId={null} />);

    expect(container.querySelector(`#${PREP_STEPS.anchorId}`)).not.toBeNull();
  });
});
