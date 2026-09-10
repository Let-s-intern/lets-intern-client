// 시안 5 — "막연한 취준이 아니라, 실제 지원할 수 있는 상태로" (YOUR JOB ROADMAP).
// 3카드 + 하단 강조 밴드.
//
// 기존 하반기 멤버십은 같은 자리에 허브 앤 스포크 다이어그램을 그렸다. 시안이 3카드로
// 바뀌어 데이터도 그 형태로 맞춘다.

export interface SolutionCard {
  /** 카드 상단 라벨 (01 EXPERIENCE 등) */
  index: string;
  label: string;
  titleLines: string[];
  body: string[];
  /** 카드 하단 태그/체크 목록. 없으면 그리지 않는다 */
  chips?: string[];
  checks?: string[];
}

export const SOLUTION = {
  eyebrow: 'YOUR JOB ROADMAP',
  title: '막연한 취준이 아니라, 실제 지원할 수 있는 상태로',
  subLines: [
    '10주 동안 프로그램을 듣는 데서 끝나지 않습니다.',
    '내 경험이 정리된 지원 서류와 직무별 지원 전략을 완성해 실제 공고에 지원할 수 있는 상태까지 나아갑니다.',
  ],
  cards: [
    {
      index: '01',
      label: 'EXPERIENCE',
      titleLines: ['흩어져 있던 경험은', '직무에 맞는 강점으로'],
      body: [
        '인턴·대외활동·프로젝트 경험을 정리하고,',
        '지원 직무에 활용할 핵심 경험을 선별합니다.',
      ],
      chips: ['대외활동', '인턴', '프로젝트'],
    },
    {
      index: '02',
      label: 'DOCUMENTS',
      titleLines: ['미완성이던 서류는', '바로 제출할 결과물로'],
      body: [
        '이력서·자기소개서·포트폴리오를 작성하고,',
        '피드백을 반영해 실제 지원 수준으로 완성합니다.',
      ],
    },
    {
      index: '03',
      label: 'STRATEGY',
      titleLines: ['막연했던 준비는', '나만의 지원 전략으로'],
      body: [
        '어떤 공고에 지원하고 무엇을 보완할지,',
        '스스로 판단할 수 있는 기준을 만듭니다.',
      ],
      checks: ['목표 직무 설정', '지원 공고 선별', '다음 준비 순서 확인'],
    },
  ] satisfies SolutionCard[],
  /** 하단 어두운 강조 밴드 */
  bandLead: '패스가 끝날 때 남는 건 수강 기록이 아니라',
  bandMain: '실제 지원에 사용할 수 있는 결과물입니다.',
} as const;
