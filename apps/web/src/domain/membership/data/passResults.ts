// 개편 시안 5 — 합격 사례 (REAL RESULTS).
//
// 카드는 시안에서 **읽히는 것만** 넣는다. 시안은 자동 흐름 캐러셀이라 좌우 끝 카드가
// 흐리게 잘려 있고, 맨 왼쪽 한 장은 회사명이 「…라스윗 / …인 마케팅 / 인턴」까지만 보여
// 회사를 특정할 수 없다. 가짜 회사명을 지어내느니 그 한 장은 뺀다 (PRD 7절 A).
// 운영에서 실제 목록을 받으면 여기 배열에 줄을 더하면 된다 — 화면은 개수를 따라간다.

/** 시안에 나오는 고용형태 3종. 이 셋 말고는 배지 모양이 정의돼 있지 않다 */
export type PassResultEmployment = '정규직' | '인턴' | '전환형 인턴';

export interface PassResultCard {
  company: string;
  /** 합격 직무. 시안 그대로 옮긴다 */
  role: string;
  employment: PassResultEmployment;
}

export const PASS_RESULTS = {
  eyebrow: 'REAL RESULTS',
  titleLines: ['먼저 합격한 참여자들도', '지원서 초안부터 시작했습니다.'],
  /** 제목 첫 줄에서 색이 바뀌는 어절 */
  titleHighlight: '합격',
  subLines: [
    '렛츠커리어 마케팅 챌린지에서 직무를 탐색하고',
    '자신의 경험으로부터 지원 서류 초안을 구체화한 참여자들의 실제 합격 사례입니다.',
  ],
  /** 카드 하단 공통 문구. 합격자 이름은 시안에서도 가려져 있다 */
  studentNote: '***님 · 렛츠커리어 마케팅 챌린지 수강생',
  footnote:
    '초안을 써봐야 무엇을 활용하고, 어디에 지원하고, 무엇을 보완할지 알 수 있습니다.',
  anchorId: 'pass-results',
  cards: [
    { company: '라라스윗', role: '마케팅 직무', employment: '정규직' },
    { company: '앳홈 · 톰 브랜드', role: 'CRM 마케터', employment: '정규직' },
    { company: '뤼튼', role: '마케팅', employment: '인턴' },
    { company: '라포랩스', role: '신사업 콘텐츠 마케팅', employment: '인턴' },
    { company: 'BAT', role: '퍼포먼스 마케팅', employment: '전환형 인턴' },
  ] satisfies PassResultCard[],
} as const;
