import { passFixtures } from './passFixtures';

/**
 * 회차별 질문 응답 (server MembershipOrdinalQuestion 기준).
 * 실 API(`GET /admin/membershipQuestion/ordinal/{membershipId}`) 응답과 동일 구조.
 */
export interface OrdinalQuestionDto {
  id: number;
  membershipId: number;
  question: string | null;
  count: number | null;
  isVisible: boolean;
  th: number; // 회차 번호
  visiblePeriodValue: number | null; // 노출: 패스 시작 +N일
  periodValue: number | null; // 작성 기간(일). 마무리 = 무기한(null)
  answerGuide: string | null; // 답변 가이드 (BE GET 추가 예정)
  responseCount: number | null; // 응답 수 (BE 추가 예정)
}

const WRAP_UP_QUESTION =
  '패스 시작 전과 비교해, 지금 취업 준비에서 가장 달라진 점은 무엇인가요?';
const WRAP_UP_GUIDE =
  '처음 고민했던 부분이 지금은 어떤 상태인지 적어주세요. 준비한 결과물이나 준비 방식, 자신감의 변화도 좋아요.';

const DEFAULT_ROUNDS: { question: string; guide: string }[] = [
  {
    question: '지금 취업 준비에서 가장 고민되는 부분은 무엇인가요?',
    guide:
      '어떤 부분에서 막혀 있고, 왜 고민되는지 적어주세요. 이번 패스에서 도움받고 싶은 점도 함께 남겨주세요.',
  },
  {
    question: '최근 취업 준비를 하며 새롭게 알게 된 점은 무엇인가요?',
    guide:
      '처음 알게 됐거나 기존 생각과 달랐던 내용은 무엇인가요? 그 내용을 알게 된 후 생각이 달라진 점도 좋아요.',
  },
  {
    question: '배운 내용을 실제 취업 준비에 어떻게 적용해봤나요?',
    guide:
      '배운 내용을 바탕으로 무엇을 바꾸거나 시도했나요? 직접 해본 과정과 그 결과를 적어주세요.',
  },
  {
    question: '내 경험을 다시 살펴보며 새롭게 발견한 강점은 무엇인가요?',
    guide:
      '경험을 정리하면서 이전에는 몰랐던 강점을 발견했나요? 어떤 경험에서 알게 된 강점인지 적어주세요.',
  },
  {
    question: '준비하다 막힌 부분을 풀기 위해 어떤 시도를 해봤나요?',
    guide:
      '어디에서 막혔고, 해결하려고 무엇을 해봤나요? 도움이 된 방법이나 아직 해결되지 않은 부분도 좋아요.',
  },
  {
    question:
      '지금까지 준비한 내용 중 잘한 점과 보완하고 싶은 점은 무엇인가요?',
    guide:
      '준비 과정에서 만족스러웠던 부분과 아쉬웠던 부분은 무엇인가요? 앞으로 바꿔보고 싶은 점도 함께 적어주세요.',
  },
  {
    question:
      '지금까지 활용한 프로그램이나 자료 중 가장 도움이 된 것은 무엇인가요?',
    guide:
      '어떤 프로그램이나 자료가 가장 도움이 됐나요? 실제로 이해가 쉬워지거나 준비가 수월해진 부분을 적어주세요.',
  },
  {
    question:
      '취업 준비를 이어오며 나에게 맞는 준비 방식은 무엇이라고 느꼈나요?',
    guide:
      '직접 해보니 어떤 준비 방식이 나에게 잘 맞았나요? 잘 맞았던 이유와 앞으로도 이어가고 싶은 방법을 적어주세요.',
  },
];

const deriveRoundCount = (passDays: number | null): number =>
  !passDays || passDays <= 0 ? 0 : Math.ceil(passDays / 14);

/** 화면 확인용 응답 수 데모값 (index = 회차-1) */
const responseCountSeed: Record<number, number[]> = {
  1: [210, 180, 150, 42, 0, 0, 0],
};

export const roundIdOf = (passId: number, round: number) =>
  passId * 100 + round;

/** 패스의 회차별 질문 목록(DTO)을 생성한다. 실 API 연결 시 이 함수만 axios로 교체. */
export const buildOrdinalQuestionsForPass = (
  passId: number,
): OrdinalQuestionDto[] => {
  const pass = passFixtures.find((p) => p.id === passId);
  const count = deriveRoundCount(pass?.passDays ?? null);
  const counts = responseCountSeed[passId] ?? [];
  return Array.from({ length: count }, (_, i) => {
    const th = i + 1;
    const isFinal = th === count;
    const { question, guide } = isFinal
      ? { question: WRAP_UP_QUESTION, guide: WRAP_UP_GUIDE }
      : (DEFAULT_ROUNDS[th - 1] ?? DEFAULT_ROUNDS[DEFAULT_ROUNDS.length - 1]);
    return {
      id: roundIdOf(passId, th),
      membershipId: passId,
      question,
      count: th,
      isVisible: true,
      th,
      visiblePeriodValue: 14 * th,
      periodValue: isFinal ? null : 14,
      answerGuide: guide,
      responseCount: counts[i] ?? 0,
    };
  });
};
