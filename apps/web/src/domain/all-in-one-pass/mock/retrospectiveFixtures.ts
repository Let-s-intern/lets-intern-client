import type { PassRetrospectiveRound, RetroQuestion } from '../types';

// 공통질문 2개 (BE MembershipCommonQuestion 대응). 모든 회차 공통.
export const COMMON_QUESTIONS: RetroQuestion[] = [
  {
    id: 1,
    question:
      '지난 2주 동안 어떤 프로그램이나 자료를 활용해 취업 준비를 했나요?',
    answerGuide:
      '활용한 프로그램이나 자료, 그걸 통해 해본 일을 적어주세요. 아직 진행 중인 내용도 좋아요.',
  },
  {
    id: 2,
    question: '지난 회고 이후 취업 준비는 얼마나 달라졌나요?',
    answerGuide:
      '지난번과 비교해 준비가 얼마나 진행됐나요? 새롭게 할 수 있게 된 일이나 여전히 어려운 부분도 좋아요.',
  },
];

// 정규 회차: 노출 = 시작 + (2*th)주, 작성기간 = 2주. (어드민이 패스기간/14로 자동생성한 기본값 가정)
const round = (
  th: number,
  question: string,
  answerGuide: string,
  isSubmitted = false,
): PassRetrospectiveRound => ({
  id: th,
  th,
  weeklyQuestion: { id: 100 + th, question, answerGuide },
  visiblePeriodType: 'WEEK',
  visiblePeriodValue: th * 2,
  periodType: 'WEEK',
  periodValue: 2,
  isSubmitted,
});

// mock 패스(2026-08-30 ~ 11-28, 90일) → 6회차: 1~5 정규 + 6 마무리(periodType INFINITY = 상시).
export const retrospectiveFixtures: PassRetrospectiveRound[] = [
  round(
    1,
    '지금 취업 준비에서 가장 고민되는 부분은 무엇인가요?',
    '어떤 부분에서 막혀 있고, 왜 고민되는지 적어주세요. 이번 패스에서 도움받고 싶은 점도 함께 남겨주세요.',
    true,
  ),
  round(
    2,
    '최근 취업 준비를 하며 새롭게 알게 된 점은 무엇인가요?',
    '처음 알게 됐거나 기존 생각과 달랐던 내용은 무엇인가요? 그 내용을 알게 된 후 생각이 달라진 점도 좋아요.',
    true,
  ),
  round(
    3,
    '배운 내용을 실제 취업 준비에 어떻게 적용해봤나요?',
    '배운 내용을 바탕으로 무엇을 바꾸거나 시도했나요? 직접 해본 과정과 그 결과를 적어주세요.',
  ),
  round(
    4,
    '내 경험을 다시 살펴보며 새롭게 발견한 강점은 무엇인가요?',
    '경험을 정리하면서 이전에는 몰랐던 강점을 발견했나요? 어떤 경험에서 알게 된 강점인지 적어주세요.',
  ),
  round(
    5,
    '준비하다 막힌 부분을 풀기 위해 어떤 시도를 해봤나요?',
    '어디에서 막혔고, 해결하려고 무엇을 해봤나요? 도움이 된 방법이나 아직 해결되지 않은 부분도 좋아요.',
  ),
  {
    id: 6,
    th: 6,
    weeklyQuestion: {
      id: 106,
      question:
        '패스 시작 전과 비교해, 지금 취업 준비에서 가장 달라진 점은 무엇인가요?',
      answerGuide:
        '처음 고민했던 부분이 지금은 어떤 상태인지 적어주세요. 준비한 결과물이나 준비 방식, 자신감의 변화도 좋아요.',
    },
    visiblePeriodType: 'WEEK',
    visiblePeriodValue: 12,
    periodType: 'INFINITY',
    periodValue: 0,
    isSubmitted: false,
  },
];
