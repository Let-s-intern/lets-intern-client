import { act, fireEvent, render, screen } from '@testing-library/react';

import {
  checkupBodyText,
  CHECKUP,
  CHECKUP_QUESTIONS,
  CHECKUP_RESULT,
  CHECKUP_RESULT_COPY,
} from './data/checkup';
import { PREP_STEPS } from './data/prepSteps';
import { scrollToSection } from './lib/scrollToSection';
import MembershipLanding, { RESULT_SCROLL_DELAY_MS } from './MembershipLanding';
import { NEXT_QUESTION_DELAY_MS } from './section/CheckupSection';

/* 스크롤은 jsdom 에 없다. 몇 번 · 어디로 옮기는지만 본다 */
jest.mock('./lib/scrollToSection', () => ({ scrollToSection: jest.fn() }));

const scrollMock = scrollToSection as jest.MockedFunction<
  typeof scrollToSection
>;

/*
 * 진단 → 결과 → 준비 단계 강조까지 한 흐름으로 확인한다.
 *
 * 세 섹션이 같은 답을 보는지는 각 섹션 테스트로는 알 수 없다. 그래서 여기서는 그
 * 셋만 진짜로 렌더하고 나머지 섹션은 전부 비운다 — 다른 섹션은 react-query 나
 * 이미지 같은 자기 사정이 있어서 이 흐름과 상관없이 실패할 수 있다.
 *
 * 섹션을 어떤 순서로 합치는지는 `MembershipLanding.test.tsx` 가 맡는다.
 */
jest.mock('./ui/MembershipAnimations', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('./ui/MembershipNav', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('./ui/ApplyBar', () => ({ __esModule: true, default: () => null }));
jest.mock('./ui/MembershipPaymentSheet', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('./section/HeroSection', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('./section/RealTalkSection', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('./section/PassResultsSection', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('./section/PassIntroSection', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('./section/LiveClinicSection', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('./section/CoursePlanSection', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('./section/PlaybookDashboardSection', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('./section/PricingSection', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('./section/FinalCtaSection', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('./section/FaqSection', () => ({
  __esModule: true,
  default: () => null,
}));

/** 화면에 떠 있는 문항에서 `optionIndex` 번째 선택지를 누른다 */
function choose(questionIndex: number, optionIndex: number) {
  fireEvent.click(
    screen.getByText(CHECKUP_QUESTIONS[questionIndex].options[optionIndex]),
  );
}

/** 고르고 다음 문항까지 넘어간다. 문항 전환은 240ms 지연이다 */
function answer(questionIndex: number, optionIndex: number) {
  choose(questionIndex, optionIndex);
  act(() => {
    jest.advanceTimersByTime(NEXT_QUESTION_DELAY_MS);
  });
}

/** `answers` 순서대로 5문항을 답한다 */
function answerAll(answers: number[]) {
  answers.forEach((option, index) => answer(index, option));
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

function badgedStepId(): string | null {
  const badge = screen.getByText(PREP_STEPS.resultBadge);
  const card = badge.parentElement?.querySelector('[data-testid]');
  return card?.getAttribute('data-testid') ?? null;
}

describe('MembershipLanding 진단 흐름', () => {
  it('답하기 전에는 안내 문구만 있고 단계 배지가 없다', () => {
    render(<MembershipLanding />);

    expect(screen.getByText(CHECKUP_RESULT.guideLines[0])).toBeInTheDocument();
    expect(screen.queryByText(PREP_STEPS.resultBadge)).not.toBeInTheDocument();
  });

  it('5문항을 답하면 결과가 나오고 대응 단계에 배지가 붙는다', () => {
    render(<MembershipLanding />);

    // 직무(01)가 가장 낮다
    answerAll([0, 3, 3, 3, 3]);

    expect(screen.getByText(CHECKUP_RESULT.title)).toBeInTheDocument();
    // 본문은 강조 조각으로 쪼개져 나가므로 문단 전체 글로 맞춘다
    expect(screen.getAllByTestId('checkup-body')[0]).toHaveTextContent(
      checkupBodyText(CHECKUP_RESULT_COPY.A.body[0]),
    );
    expect(badgedStepId()).toBe('prep-step-step-01');
  });

  it('답을 바꾸면 배지가 다른 단계로 옮겨간다', () => {
    render(<MembershipLanding />);

    // 지원(04)이 가장 낮다
    answerAll([3, 3, 3, 3, 0]);

    expect(badgedStepId()).toBe('prep-step-step-05');
    expect(screen.getAllByText(PREP_STEPS.resultBadge)).toHaveLength(1);
  });

  /* 마지막 답을 누른 사람은 문항 카드만 보고 있어 결과가 생긴 줄 모른다 (PRD 4.6) */
  it('완료하고 120ms 뒤에 결과 영역으로 한 번 옮긴다', () => {
    render(<MembershipLanding />);

    [0, 3, 3, 3].forEach((option, index) => answer(index, option));
    choose(CHECKUP_QUESTIONS.length - 1, 3);

    expect(scrollMock).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(RESULT_SCROLL_DELAY_MS);
    });

    expect(scrollMock).toHaveBeenCalledTimes(1);
    expect(scrollMock).toHaveBeenCalledWith(CHECKUP_RESULT.anchorId);
  });

  /* 답을 고칠 때마다 화면이 튀면 답을 고칠 수 없다 */
  it('다 답한 뒤 답을 고쳐도 다시 옮기지 않는다', () => {
    render(<MembershipLanding />);

    answerAll([0, 3, 3, 3, 3]);
    expect(scrollMock).toHaveBeenCalledTimes(1);

    // 마지막 문항 카드가 그대로 남아 있어 그 자리에서 다시 고를 수 있다
    choose(CHECKUP_QUESTIONS.length - 1, 0);
    act(() => {
      jest.advanceTimersByTime(RESULT_SCROLL_DELAY_MS);
    });

    expect(scrollMock).toHaveBeenCalledTimes(1);
  });

  it('다시 진단하기는 진단 영역으로 옮긴다', () => {
    render(<MembershipLanding />);

    answerAll([0, 3, 3, 3, 3]);
    fireEvent.click(screen.getByText(CHECKUP_RESULT.restart));

    expect(scrollMock).toHaveBeenLastCalledWith(CHECKUP.anchorId);
  });

  it('다시 진단하기를 누르면 첫 문항으로 돌아가고 결과가 사라진다', () => {
    render(<MembershipLanding />);

    answerAll([0, 3, 3, 3, 3]);
    fireEvent.click(screen.getByText(CHECKUP_RESULT.restart));

    expect(screen.getByText(CHECKUP_QUESTIONS[0].question)).toBeInTheDocument();
    expect(screen.queryByText(CHECKUP_RESULT.title)).not.toBeInTheDocument();
    expect(screen.queryByText(PREP_STEPS.resultBadge)).not.toBeInTheDocument();
    // 고른 답도 남아 있지 않다
    expect(
      screen.getByText(CHECKUP_QUESTIONS[0].options[0]).closest('button'),
    ).toHaveAttribute('aria-pressed', 'false');
  });
});
