// 개편 시안 8 — 10주 플레이북 인트로. 매트릭스(CoursePlanSection) 바로 위에 놓인다.
//
// 이 섹션은 아래 매트릭스·대시보드가 무엇인지 먼저 말해 주는 자리다. 문구가 시안에
// 있는 그대로여야 아래 두 덩어리(9·10번 시안)와 이름이 맞는다.

/** 강조 어절 한 개를 품은 한 줄. 어절 위치가 줄마다 달라 통째로 자른다 */
export interface PlaybookIntroLine {
  lead: string;
  strong: string;
  tail: string;
  /** true 면 강조 어절이 파랑, false 면 본문색 굵게 */
  accent: boolean;
}

export const PLAYBOOK_INTRO = {
  anchorId: 'playbook-intro',
  /** 잠금 배지 — 아래 플레이북이 패스 참여자에게만 열린다는 표시 */
  badge: '마케팅 올인원 패스 참여자 전용',
  badgeIcon: '🔒',
  titleLines: ['매주 뭘 해야 할지', '또 고민하지 않도록'],
  descLines: [
    {
      lead: '패스 참여자에게 ',
      strong: '‘10주 마케팅 취준 플레이북’',
      tail: '을 제공합니다.',
      accent: true,
    },
    {
      lead: '내 현재 준비 상태에 맞춰 ',
      strong: '10주 동안 무엇을 해야 하는지',
      tail: ' 확인할 수 있습니다.',
      accent: false,
    },
  ] satisfies PlaybookIntroLine[],
  /**
   * 플레이북이 한 주에 묶어 주는 것들. 순서가 곧 한 주를 보내는 순서다 —
   * 할 일에서 시작해 진행 상황으로 닫는다. 섞으면 흐름이 사라진다.
   */
  chips: [
    '이번 주 해야 할 일',
    '필요한 자료',
    '참여할 챌린지 · 세미나',
    '확인할 채용공고',
    '만들어야 할 결과물',
    '나의 진행 상황',
  ],
  footer: {
    lead: '단순 일정표가 아니라, 이 모든 걸 한 곳에서 관리할 수 있는 ',
    strong: '10주 마케팅 취업 준비 대시보드',
    tail: '입니다.',
    accent: true,
  } satisfies PlaybookIntroLine,
} as const;
