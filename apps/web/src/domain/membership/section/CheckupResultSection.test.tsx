import { fireEvent, render, screen } from '@testing-library/react';

import type { CheckupCaseId } from '../data/checkup';
import {
  checkupBodyText,
  CHECKUP_AREAS,
  CHECKUP_RESULT,
  CHECKUP_RESULT_COPY,
  resolveCheckupResult,
} from '../data/checkup';
import CheckupResultSection from './CheckupResultSection';

/** 직무(01)가 가장 약하게 나오는 답 */
const WEAK_DIRECTION = resolveCheckupResult([0, 3, 3, 3, 3]);

/** CASE 6종을 각각 만드는 답 조합. 브라우저 대조에도 이 조합을 쓴다 */
const ANSWERS_BY_CASE: Record<CheckupCaseId, number[]> = {
  A: [0, 3, 3, 3, 3],
  B: [3, 0, 0, 3, 3],
  C: [3, 3, 3, 0, 3],
  D1: [3, 3, 3, 3, 0],
  D2: [3, 3, 3, 3, 2],
  E: [3, 3, 3, 3, 3],
};

const CASE_IDS = ['A', 'B', 'C', 'D1', 'D2', 'E'] as const;

/**
 * 제목과 본문은 조각 span 으로 쪼개져 나간다. `getByText` 의 기본 matcher 는 자기
 * 자식 텍스트만 보므로 쪼개진 문장을 잡지 못한다 — 문단 단위 testid 의 textContent 를
 * 원문과 맞춘다.
 */
function textsOf(testId: string): (string | null)[] {
  return screen.getAllByTestId(testId).map((node) => node.textContent);
}

function renderSection(result = WEAK_DIRECTION, onRestart = jest.fn()) {
  render(
    <CheckupResultSection
      onRestart={onRestart}
      result={result}
      stepsAnchorId="prep-steps"
    />,
  );
  return onRestart;
}

