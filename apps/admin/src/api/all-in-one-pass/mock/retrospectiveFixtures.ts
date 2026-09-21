import {
  RetrospectiveCommonQuestion,
  RetrospectiveRound,
} from '@/domain/all-in-one-pass/types';

/**
 * A-4 회고 관리 mock 시드. 실제 API가 나오면 이 파일을 삭제한다.
 * 공통 질문은 전 패스 공통, 회차는 2주 간격(패스 시작 후 N주)으로 노출된다.
 */

export const commonQuestionFixtures: RetrospectiveCommonQuestion[] = [
  {
    id: 1,
    order: 1,
    question: '이번 기간 가장 크게 성장한 부분은 무엇인가요?',
  },
  { id: 2, order: 2, question: '아쉬웠던 점과 다음 회차 목표를 적어주세요.' },
];

export const retrospectiveRoundFixtures: RetrospectiveRound[] = [
  {
    id: 1,
    round: 1,
    weeklyQuestion: '자기소개서 작성에서 가장 어려웠던 점은 무엇이었나요?',
    responseCount: 24,
  },
  {
    id: 2,
    round: 2,
    weeklyQuestion: '지원 직무 탐색은 어느 정도 진행되었나요?',
    responseCount: 18,
  },
  {
    id: 3,
    round: 3,
    weeklyQuestion: '포트폴리오/이력서 완성도를 스스로 평가해주세요.',
    responseCount: 11,
  },
];
