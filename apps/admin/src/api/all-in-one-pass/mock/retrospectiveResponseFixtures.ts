import { RetrospectiveResponse } from '@/domain/all-in-one-pass/types';

/**
 * A-5 회고 응답 mock 시드. 회차 id(passId*100 + 회차)로 키를 잡는다.
 * 실제 API가 나오면 이 파일을 삭제한다.
 *
 * answers.questionId: 공통 질문 1·2(고정), 주차별 질문 = 회차 id.
 * questionLabel 은 제출 당시 문구 스냅샷.
 */

const COMMON_Q1 = '지난 회고 이후 어떤 점이 성장했나요?';
const COMMON_Q2 = '이번 기간에 어떤 목표를 실천했나요?';
const WEEKLY_R1 = '이번 2주간 가장 도움이 된 활동은 무엇이었나요?';
const WEEKLY_R2 = '지난 목표 대비 어떤 진전이 있었나요?';

export const retrospectiveResponseFixtures: Record<
  number,
  RetrospectiveResponse[]
> = {
  // 패스 1 · 1회차 (roundId 101)
  101: [
    {
      id: 1,
      submitterName: '취준생홍',
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
          questionLabel: WEEKLY_R1,
          answer: '경험을 직무 역량과 연결하는 활동이 가장 도움이 됐습니다.',
        },
      ],
    },
    {
      id: 2,
      submitterName: '김지원',
      submittedAt: '2026-08-19T09:40:00',
      answers: [
        {
          questionId: 1,
          questionLabel: COMMON_Q1,
          answer: '지표로 문장을 쓰는 습관이 생겼습니다.',
        },
        {
          questionId: 2,
          questionLabel: COMMON_Q2,
          answer: '분량 조절이 어려웠습니다.',
        },
        {
          questionId: 101,
          questionLabel: WEEKLY_R1,
          answer: '자소서 첨삭 세션이 가장 유익했습니다.',
        },
      ],
    },
    {
      id: 5,
      submitterName: '박서준',
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
          questionLabel: WEEKLY_R1,
          answer:
            '가장 도움이 된 건 현직자 피드백이었습니다. 한정된 글자 수 안에서 경험을 직무 역량으로 압축하는 법을 반복해서 연습했고, 두괄식으로 결론을 먼저 제시하는 구조가 익숙해지기까지 시간이 꽤 걸렸지만 그만큼 완성도가 올라갔습니다.',
        },
      ],
    },
  ],
  // 패스 1 · 2회차 (roundId 102)
  102: [
    {
      id: 3,
      submitterName: '취준생홍',
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
          questionLabel: WEEKLY_R2,
          answer: '관심 직무를 3개로 좁혔습니다.',
        },
      ],
    },
  ],
};
