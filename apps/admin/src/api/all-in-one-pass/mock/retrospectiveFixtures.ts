import { RetrospectiveRound } from '@/domain/all-in-one-pass/types';
import { passFixtures } from './passFixtures';

/**
 * A-4 회고 회차 mock.
 *
 * 아래 회차 수·기본 질문·회차 생성은 원래 **백엔드가 패스 개설 시 시드**할 값
 */

/** 마지막(마무리) 회차 기본 질문 */
const WRAP_UP_QUESTION =
  '이번 패스가 나의 취업 준비 여정에 어떤 의미였는지, 같은 고민을 하는 다음 참여자에게 전하고 싶은 한마디와 함께 적어주세요.';

/** 회차별 기본 주차 질문 (index = 회차-1). 마지막 회차는 WRAP_UP 으로 대체 */
const DEFAULT_WEEKLY_QUESTIONS = [
  '이번 2주간 가장 도움이 된 활동은 무엇이었나요?',
  '지난 목표 대비 어떤 진전이 있었나요?',
  '이번 기간에 새롭게 시도한 것은 무엇인가요?',
  '가장 어려웠던 점과 그 극복 방법을 적어주세요.',
  '남은 기간 동안 가장 집중하고 싶은 것은 무엇인가요?',
  '지금까지의 준비 상태를 스스로 평가한다면?',
  '목표 달성까지 남은 과제는 무엇인가요?',
  '이번 회차에서 얻은 가장 큰 인사이트는 무엇인가요?',
];

/** 회차 수 = ceil(패스기간/14). 자투리도 마지막 "마무리 회차"로 포함(올림) */
const deriveRoundCount = (passDays: number | null): number =>
  !passDays || passDays <= 0 ? 0 : Math.ceil(passDays / 14);

/** 회차 번호로 기본 질문. 마지막 회차는 후기(WRAP_UP) */
const defaultWeeklyQuestion = (round: number, totalRounds: number): string => {
  if (round >= totalRounds) return WRAP_UP_QUESTION;
  return (
    DEFAULT_WEEKLY_QUESTIONS[round - 1] ??
    DEFAULT_WEEKLY_QUESTIONS[DEFAULT_WEEKLY_QUESTIONS.length - 1]
  );
};

/** 응답 수 시드 (index = 회차-1). 없으면 0. 화면 확인용 데모값. */
const responseCountSeed: Record<number, number[]> = {
  1: [210, 180, 150, 42, 0, 0, 0],
};

/** 회차 id 규칙 (응답 시드 키와 맞춘다) */
export const roundIdOf = (passId: number, round: number) =>
  passId * 100 + round;

/** 패스의 회차 목록을 생성한다. */
export const buildRoundsForPass = (passId: number): RetrospectiveRound[] => {
  const pass = passFixtures.find((p) => p.id === passId);
  const count = deriveRoundCount(pass?.passDays ?? null);
  const counts = responseCountSeed[passId] ?? [];
  return Array.from({ length: count }, (_, i) => {
    const round = i + 1;
    return {
      id: roundIdOf(passId, round),
      round,
      weeklyQuestion: defaultWeeklyQuestion(round, count),
      responseCount: counts[i] ?? 0,
    };
  });
};
