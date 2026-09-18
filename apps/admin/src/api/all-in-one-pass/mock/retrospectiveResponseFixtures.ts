import { RetrospectiveResponse } from '@/domain/all-in-one-pass/types';

/**
 * A-5 회고 응답 mock 시드. 회차 id(=retrospectiveRoundFixtures.id)로 키를 잡는다.
 * 실제 API가 나오면 이 파일을 삭제한다.
 *
 * answers.questionId 규칙: 공통 질문 1·2, 회차별 주차 질문 10N (round N).
 * questionLabel 은 제출 당시 문구 스냅샷.
 */

const COMMON_Q1 = '이번 기간 가장 크게 성장한 부분은 무엇인가요?';
const COMMON_Q2 = '아쉬웠던 점과 다음 회차 목표를 적어주세요.';

export const retrospectiveResponseFixtures: Record<
  number,
  RetrospectiveResponse[]
> = {
  1: [
    {
      id: 1,
      submitterName: '취준생홍',
      passName: '2026 하반기 올인원패스',
      submittedAt: '2026-08-18T21:12:00',
      answers: [
        {
          questionId: 1,
          questionLabel: COMMON_Q1,
          answer: '자소서 구조를 잡는 감을 익혔습니다.',
        },
        {
          questionId: 2,
          questionLabel: COMMON_Q2,
          answer: '시간 관리가 아쉬웠고 다음엔 미리 초안을 잡겠습니다.',
        },
        {
          questionId: 101,
          questionLabel: '자기소개서 작성에서 가장 어려웠던 점은 무엇이었나요?',
          answer: '경험을 직무 역량과 연결하는 부분이 어려웠습니다.',
        },
      ],
    },
    {
      id: 2,
      submitterName: '김지원',
      passName: '2026 하반기 올인원패스',
      submittedAt: '2026-08-19T09:40:00',
      answers: [
        {
          questionId: 1,
          questionLabel: COMMON_Q1,
          answer: '지표를 근거로 문장을 쓰는 습관이 생겼습니다.',
        },
        {
          questionId: 2,
          questionLabel: COMMON_Q2,
          answer: '분량 조절이 어려웠습니다.',
        },
        {
          questionId: 101,
          questionLabel: '자기소개서 작성에서 가장 어려웠던 점은 무엇이었나요?',
          answer: '두괄식으로 요약하는 게 힘들었습니다.',
        },
      ],
    },
    {
      id: 3,
      submitterName: '이하늘',
      passName: '2026 겨울 올인원패스',
      submittedAt: '2026-08-20T14:03:00',
      answers: [
        {
          questionId: 1,
          questionLabel: COMMON_Q1,
          answer: '피드백을 반영하는 속도가 빨라졌습니다.',
        },
        {
          questionId: 2,
          questionLabel: COMMON_Q2,
          answer: '초안 완성도가 낮았던 점이 아쉽습니다.',
        },
        {
          questionId: 101,
          questionLabel: '자기소개서 작성에서 가장 어려웠던 점은 무엇이었나요?',
          answer: '소재 선정에 시간이 오래 걸렸습니다.',
        },
      ],
    },
    {
      id: 5,
      submitterName: '박서준',
      passName: '2026 하반기 올인원패스',
      submittedAt: '2026-08-21T11:20:00',
      answers: [
        {
          questionId: 1,
          questionLabel: COMMON_Q1,
          answer:
            '처음에는 막막했는데 회차를 거듭하면서 제 강점을 어떻게 직무와 연결할지 감이 잡혔습니다. 특히 프로젝트 경험을 성과 중심으로 정리하는 습관이 생겼고, 다른 참여자들의 회고를 보면서 제가 놓치고 있던 관점도 많이 배웠습니다. 앞으로는 지원 기업별로 강조점을 다르게 가져가는 연습을 해보려 합니다.',
        },
        {
          questionId: 2,
          questionLabel: COMMON_Q2,
          answer:
            '초반에 계획 없이 무작정 자소서부터 쓰다 보니 방향을 여러 번 갈아엎어 시간을 많이 썼습니다. 다음 회차에는 직무 분석과 기업 리서치를 먼저 끝내고, 그 결과를 바탕으로 항목별 소재를 미리 매핑한 뒤 작성에 들어가는 것을 목표로 잡았습니다.',
        },
        {
          questionId: 101,
          questionLabel: '자기소개서 작성에서 가장 어려웠던 점은 무엇이었나요?',
          answer:
            '가장 어려웠던 건 한정된 글자 수 안에서 경험을 직무 역량으로 압축하는 일이었습니다. 하고 싶은 말은 많은데 핵심만 남기려니 매번 문장을 줄이고 다시 쓰기를 반복했고, 두괄식으로 결론을 먼저 제시하는 구조가 익숙해지기까지 시간이 꽤 걸렸습니다.',
        },
      ],
    },
  ],
  2: [
    {
      id: 4,
      submitterName: '취준생홍',
      passName: '2026 하반기 올인원패스',
      submittedAt: '2026-09-02T20:15:00',
      answers: [
        {
          questionId: 1,
          questionLabel: COMMON_Q1,
          answer: '직무별 요구 역량을 정리했습니다.',
        },
        {
          questionId: 2,
          questionLabel: COMMON_Q2,
          answer: '기업 리서치가 부족했습니다.',
        },
        {
          questionId: 102,
          questionLabel: '지원 직무 탐색은 어느 정도 진행되었나요?',
          answer: '관심 직무 3개를 좁혔습니다.',
        },
      ],
    },
  ],
  3: [],
};