describe('CheckupResultSection (시안 3)', () => {
  it('답하기 전에는 안내 문구만 보인다', () => {
    renderSection(null);

    for (const line of CHECKUP_RESULT.guideLines) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
    expect(screen.queryByText(CHECKUP_RESULT.title)).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('checkup-area-bar')).toHaveLength(0);
  });

  it('답한 뒤에는 카드 2장이 보인다', () => {
    renderSection();

    expect(screen.getByText(CHECKUP_RESULT.title)).toBeInTheDocument();
    expect(screen.getByText(CHECKUP_RESULT.badge)).toBeInTheDocument();
    expect(screen.queryByText(CHECKUP_RESULT.guideLines[0])).toBeNull();
  });

  it('네 영역의 막대를 영역 순서대로 그린다', () => {
    renderSection();

    expect(screen.getAllByTestId('checkup-area-bar')).toHaveLength(
      CHECKUP_AREAS.length,
    );
    // 축 이름은 번호와 라벨 두 조각이고 사이는 여백(mr-2)이라 글자로는 붙어 있다
    expect(
      screen
        .getAllByTestId('checkup-area-name')
        .map((name) => name.textContent),
    ).toEqual(CHECKUP_AREAS.map((area) => `${area.no}${area.label}`));
  });

  /*
   * 강조 막대가 둘이면 "가장 먼저 보완할 영역 하나" 라는 결과 자체가 무너진다.
   */
  it('강조는 판정된 축 하나에만, 네 자리에 함께 붙는다', () => {
    renderSection();

    const weakest = screen
      .getAllByTestId('checkup-area-bar')
      .filter((bar) => bar.getAttribute('data-status') === 'weakest');
    expect(weakest).toHaveLength(1);

    const names = screen.getAllByTestId('checkup-area-name');
    const scores = screen.getAllByTestId('checkup-area-score');
    const bars = screen.getAllByTestId('checkup-area-bar');
    const captions = screen.getAllByTestId('checkup-area-caption');

    // CASE A — 01 축이 강조다
    expect(names[0]).toHaveClass('text-[#F0563F]');
    expect(scores[0]).toHaveClass('text-[#F0563F]');
    expect(bars[0]).toHaveClass('bg-[#F0563F]');
    expect(captions[0]).toHaveClass('font-bold', 'text-[#F0563F]');

    for (const index of [1, 2, 3]) {
      expect(names[index]).toHaveClass('text-[#11142B]');
      expect(scores[index]).toHaveClass('text-[#4B5BF0]');
      expect(bars[index]).toHaveClass('bg-[#4B5BF0]');
      expect(captions[index]).toHaveClass('text-[#808799]');
    }
  });

  /* CASE E 는 강조 축이 없다 — 네 축 모두 기본 색이다 */
  it('CASE E 에서는 강조 축이 없다', () => {
    renderSection(resolveCheckupResult([3, 3, 3, 3, 3]));

    for (const bar of screen.getAllByTestId('checkup-area-bar')) {
      expect(bar).toHaveClass('bg-[#4B5BF0]');
      expect(bar).toHaveAttribute('data-status', 'ready');
    }
  });

  /* 확장 애니메이션은 CSS 가 맡는다. 여기서는 그 클래스가 붙는지만 본다 */
  it('막대에 확장 애니메이션 클래스가 붙는다', () => {
    renderSection();

    for (const bar of screen.getAllByTestId('checkup-area-bar')) {
      expect(bar).toHaveClass('checkup-bar-fill');
    }
  });

  it('막대 길이와 점수 숫자가 축 점수(0~100)와 같다', () => {
    // 15 / 39 / 65 / 95 — 배점표에서 나온 축 점수다
    renderSection(resolveCheckupResult([0, 1, 1, 2, 3]));

    const widths = screen
      .getAllByTestId('checkup-area-bar')
      .map((bar) => bar.style.width);
    const numbers = screen
      .getAllByTestId('checkup-area-score')
      .map((score) => score.textContent);

    expect(widths).toEqual(['15%', '39%', '65%', '95%']);
    expect(numbers).toEqual(['15', '39', '65', '95']);
  });

  it('판정된 영역의 결과 문구를 보여준다', () => {
    renderSection();

    const paragraphs = textsOf('checkup-body');

    expect(paragraphs).toEqual(CHECKUP_RESULT_COPY.A.body.map(checkupBodyText));
    // 다른 영역 문구가 섞이지 않는다
    expect(paragraphs).not.toContain(
      checkupBodyText(CHECKUP_RESULT_COPY.D1.body[0]),
    );
  });

  it('다시 진단하기를 누르면 초기화를 요청한다', () => {
    const onRestart = renderSection();

    fireEvent.click(screen.getByText(CHECKUP_RESULT.restart));

    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it('준비 단계 확인하기가 단계 섹션 앵커를 가리킨다', () => {
    renderSection();

    expect(screen.getByText(CHECKUP_RESULT.cta).closest('a')).toHaveAttribute(
      'href',
      '#prep-steps',
    );
  });
});

describe('CheckupResultSection CASE 카드 (PRD 4.4)', () => {
  it.each(CASE_IDS)('CASE %s 의 배지·제목·본문을 그린다', (caseId) => {
    const result = resolveCheckupResult(ANSWERS_BY_CASE[caseId]);
    expect(result?.caseId).toBe(caseId);
    renderSection(result);

    const copy = CHECKUP_RESULT_COPY[caseId];

    expect(
      screen.getByText(
        caseId === 'E' ? CHECKUP_RESULT.caseEBadge : CHECKUP_RESULT.badge,
      ),
    ).toBeInTheDocument();

    expect(textsOf('checkup-title-line')).toEqual(
      copy.titleLines.map((line) => line.map((part) => part.text).join('')),
    );
    expect(textsOf('checkup-body')).toEqual(copy.body.map(checkupBodyText));
  });

  /* 본문 강조는 굵게다. 조각을 나눠 두고 화면에서 흘리면 나눈 의미가 없다 */
  it('본문의 굵게 조각만 strong 으로 찍는다', () => {
    const copy = CHECKUP_RESULT_COPY.E;
    renderSection(resolveCheckupResult(ANSWERS_BY_CASE.E));

    const bold = copy.body.flat().filter((part) => part.bold);
    expect(bold.length).toBeGreaterThan(0);
    for (const part of bold) {
      expect(screen.getByText(part.text).tagName).toBe('STRONG');
    }
  });

  it('CASE E 만 멘토링 CTA 를 쓰고 나머지는 기본 CTA 다', () => {
    renderSection(resolveCheckupResult(ANSWERS_BY_CASE.E));

    expect(
      screen.getByText(CHECKUP_RESULT.caseECta).closest('a'),
    ).toHaveAttribute('href', '#prep-steps');
    expect(screen.queryByText(CHECKUP_RESULT.cta)).not.toBeInTheDocument();
  });

  it.each(['A', 'B', 'C', 'D1', 'D2'] as const)(
    'CASE %s 에는 멘토링 CTA 가 없다',
    (caseId) => {
      renderSection(resolveCheckupResult(ANSWERS_BY_CASE[caseId]));

      expect(screen.getByText(CHECKUP_RESULT.cta)).toBeInTheDocument();
      expect(
        screen.queryByText(CHECKUP_RESULT.caseECta),
      ).not.toBeInTheDocument();
    },
  );
});
