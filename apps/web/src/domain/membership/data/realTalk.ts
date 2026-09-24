// 시안 1.png — REAL TALK. 취준생 질문 말풍선 5개와 막히는 4지점으로 넘어가는 다리.
//
// 4영역 카드(01~04)의 문구는 여기에 없다. `data/checkup.ts` 의 CHECKUP_AREAS 가
// 유일한 출처이고, 이 섹션은 그 값을 그린다.

export interface RealTalkBubble {
  /** '취준생 A' */
  who: string;
  lines: readonly string[];
  /** 시안에서 연보라 배경에 우측 정렬인 말풍선 (B · D) */
  accent: boolean;
}

export const REAL_TALK = {
  eyebrow: 'REAL TALK',
  titleLines: ['마케팅 취준생들이', '가장 많이 하는 질문'],
  bubbles: [
    {
      who: '취준생 A',
      lines: ['콘텐츠 마케팅 경험으로', '그로스 마케터에 지원해도 될까요?'],
      accent: false,
    },
    {
      who: '취준생 B',
      lines: [
        '개인 SNS를 운영했는데 성과가 크지 않아요.',
        '이것도 포트폴리오에 쓸 수 있나요?',
      ],
      accent: true,
    },
    {
      who: '취준생 C',
      lines: ['대외활동을 더 해야 할까요,', '이제 인턴에 지원해도 될까요?'],
      accent: false,
    },
    {
      who: '취준생 D',
      lines: [
        '데이터 분석 프로젝트를',
        '그로스 마케팅 경험으로 연결해도 될까요?',
      ],
      accent: true,
    },
    {
      who: '취준생 E',
      lines: [
        '포트폴리오까지 만들었는데',
        '왜 계속 서류에서 떨어지는지 모르겠어요.',
      ],
      accent: false,
    },
  ] satisfies RealTalkBubble[],

  bridgeLines: ['모두 다른 질문 같지만,', '막히는 지점은 크게 4가지였습니다.'],
  /** bridgeLines 안에서 주황으로 강조하는 어절 */
  bridgeHighlight: '4가지',

  outroLines: [
    '전부 한꺼번에 준비하려 하지 말고,',
    '1분 무료 진단으로 무엇부터 준비해야 할지 확인해보세요.',
  ],
  /** outroLines 안에서 남보라로 강조하는 어절 */
  outroHighlight: '무엇부터 준비해야 할지 확인',

  ctaLabel: '무료 진단 바로 하기',
} as const;
