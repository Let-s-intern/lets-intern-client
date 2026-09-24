import { act, fireEvent, render, screen } from '@testing-library/react';

import {
  captureCheckupAnswered,
  captureCheckupCompleted,
  captureCheckupResultCtaClicked,
  captureCheckupStarted,
} from './analytics';
import { CHECKUP_QUESTIONS, CHECKUP_RESULT } from './data/checkup';
import MembershipLanding from './MembershipLanding';
import { NEXT_QUESTION_DELAY_MS } from './section/CheckupSection';

/*
 * 진단 이벤트가 "몇 번" 나가는지는 한 섹션만 떼어 보면 알 수 없다. 시작·완료의
 * 중복 방지는 답 배열에 달려 있고, "다시 진단하기" 로 답을 비우는 것은 랜딩의 일이라
 * 세 섹션이 함께 있어야 확인된다.
 *
 * 이벤트 이름·속성 자체는 `analytics.test.ts` 가 덮는다. 여기서는 함수 호출 횟수와
 * 인자만 본다 — 그래서 `analytics` 모듈을 통째로 목으로 바꾼다.
 *
 * 섹션 목 목록은 `MembershipLanding.checkupFlow.test.tsx` 와 같은 이유다. 이 흐름과
 * 상관없는 섹션은 react-query 나 이미지 같은 자기 사정으로 실패할 수 있다.
 */
jest.mock('./analytics');

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

describe('진단 이벤트 횟수', () => {
  it('5문항을 답하면 시작 1회 · 답변 5회 · 완료 1회다', () => {
    render(<MembershipLanding />);

    answerAll([0, 3, 3, 3, 3]);

    expect(captureCheckupStarted).toHaveBeenCalledTimes(1);
    expect(captureCheckupAnswered).toHaveBeenCalledTimes(5);
    expect(captureCheckupCompleted).toHaveBeenCalledTimes(1);
  });

  it('답변 이벤트가 문항과 고른 순번을 그대로 싣는다', () => {
    render(<MembershipLanding />);

    answerAll([0, 3, 2, 1, 3]);

    [0, 3, 2, 1, 3].forEach((optionIndex, index) => {
      expect(captureCheckupAnswered).toHaveBeenNthCalledWith(index + 1, {
        question: CHECKUP_QUESTIONS[index],
        optionIndex,
      });
    });
  });

  it('완료 이벤트가 계산된 결과를 그대로 싣는다', () => {
    render(<MembershipLanding />);

    answerAll([0, 3, 3, 3, 3]);

    expect(captureCheckupCompleted).toHaveBeenCalledWith(
      expect.objectContaining({ caseId: 'A' }),
    );
  });

  /* 첫 답에서만 시작이다. 되돌아가 다시 고르는 것은 새 진단이 아니다. */
  it('이전 문항으로 돌아가 다시 골라도 시작은 한 번뿐이다', () => {
    render(<MembershipLanding />);

    answer(0, 1);
    fireEvent.click(screen.getByText('← 이전 질문'));
    choose(0, 2);

    expect(captureCheckupStarted).toHaveBeenCalledTimes(1);
    expect(captureCheckupAnswered).toHaveBeenCalledTimes(2);
  });

  /* 다 채운 뒤 앞 문항을 고치면 결과는 다시 계산되지만 완료는 이미 지났다. */
  it('다 답한 뒤 앞 문항을 고쳐도 완료는 한 번뿐이다', () => {
    render(<MembershipLanding />);

    answerAll([0, 3, 3, 3, 3]);
    // 마지막 문항 카드가 그대로 남아 있어 그 자리에서 다시 고를 수 있다
    choose(CHECKUP_QUESTIONS.length - 1, 0);

    expect(captureCheckupCompleted).toHaveBeenCalledTimes(1);
    expect(captureCheckupAnswered).toHaveBeenCalledTimes(6);
  });

  it('다시 진단한 뒤 답하면 시작과 완료가 각각 한 번씩 더 나간다', () => {
    render(<MembershipLanding />);

    answerAll([0, 3, 3, 3, 3]);
    fireEvent.click(screen.getByText(CHECKUP_RESULT.restart));
    answerAll([3, 3, 3, 3, 0]);

    expect(captureCheckupStarted).toHaveBeenCalledTimes(2);
    expect(captureCheckupAnswered).toHaveBeenCalledTimes(10);
    expect(captureCheckupCompleted).toHaveBeenCalledTimes(2);
  });
});

describe('결과 CTA', () => {
  it('준비 단계 확인하기를 누르면 CASE 를 보낸다', () => {
    render(<MembershipLanding />);

    answerAll([3, 3, 3, 3, 0]);
    fireEvent.click(screen.getByText(CHECKUP_RESULT.cta));

    expect(captureCheckupResultCtaClicked).toHaveBeenCalledTimes(1);
    expect(captureCheckupResultCtaClicked).toHaveBeenCalledWith({
      caseId: 'D1',
    });
  });

  /* CASE E 는 같은 자리의 버튼이 멘토링 CTA 로 바뀐다 (PRD 4.8) */
  it('CASE E 의 멘토링 CTA 는 cta 속성까지 보낸다', () => {
    render(<MembershipLanding />);

    answerAll([3, 3, 3, 3, 3]);
    fireEvent.click(screen.getByText(CHECKUP_RESULT.caseECta));

    expect(captureCheckupResultCtaClicked).toHaveBeenCalledWith({
      caseId: 'E',
      cta: 'mentoring',
    });
  });

  it('답하기 전에는 결과 CTA 자체가 없어 이벤트도 없다', () => {
    render(<MembershipLanding />);

    expect(screen.queryByText(CHECKUP_RESULT.cta)).not.toBeInTheDocument();
    expect(captureCheckupResultCtaClicked).not.toHaveBeenCalled();
  });
});
