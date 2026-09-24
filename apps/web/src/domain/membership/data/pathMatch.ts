// 시안 7 — "상황이 다 다른 걸 아니까, 다 열어드립니다" (FIND YOUR PATH).
//
// 방문자의 막힌 지점에서 그에 맞는 챌린지로 연결한다. 10종을 전부 들으라고 하지 않고
// 지금 필요한 하나를 고르게 하는 것이 이 섹션의 목적이다.

export interface PathMatchRow {
  /** 막힌 지점 */
  situation: string;
  /** 연결할 프로그램 이름 */
  program: string;
  /** 그 프로그램이 해 주는 일 */
  outcome: string;
}

export const PATH_MATCH = {
  eyebrow: 'FIND YOUR PATH',
  title: '상황이 다 다른 걸 아니까, 다 열어드립니다',
  sub: '10개 챌린지를 모두 들을 필요는 없습니다. 결과에 따라 지금 필요한 다음 단계만 고르세요.',
  rows: [
    {
      situation: '지원서에 쓸 경험이 떠오르지 않는다면',
      program: '경험정리 챌린지',
      outcome: '지원 직무에 맞는 경험부터 찾기',
    },
    {
      situation: '경험은 있는데 글이 안 된다면',
      program: '자소서 챌린지',
      outcome: '서류에서 읽히는 문장 만들기',
    },
    {
      situation: '포트폴리오 구성이 약하다면',
      program: '포트폴리오 챌린지',
      outcome: '경험을 성과 중심으로 재구성하기',
    },
    {
      situation: '서류는 붙는데 면접에서 떨어진다면',
      program: '면접 챌린지',
      outcome: '경험 기반 답변 세트 만들기',
    },
    {
      situation: '방향 자체가 안 잡힌다면',
      program: '1:1 멘토링',
      outcome: '현직자와 준비 우선순위 정하기',
    },
  ] satisfies PathMatchRow[],
} as const;
